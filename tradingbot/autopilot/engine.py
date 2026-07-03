"""Trading engine — de cycle die alles orchestreert.

Volgorde per cycle:
  1. reconcile: hangende orders uit een eventuele crash afhandelen (idempotentie)
  2. prijzen + posities verversen, equity bepalen, dag-rollover
  3. kill switches: max drawdown → liquideren + permanent stoppen;
     max dagverlies → liquideren + 24u pauze
  4. per-positie stop-loss/take-profit exits
  5. strategie-signalen genereren en door de risk engine halen
  6. goedgekeurde orders uitvoeren (paper of live, zelfde codepad)

De engine is de ENIGE plek die orders plaatst, en elke order gaat eerst als
intent het journal in (crash-safe, geen dubbele orders).
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from .config import AppConfig, TradingMode
from .database import Database, utcnow
from .models import OrderStatus, Position, RiskDecision, Side, Signal
from .regime import RegimeFilter
from .risk import RiskEngine
from .strategies import Strategy

log = logging.getLogger("autopilot.engine")
AMS = ZoneInfo("Europe/Amsterdam")


class NullNotifier:
    def send(self, text: str) -> None:  # pragma: no cover - triviaal
        pass


class TradingEngine:
    def __init__(self, cfg: AppConfig, db: Database, exchange, risk: RiskEngine,
                 strategy: Strategy, mode: TradingMode, notifier=None, research_agent=None):
        self.cfg = cfg
        self.db = db
        self.x = exchange
        self.risk = risk
        self.strategy = strategy
        self.mode = mode
        self.notify = notifier or NullNotifier()
        self.regime = RegimeFilter(cfg, db)
        self.research_agent = research_agent  # optioneel; voorstellen gaan door de risk engine

    # ── startup ───────────────────────────────────────────────────────

    def startup(self) -> None:
        """Eenmalige initialisatie + crash-recovery. Idempotent."""
        stored_mode = self.db.get_meta("mode")
        if stored_mode and stored_mode != self.mode.value:
            raise RuntimeError(
                f"Database {self.db.path} is aangemaakt in {stored_mode} mode, maar de bot "
                f"start nu in {self.mode.value}. Gebruik per mode een eigen database "
                "(verwijder autopilot.db of pas de mode aan)."
            )
        self.db.set_meta("mode", self.mode.value)
        if self.db.get_meta("starting_capital") is None:
            self.db.set_meta("starting_capital", str(self.cfg.capital_eur))
            self.db.set_meta("bot_cash_eur", str(self.cfg.capital_eur))
            self.db.set_meta("start_date", utcnow())
        self.reconcile()

    def reconcile(self) -> None:
        """Herstel na crash: PENDING/PLACED orders afhandelen zonder ze te dupliceren."""
        for row in self.db.pending_orders():
            coid = row["client_order_id"]
            found = None
            if hasattr(self.x, "find_order_by_client_id"):
                try:
                    found = self.x.find_order_by_client_id(coid, row["pair"])
                except Exception:  # noqa: BLE001 — netwerk kapot ≠ order kwijt
                    log.exception("reconcile: kon order %s niet opvragen; laat staan", coid)
                    continue
            if found is None:
                # Intent gejournald maar nooit (aantoonbaar) geplaatst → NIET opnieuw
                # plaatsen; markeer als verlaten. De strategie geeft desnoods een nieuw signaal.
                self.db.mark_order(coid, OrderStatus.ABANDONED)
                log.warning("reconcile: order %s (%s %s) niet op exchange gevonden → ABANDONED",
                            coid, row["side"], row["pair"])
                continue
            status = (found.get("status") or "").lower()
            if status == "closed":
                price = float(found.get("average") or found.get("price") or 0)
                amount = float(found.get("filled") or found.get("amount") or 0)
                cost = float(found.get("cost") or (price * amount))
                fee = self._fee_eur(found)
                self._apply_fill(coid, row["pair"], Side(row["side"]), price=price,
                                 amount_asset=amount, cost_eur=cost, fee_eur=fee)
                log.info("reconcile: order %s bleek gevuld; fill verwerkt", coid)
            elif status == "canceled":
                self.db.mark_order(coid, OrderStatus.CANCELLED)
            else:
                log.warning("reconcile: order %s staat nog open op de exchange (status=%s)", coid, status)

    # ── cycle ─────────────────────────────────────────────────────────

    def cycle(self, now: datetime | None = None) -> None:
        now = now or datetime.now(timezone.utc)
        if self.risk.is_halted():
            log.info("cycle overgeslagen: bot is permanent gestopt (max drawdown)")
            return
        if self._cb_paused(now):
            log.warning("cycle overgeslagen: circuit breaker cooldown (API-storingen)")
            return

        self.reconcile()

        try:
            prices = {pair: self.x.ticker_price(pair) for pair in self.cfg.pairs}
        except Exception:
            self._cb_failure(now)
            raise
        self.db.set_meta("cb_failures", "0")  # data komt weer door
        positions = self.db.open_positions()
        self._update_peaks(positions, prices)

        cash = self._cash_eur()
        equity = cash + sum(p.amount * prices.get(p.pair, p.avg_price) for p in positions)
        self._day_rollover(now, equity)
        self.db.snapshot_equity(equity, cash)

        # ── kill switches ────────────────────────────────────────────
        breached, dd = self.risk.drawdown_breached(equity)
        if breached:
            log.critical("MAX DRAWDOWN bereikt: %.2f%% — alles naar EUR, bot stopt permanent", dd)
            self._liquidate_all(positions, prices, reason=f"max drawdown {dd:.2f}%")
            self.risk.trigger_halt(f"drawdown {dd:.2f}% ≥ {self.cfg.risk.max_drawdown_pct}% "
                                   f"(equity €{equity:.2f})")
            self.notify.send(f"⛔ KILL SWITCH: max drawdown {dd:.2f}% bereikt. Alle posities "
                             f"verkocht, bot is permanent gestopt. Herstart handmatig met "
                             f"status.py --clear-halt.")
            return

        if not self.risk.is_paused(now):
            breached, loss = self.risk.daily_loss_breached(equity)
            if breached:
                log.error("MAX DAGVERLIES bereikt: %.2f%% — posities sluiten, 24 uur pauze", loss)
                self._liquidate_all(positions, prices, reason=f"dagverlies {loss:.2f}%")
                self.risk.trigger_daily_pause(f"dagverlies {loss:.2f}% ≥ "
                                              f"{self.cfg.risk.max_daily_loss_pct}%", now)
                self.notify.send(f"🟠 Dag-kill-switch: verlies vandaag {loss:.2f}%. Alle posities "
                                 f"gesloten; bot pauzeert 24 uur.")
                return
        else:
            log.info("cycle: dag-pauze actief, geen handel")
            return

        # ── per-positie SL/TP exits (gaan ook bij wijde spread altijd door:
        #    kapitaal beschermen weegt zwaarder dan fill-kwaliteit) ─────
        for pos in self.db.open_positions():
            exit_sig = self.risk.position_exit_signal(pos, prices[pos.pair])
            if exit_sig:
                self._route_signal(exit_sig, prices)

        # ── circuit breaker: pairs met abnormale spread deze cycle overslaan ──
        blocked_pairs = self._spread_blocked_pairs()

        # ── strategie ────────────────────────────────────────────────
        candles = {}
        if self.strategy.candle_interval:
            candles = {pair: [self._to_candle(c) for c in
                              self.x.candles(pair, self.strategy.candle_interval,
                                             self.strategy.candle_limit)]
                       for pair in self.cfg.pairs}
        signals = self.strategy.generate_signals(candles, self.db.open_positions(), now)
        for sig in self.regime.apply(signals, self.x):
            if sig.pair in blocked_pairs:
                continue
            self._route_signal(sig, prices, now=now)

        # ── research-laag (optioneel): VOORSTELLEN, gaan verplicht door de risk engine ──
        if self.research_agent is not None:
            from .research import to_trade_signals
            proposals = self.research_agent.evaluate(self.cfg.pairs, now)
            for sig in to_trade_signals(proposals, self.cfg):
                if sig.pair in blocked_pairs:
                    continue
                self._route_signal(sig, prices, now=now)

    # ── uitvoering ────────────────────────────────────────────────────

    def _route_signal(self, sig: Signal, prices: dict[str, float],
                      now: datetime | None = None, forced: bool = False) -> None:
        positions = self.db.open_positions()
        cash = self._cash_eur()
        equity = cash + sum(p.amount * prices.get(p.pair, p.avg_price) for p in positions)
        decision = self.risk.evaluate(sig, cash_eur=cash, equity_eur=equity,
                                      positions=positions, prices=prices, forced=forced)
        if not decision.allowed:
            if sig.strategy == "risk":  # geblokkeerde SL/TP-exit is opmerkelijk genoeg voor een melding
                self.notify.send(f"⚠️ Exit geblokkeerd: {sig.pair} — {decision.reason}")
            return
        self._execute(decision, now=now)

    def _execute(self, decision: RiskDecision, now: datetime | None = None) -> None:
        sig = decision.signal
        assert sig is not None
        now = now or datetime.now(timezone.utc)

        # Stap 1: intent journalen (crash hierna → reconcile markeert ABANDONED, geen dubbele order)
        coid = self.db.journal_order_intent(
            sig.pair, sig.side, amount_eur=decision.approved_eur or None,
            amount_asset=decision.approved_asset, reason=sig.reason, strategy=sig.strategy)

        # Stap 2: plaatsen (paper en live delen dit codepad; alleen `self.x` verschilt)
        try:
            if sig.side == Side.BUY:
                fill = self.x.place_market_order(sig.pair, Side.BUY,
                                                 amount_eur=decision.approved_eur,
                                                 client_order_id=coid)
            else:
                fill = self.x.place_market_order(sig.pair, Side.SELL,
                                                 amount_asset=decision.approved_asset,
                                                 client_order_id=coid)
        except Exception as e:  # noqa: BLE001
            self.db.mark_order(coid, OrderStatus.REJECTED)
            log.exception("order %s geweigerd/mislukt: %s", coid, e)
            self.notify.send(f"❌ Order mislukt: {sig.side.value} {sig.pair} — {e}")
            return

        # Stap 3: fill verwerken
        price = float(fill.get("price") or 0)
        amount = float(fill.get("amount") or 0)
        cost = float(fill.get("cost") or price * amount)
        fee = self._fee_eur(fill)
        realized = self._apply_fill(coid, sig.pair, sig.side, price=price,
                                    amount_asset=amount, cost_eur=cost, fee_eur=fee,
                                    exchange_order_id=str(fill.get("id") or ""))

        if hasattr(self.strategy, "on_fill") and sig.strategy == self.strategy.name:
            self.strategy.on_fill(sig.pair, sig.side, now)

        pnl_txt = f" | P&L €{realized:+.2f}" if sig.side == Side.SELL else ""
        msg = (f"{'🟢' if sig.side == Side.BUY else '🔴'} {self.mode.value}: "
               f"{sig.side.value} {sig.pair} {amount:.8f} @ €{price:.2f} "
               f"(€{cost:.2f}, fee €{fee:.2f}){pnl_txt} — {sig.reason}")
        log.info(msg)
        self.notify.send(msg)

    def _apply_fill(self, coid: str, pair: str, side: Side, *, price: float,
                    amount_asset: float, cost_eur: float, fee_eur: float,
                    exchange_order_id: str | None = None) -> float:
        """Werk posities + bot-cash bij en markeer de order FILLED. Geeft realized P&L terug."""
        realized = 0.0
        cash = self._cash_eur()
        if side == Side.BUY:
            # cost_eur is inclusief fee bij BUY op quote-bedrag
            self.db.upsert_position(pair, amount_asset, price)
            self._set_cash(cash - cost_eur)
        else:
            realized = self.db.reduce_position(pair, amount_asset, price)
            self._set_cash(cash + cost_eur)
        self.db.mark_order(coid, OrderStatus.FILLED, exchange_order_id=exchange_order_id,
                           price=price, amount_asset=amount_asset, amount_eur=cost_eur, fee_eur=fee_eur)
        return realized

    def _liquidate_all(self, positions: list[Position], prices: dict[str, float],
                       reason: str) -> None:
        """Kill-switch-liquidatie: alle posities naar EUR, geforceerd langs de risk engine."""
        for pos in positions:
            if pos.amount <= 0:
                continue
            sig = Signal(pair=pos.pair, side=Side.SELL, amount_asset=pos.amount,
                         reason=f"kill-switch liquidatie: {reason}", strategy="risk")
            self._route_signal(sig, prices, forced=True)

    def emergency_stop(self, reason: str) -> None:
        """Handmatige noodstop (bv. via het webportaal): alles naar EUR + permanente halt.

        Zelfde eindtoestand als de drawdown-kill-switch; opheffen kan alléén op de
        machine zelf met status.py --clear-halt.
        """
        if self.risk.is_halted():
            log.info("noodstop: bot was al gestopt")
            return
        try:
            prices = {pair: self.x.ticker_price(pair) for pair in self.cfg.pairs}
        except Exception:  # noqa: BLE001 — ook zonder prijzen moet de halt doorgaan
            log.exception("noodstop: prijzen niet beschikbaar; halt zonder liquidatie "
                          "(posities sluiten bij de eerstvolgende geslaagde cycle niet meer — "
                          "handmatig ingrijpen vereist)")
            prices = {}
        if prices:
            self._liquidate_all(self.db.open_positions(), prices, reason=reason)
        self.risk.trigger_halt(reason)
        self.notify.send(f"⛔ NOODSTOP: {reason}. Alle posities verkocht, bot permanent "
                         f"gestopt. Opheffen kan alleen op de machine zelf "
                         f"(status.py --clear-halt).")

    # ── circuit breakers ─────────────────────────────────────────────

    def _cb_paused(self, now: datetime) -> bool:
        raw = self.db.get_meta("cb_pause_until")
        if not raw:
            return False
        if now >= datetime.fromisoformat(raw):
            self.db.del_meta("cb_pause_until")
            log.info("circuit breaker: cooldown voorbij, handel hervat")
            return False
        return True

    def _cb_failure(self, now: datetime) -> None:
        cb = self.cfg.circuit_breaker
        if not cb.enabled:
            return
        n = int(self.db.get_meta_float("cb_failures", 0)) + 1
        self.db.set_meta("cb_failures", str(n))
        log.warning("circuit breaker: API-storing %d/%d", n, cb.max_consecutive_failures)
        if n >= cb.max_consecutive_failures:
            until = (now + timedelta(minutes=cb.cooldown_minutes)).isoformat(timespec="seconds")
            self.db.set_meta("cb_pause_until", until)
            self.db.set_meta("cb_failures", "0")
            log.error("circuit breaker OPEN: %d storingen op rij → geen handel tot %s", n, until)
            self.notify.send(f"🔌 Circuit breaker: {n} API-storingen op rij; "
                             f"bot pauzeert {cb.cooldown_minutes} min (tot {until} UTC).")

    def _spread_blocked_pairs(self) -> set[str]:
        cb = self.cfg.circuit_breaker
        if not cb.enabled or not hasattr(self.x, "spread_pct"):
            return set()
        blocked: set[str] = set()
        for pair in self.cfg.pairs:
            try:
                sp = self.x.spread_pct(pair)
            except Exception:  # noqa: BLE001 — spread-check is best-effort
                continue
            if sp is not None and sp > cb.max_spread_pct:
                blocked.add(pair)
                reason = (f"circuit breaker: spread {sp:.2f}% > {cb.max_spread_pct}% — "
                          f"{pair} deze cycle niet verhandeld (exits blijven actief)")
                log.warning(reason)
                self.db.log_risk_decision(pair=pair, side=None, allowed=False,
                                          reason=reason, requested_eur=None, approved_eur=None)
        return blocked

    # ── hulpfuncties ─────────────────────────────────────────────────

    def _cash_eur(self) -> float:
        """Cash die de bot beheert. In LIVE en SHADOW bovendien gecapt op het echte EUR-saldo."""
        cash = self.db.get_meta_float("bot_cash_eur", self.cfg.capital_eur)
        if self.mode == TradingMode.LIVE and hasattr(self.x, "balances"):
            real = self.x.balances().get("EUR", 0.0)
            cash = min(cash, real)
        elif self.mode == TradingMode.SHADOW and hasattr(self.x, "real_eur"):
            real = self.x.real_eur()
            if real is not None:
                cash = min(cash, real)
        return cash

    def _set_cash(self, value: float) -> None:
        self.db.set_meta("bot_cash_eur", f"{max(value, 0.0):.6f}")

    def _day_rollover(self, now: datetime, equity: float) -> None:
        """Nieuwe (Amsterdamse) dag → dagverlies-anker resetten."""
        today = now.astimezone(AMS).date().isoformat()
        if self.db.get_meta("day_date") != today:
            self.db.set_meta("day_date", today)
            self.db.set_meta("day_start_equity", f"{equity:.6f}")
            log.info("nieuwe dag %s: dagverlies-anker gezet op €%.2f", today, equity)

    def _update_peaks(self, positions: list[Position], prices: dict[str, float]) -> None:
        for p in positions:
            price = prices.get(p.pair)
            if price and price > p.peak_price and p.id is not None:
                p.peak_price = price
                self.db.update_peak_price(p.id, price)

    @staticmethod
    def _to_candle(c):
        from .models import Candle
        if isinstance(c, Candle):  # backtester levert kant-en-klare Candles (performance)
            return c
        return Candle(ts=int(c[0]), open=float(c[1]), high=float(c[2]),
                      low=float(c[3]), close=float(c[4]), volume=float(c[5]))

    @staticmethod
    def _fee_eur(order: dict) -> float:
        if "fee_eur" in order:
            return float(order["fee_eur"] or 0)
        fee = order.get("fee") or {}
        if isinstance(fee, dict) and fee.get("currency") == "EUR":
            return float(fee.get("cost") or 0)
        return 0.0
