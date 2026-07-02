"""Momentum via EMA-crossover op 1h candles, gefilterd met RSI tegen whipsaws.

Entry:  EMA(fast) kruist omhoog door EMA(slow) én RSI in [rsi_min, rsi_max]
        (momentum bevestigd, maar niet overbought).
Exit:   EMA(fast) kruist omlaag door EMA(slow). Stop-loss/take-profit van de
        risk engine blijven daarnaast altijd actief.

params (defaults): fast=12, slow=26, rsi_period=14, rsi_min=50, rsi_max=70
"""

from __future__ import annotations

import math
from datetime import datetime

from ..indicators import ema, rsi
from ..models import Candle, Position, Side, Signal
from . import Strategy, register


@register
class MACrossStrategy(Strategy):
    name = "momentum_ma_cross"
    candle_interval = "1h"
    candle_limit = 120  # ruim genoeg voor EMA(26) + RSI(14) warm-up

    def generate_signals(self, candles: dict[str, list[Candle]],
                         positions: list[Position], now: datetime) -> list[Signal]:
        fast = int(self.params.get("fast", 12))
        slow = int(self.params.get("slow", 26))
        rsi_p = int(self.params.get("rsi_period", 14))
        rsi_min = float(self.params.get("rsi_min", 50))
        rsi_max = float(self.params.get("rsi_max", 70))
        signals: list[Signal] = []

        for pair in self.cfg.pairs:
            series = candles.get(pair) or []
            closes = [c.close for c in series]
            if len(closes) < slow + 2:
                continue
            f, s = ema(closes, fast), ema(closes, slow)
            if any(math.isnan(x) for x in (f[-1], f[-2], s[-1], s[-2])):
                continue
            diff_now, diff_prev = f[-1] - s[-1], f[-2] - s[-2]
            crossed_up = diff_prev <= 0 < diff_now
            crossed_down = diff_prev >= 0 > diff_now

            # zelfde candle niet twee keer signaleren (cycle-interval < candle-interval)
            state = self.load_state(pair)
            last_ts = series[-1].ts
            if state.get("last_signal_ts") == last_ts:
                continue

            holding = any(p.pair == pair and p.amount > 0 for p in positions)
            if crossed_up and not holding:
                r = rsi(closes, rsi_p)[-1]
                if math.isnan(r) or not (rsi_min <= r <= rsi_max):
                    continue  # RSI-filter: geen bevestiging → whipsaw-risico
                state["last_signal_ts"] = last_ts
                self.save_state(pair, state)
                signals.append(Signal(pair=pair, side=Side.BUY,
                                      reason=f"EMA{fast}/{slow} bullish cross, RSI {r:.0f}",
                                      strategy=self.name))
            elif crossed_down and holding:
                state["last_signal_ts"] = last_ts
                self.save_state(pair, state)
                signals.append(Signal(pair=pair, side=Side.SELL,
                                      reason=f"EMA{fast}/{slow} bearish cross",
                                      strategy=self.name))
        return signals
