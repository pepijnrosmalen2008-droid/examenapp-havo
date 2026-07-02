"""DCA — vast bedrag per interval kopen. Verkopen gebeurt uitsluitend via de
take-profit/stop-loss van de risk engine. Simpelste strategie, minste kans op bugs.

params:
  amount_eur:  vast bedrag per aankoop (default 10)
  every_hours: koopinterval in uren (default 24)
"""

from __future__ import annotations

from datetime import datetime, timezone

from ..models import Candle, Position, Side, Signal
from . import Strategy, register


@register
class DCAStrategy(Strategy):
    name = "dca"
    candle_interval = None  # DCA heeft geen candles nodig

    def generate_signals(self, candles: dict[str, list[Candle]],
                         positions: list[Position], now: datetime) -> list[Signal]:
        amount = float(self.params.get("amount_eur", 10))
        every_h = float(self.params.get("every_hours", 24))
        signals: list[Signal] = []

        for pair in self.cfg.pairs:
            state = self.load_state(pair)
            last = state.get("last_buy_ts")
            if last is not None:
                elapsed_h = (now - datetime.fromtimestamp(last, tz=timezone.utc)).total_seconds() / 3600
                if elapsed_h < every_h:
                    continue
            signals.append(Signal(
                pair=pair, side=Side.BUY, amount_eur=amount,
                reason=f"DCA: periodieke aankoop (elke {every_h:g}u)", strategy=self.name,
            ))
        return signals

    def on_fill(self, pair: str, side: Side, now: datetime) -> None:
        """Aangeroepen door de engine na een gevulde order van deze strategie."""
        if side == Side.BUY:
            state = self.load_state(pair)
            state["last_buy_ts"] = now.timestamp()
            self.save_state(pair, state)
