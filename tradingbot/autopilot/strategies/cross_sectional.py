"""Cross-sectional momentum (relatieve sterkte) — een fundamenteel andere hypothese
dan de single-asset strategieën: niet "koop BTC omdat BTC iets doet", maar "rangschik
alle coins in het universe op hun recente rendement en houd de sterkste".

Elke `rebalance_days` dagen:
  1. bereken per coin het rendement over de laatste `lookback_days` dagen,
  2. neem de top `top_n` als doelmandje,
  3. verkoop wat we aanhouden maar uit de top is gevallen (rotatie),
  4. koop de nieuwe toppers (gelijk gewicht: kapitaal / top_n per slot).

Long-only (Bitvavo is spot; geen short mogelijk). Exits via rotatie én via de
stop-loss/take-profit van de risk engine. Volledig deterministisch en backtestbaar:
gebruikt alleen historische koersen, geen externe data → geen leakage.

Let op (survivorship bias): de uitkomst hangt af van wélke coins in het universe
zitten. Kies je achteraf de overlevers, dan flatteert dat het resultaat. Lees de
uitkomst daarom altijd naast buy-and-hold van dezelfde mand.

params (defaults): lookback_days=30, top_n=5, rebalance_days=7
"""

from __future__ import annotations

from datetime import datetime, timezone

from ..models import Candle, Position, Side, Signal
from . import Strategy, register

STATE_KEY = "_global"  # rebalance-timing geldt voor de hele strategie, niet per pair


@register
class CrossSectionalStrategy(Strategy):
    name = "cross_sectional"
    candle_interval = "1d"   # dag-candles; in de backtester geaggregeerd uit 1h
    candle_limit = 120       # ruim voor lookbacks tot ~90 dagen

    def generate_signals(self, candles: dict[str, list[Candle]],
                         positions: list[Position], now: datetime) -> list[Signal]:
        lookback = int(self.params.get("lookback_days", 30))
        top_n = max(1, int(self.params.get("top_n", 5)))
        rebalance_days = float(self.params.get("rebalance_days", 7))

        # ── rebalance-gate: alleen op vaste intervallen herwegen ──
        state = self.db.get_strategy_state(self.name, STATE_KEY)
        last = state.get("last_rebalance_ts")
        if last is not None:
            elapsed_d = (now - datetime.fromtimestamp(last, tz=timezone.utc)).total_seconds() / 86400
            if elapsed_d < rebalance_days:
                return []

        # ── rangschik het universe op relatieve sterkte ──
        scores: dict[str, float] = {}
        for pair in self.cfg.pairs:
            c = candles.get(pair) or []
            if len(c) < lookback + 1:
                continue  # onvoldoende historie (o.a. net gelistte coins) → overslaan
            past, cur = c[-(lookback + 1)].close, c[-1].close
            if past > 0:
                scores[pair] = cur / past - 1.0
        if not scores:
            return []

        ranked = sorted(scores, key=lambda p: scores[p], reverse=True)
        target = set(ranked[:top_n])
        held = {p.pair for p in positions if p.amount > 0}
        slot_eur = self.cfg.capital_eur / top_n

        signals: list[Signal] = []
        # verkoop wie uit de top is gevallen
        for pair in held - target:
            signals.append(Signal(pair=pair, side=Side.SELL,
                                  reason=f"cross-sectional: uit top-{top_n} ({lookback}d)",
                                  strategy=self.name))
        # koop de nieuwe toppers (gelijk gewicht; risk engine kan verkleinen/blokkeren)
        for pair in ranked[:top_n]:
            if pair not in held:
                signals.append(Signal(pair=pair, side=Side.BUY, amount_eur=slot_eur,
                                      reason=f"cross-sectional: top-{top_n}, "
                                             f"{lookback}d rel. sterkte {scores[pair]*100:+.1f}%",
                                      strategy=self.name))

        state["last_rebalance_ts"] = now.timestamp()
        self.db.set_strategy_state(self.name, STATE_KEY, state)
        return signals
