"""Self-learning strategie — handelt op de forward-only geleerde factor-overtuiging.

Dit is de laag die de leer-lus écht sluit. De andere strategieën zijn vaste regels (EMA-cross,
DCA, …); deze beslist op basis van `compute_reads`, de multi-factor-overtuiging per coin, waarin
elke factor is gewogen met zijn **geleerde betrouwbaarheid** (forward-only, kosten-net, FDR- en
drift-bewaakt). Zo ontstaat de self-learning: factoren die aantoonbaar voorspellen krijgen meer
gewicht in de overtuiging → sturen de orders; factoren die niets voorspellen zakken naar nul.

Over tijd verschuift de bot dus vanzelf naar wat gewérkt heeft — mits er iets te leren valt.
Eerlijke grens (bewust hier genoteerd): als geen enkele factor een edge heeft, convergeert deze
strategie correct naar wéinig of niet handelen. "Beter worden" kan alleen voor zover er een
leerbare edge bestaat; dit is geen garantie op winst, en zeker geen magische daytrader — de
leerhorizon is ~24u (swing), niet sub-seconde.

Beslissing per cycle (het hele universe dat de engine aanlevert):
  * koop de coins met de hoogste overtuiging boven `buy_threshold` én `min_confidence`, tot
    `max_positions` tegelijk; de risk engine bepaalt de grootte en kan blokkeren/verkleinen;
  * verkoop een positie zodra de overtuiging onder `sell_threshold` zakt (richting kantelt).
"""

from __future__ import annotations

import logging
from datetime import datetime

from .. import factor_learning as fl
from ..factors import compute_reads
from ..models import Candle, Position, Side, Signal
from . import Strategy, register

log = logging.getLogger("autopilot.strategy.adaptive")


@register
class AdaptiveFactorStrategy(Strategy):
    name = "adaptive"
    candle_interval = "1h"
    candle_limit = 200  # ruim genoeg voor de prijsfactoren (momentum/trend/vol/drawdown)

    def generate_signals(self, candles: dict[str, list[Candle]],
                         positions: list[Position], now: datetime) -> list[Signal]:
        buy_threshold = float(self.params.get("buy_threshold", 0.25))
        sell_threshold = float(self.params.get("sell_threshold", -0.10))
        min_confidence = float(self.params.get("min_confidence", 0.15))
        max_positions = int(self.params.get("max_positions", 5))

        pairs = list(self.cfg.pairs)  # door de engine al uitgebreid met het universe
        if not candles:
            return []

        # geleerde betrouwbaarheid per factor → wordt de weging in de overtuiging
        try:
            reliabilities = fl.enrich_and_correct(
                self.db.factor_reliabilities(), fl.roundtrip_cost(self.cfg),
                drift=self.db.drift_status())
        except Exception:  # noqa: BLE001 — leren mag beslissen nooit breken
            reliabilities = {}

        # externe events (nieuws/politici/on-chain) meenemen in de overtuiging
        try:
            from ..research import load_events
            events = load_events(self.cfg, now)
        except Exception:  # noqa: BLE001
            events = []

        reads = compute_reads(candles, pairs, now, events=events, reliabilities=reliabilities)
        if not reads:
            return []

        held = {p.pair for p in positions if p.amount > 0}
        n_open = len(held)
        signals: list[Signal] = []

        # sterkste overtuiging eerst, zodat nieuwe posities naar de beste kansen gaan
        for pair, read in sorted(reads.items(), key=lambda kv: kv[1].conviction, reverse=True):
            holding = pair in held
            if holding:
                if read.conviction <= sell_threshold:
                    signals.append(Signal(pair=pair, side=Side.SELL,
                                          reason=f"overtuiging {read.conviction:+.2f} gekanteld "
                                                 f"(≤ {sell_threshold:+.2f})",
                                          strategy=self.name))
            elif (read.conviction >= buy_threshold and read.confidence >= min_confidence
                  and n_open < max_positions):
                n_open += 1
                signals.append(Signal(pair=pair, side=Side.BUY,  # grootte laat de risk engine bepalen
                                      reason=f"geleerde overtuiging {read.conviction:+.2f} "
                                             f"(zekerheid {read.confidence:.0%})",
                                      strategy=self.name))
        return signals
