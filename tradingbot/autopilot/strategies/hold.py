"""Hold — een basisstrategie die uit zichzelf NIETS doet.

Bestaansreden: de nieuws-/event-bot. Die handelt niet op prijs maar op gestructureerde
events (research-laag). Door 'hold' als basisstrategie te draaien met research.enabled,
komen álle trades van de nieuws-laag — nooit van een prijs-signaal. De bot vraagt wél
candles op, zodat zijn gedachtegang (factoren, marktregime) zichtbaar blijft; hij geeft
alleen zelf geen koop/verkoop-signalen af.

Zo wordt de nieuwsbron als aparte informatiebron getest, schoon gescheiden van prijs.
"""

from __future__ import annotations

from datetime import datetime

from ..models import Candle, Position, Signal
from . import Strategy, register


@register
class HoldStrategy(Strategy):
    name = "hold"
    candle_interval = "1d"   # candles voor de gedachtegang; de strategie handelt er niet op
    candle_limit = 90

    def generate_signals(self, candles: dict[str, list[Candle]],
                         positions: list[Position], now: datetime) -> list[Signal]:
        return []
