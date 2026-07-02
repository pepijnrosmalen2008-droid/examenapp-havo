"""Risk engine — aparte laag om elke strategie heen. Strategieën kunnen deze limieten
nooit omzeilen: elk signaal gaat door evaluate() en kan geblokkeerd of verkleind worden.

Alle beslissingen (ook blokkades) worden gelogd naar het log én naar SQLite
(tabel risk_decisions) met reden.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from .config import AppConfig, MIN_ORDER_EUR
from .database import Database
from .models import Position, RiskDecision, Side, Signal

log = logging.getLogger("autopilot.risk")


class RiskEngine:
    def __init__(self, cfg: AppConfig, db: Database):
        self.cfg = cfg
        self.db = db

    # ── kill-switch status ────────────────────────────────────────────

    def is_halted(self) -> bool:
        """Permanente stop (max drawdown bereikt). Alleen op te heffen via status.py --clear-halt."""
        return self.db.get_meta("halted") == "1"

    def is_paused(self, now: datetime | None = None) -> bool:
        """24-uurs pauze na dag-kill-switch."""
        raw = self.db.get_meta("paused_until")
        if not raw:
            return False
        now = now or datetime.now(timezone.utc)
        until = datetime.fromisoformat(raw)
        if now >= until:
            self.db.del_meta("paused_until")
            return False
        return True

    def trigger_daily_pause(self, reason: str, now: datetime | None = None) -> None:
        now = now or datetime.now(timezone.utc)
        until = (now + timedelta(hours=24)).isoformat(timespec="seconds")
        self.db.set_meta("paused_until", until)
        self._log(None, None, False, f"DAG-KILL-SWITCH: {reason}; pauze tot {until}", None, None)

    def trigger_halt(self, reason: str) -> None:
        self.db.set_meta("halted", "1")
        self.db.set_meta("halt_reason", reason)
        self._log(None, None, False, f"TOTALE KILL-SWITCH: {reason}; bot stopt permanent", None, None)

    # ── kill-switch condities ─────────────────────────────────────────

    def daily_loss_breached(self, equity_eur: float) -> tuple[bool, float]:
        """(bereikt?, verlies_pct). Anker: equity aan het begin van de (Amsterdamse) dag."""
        day_start = self.db.get_meta_float("day_start_equity", 0.0)
        if day_start <= 0:
            return False, 0.0
        loss_pct = (day_start - equity_eur) / day_start * 100
        return loss_pct >= self.cfg.risk.max_daily_loss_pct, loss_pct

    def drawdown_breached(self, equity_eur: float) -> tuple[bool, float]:
        """(bereikt?, drawdown_pct) vanaf startkapitaal."""
        start = self.db.get_meta_float("starting_capital", self.cfg.capital_eur)
        dd_pct = (start - equity_eur) / start * 100
        return dd_pct >= self.cfg.risk.max_drawdown_pct, dd_pct

    # ── per-positie exits ─────────────────────────────────────────────

    def position_exit_signal(self, pos: Position, price: float) -> Signal | None:
        """Stop-loss / take-profit / trailing check. Geeft een SELL-signaal of None."""
        r = self.cfg.risk
        pnl = pos.pnl_pct(price)
        if pnl <= -r.stop_loss_pct:
            return Signal(pair=pos.pair, side=Side.SELL, amount_asset=pos.amount,
                          reason=f"stop-loss: {pnl:.2f}% ≤ -{r.stop_loss_pct}%", strategy="risk")
        if r.take_profit_pct is None:
            return None
        if r.trailing_take_profit:
            # Trailing: zodra TP-niveau ooit is gehaald, volgen we de piek;
            # zakt de prijs stop_loss_pct onder de piek, dan verkopen we.
            tp_price = pos.avg_price * (1 + r.take_profit_pct / 100)
            if pos.peak_price >= tp_price and price <= pos.peak_price * (1 - r.stop_loss_pct / 100):
                return Signal(pair=pos.pair, side=Side.SELL, amount_asset=pos.amount,
                              reason=f"trailing take-profit: piek €{pos.peak_price:.2f}, nu €{price:.2f}",
                              strategy="risk")
            return None
        if pnl >= r.take_profit_pct:
            return Signal(pair=pos.pair, side=Side.SELL, amount_asset=pos.amount,
                          reason=f"take-profit: {pnl:.2f}% ≥ {r.take_profit_pct}%", strategy="risk")
        return None

    # ── signaal-evaluatie ─────────────────────────────────────────────

    def evaluate(self, sig: Signal, *, cash_eur: float, equity_eur: float,
                 positions: list[Position], prices: dict[str, float],
                 forced: bool = False) -> RiskDecision:
        """Beslis of een signaal doorgaat, en voor hoeveel.

        forced=True is uitsluitend voor kill-switch-liquidaties (SELL naar EUR);
        die mogen niet door pauze/halt geblokkeerd worden.
        """
        # 1. Kill-switch status
        if not forced:
            if self.is_halted():
                return self._deny(sig, "bot is permanent gestopt (max drawdown); handmatige herstart vereist")
            if self.is_paused():
                return self._deny(sig, "dag-kill-switch actief: 24 uur pauze")

        # 2. Pair-whitelist (geldt ook voor forced — we ruimen alleen eigen pairs op)
        if sig.pair not in self.cfg.pairs:
            return self._deny(sig, f"pair {sig.pair} staat niet in de whitelist {self.cfg.pairs}")

        if sig.side == Side.SELL:
            return self._evaluate_sell(sig, positions)
        return self._evaluate_buy(sig, cash_eur=cash_eur, equity_eur=equity_eur,
                                  positions=positions, prices=prices)

    def _evaluate_sell(self, sig: Signal, positions: list[Position]) -> RiskDecision:
        held = sum(p.amount for p in positions if p.pair == sig.pair)
        if held <= 0:
            return self._deny(sig, f"geen open positie in {sig.pair} om te verkopen")
        amount = held if sig.amount_asset is None else min(sig.amount_asset, held)
        self._log(sig.pair, sig.side.value, True, f"SELL toegestaan: {amount:.8f} ({sig.reason})", None, None)
        return RiskDecision(allowed=True, reason="ok", approved_asset=amount, signal=sig)

    def _evaluate_buy(self, sig: Signal, *, cash_eur: float, equity_eur: float,
                      positions: list[Position], prices: dict[str, float]) -> RiskDecision:
        r = self.cfg.risk
        requested = sig.amount_eur if sig.amount_eur is not None else cash_eur

        # 3. Dagverlies & drawdown: geen nieuwe exposure als we op/over de grens zitten
        breached, loss_pct = self.daily_loss_breached(equity_eur)
        if breached:
            return self._deny(sig, f"dagverlies {loss_pct:.2f}% ≥ limiet {r.max_daily_loss_pct}%", requested)
        breached, dd_pct = self.drawdown_breached(equity_eur)
        if breached:
            return self._deny(sig, f"drawdown {dd_pct:.2f}% ≥ limiet {r.max_drawdown_pct}%", requested)

        # 4. Position sizing: max_position_pct van (start)kapitaal per pair,
        #    minus wat er al in deze pair zit, en nooit meer dan beschikbare cash.
        capital = self.db.get_meta_float("starting_capital", self.cfg.capital_eur)
        max_pos_eur = capital * r.max_position_pct / 100
        current_exposure = sum(
            p.amount * prices.get(p.pair, p.avg_price)
            for p in positions if p.pair == sig.pair
        )
        room = max_pos_eur - current_exposure
        if room < MIN_ORDER_EUR:
            return self._deny(
                sig, f"positielimiet: {sig.pair} heeft al €{current_exposure:.2f} exposure "
                     f"van max €{max_pos_eur:.2f}", requested)

        approved = min(requested, room, cash_eur)
        if approved < MIN_ORDER_EUR:
            return self._deny(
                sig, f"ordergrootte €{approved:.2f} onder minimum €{MIN_ORDER_EUR:.0f} "
                     f"(cash €{cash_eur:.2f})", requested)

        note = "ok" if abs(approved - requested) < 0.01 else f"verkleind van €{requested:.2f} naar €{approved:.2f}"
        self._log(sig.pair, sig.side.value, True, f"BUY toegestaan: €{approved:.2f} ({note}; {sig.reason})",
                  requested, approved)
        return RiskDecision(allowed=True, reason=note, approved_eur=approved, signal=sig)

    # ── logging ───────────────────────────────────────────────────────

    def _deny(self, sig: Signal, reason: str, requested: float | None = None) -> RiskDecision:
        self._log(sig.pair, sig.side.value, False, reason, requested, None)
        return RiskDecision(allowed=False, reason=reason, signal=sig)

    def _log(self, pair: str | None, side: str | None, allowed: bool, reason: str,
             requested: float | None, approved: float | None) -> None:
        (log.info if allowed else log.warning)(
            "risk %s %s %s: %s", "ALLOW" if allowed else "BLOCK", side or "-", pair or "-", reason)
        self.db.log_risk_decision(pair=pair, side=side, allowed=allowed, reason=reason,
                                  requested_eur=requested, approved_eur=approved)
