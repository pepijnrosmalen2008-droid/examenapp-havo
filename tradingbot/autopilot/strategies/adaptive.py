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
from ..config import MIN_ORDER_EUR
from ..factors import compute_reads
from ..models import Candle, Position, Side, Signal
from . import Strategy, register

log = logging.getLogger("autopilot.strategy.adaptive")


@register
class AdaptiveFactorStrategy(Strategy):
    name = "adaptive"
    candle_interval = "1h"
    candle_limit = 200  # ruim genoeg voor de prijsfactoren (momentum/trend/vol/drawdown)

    def __init__(self, cfg, db):
        super().__init__(cfg, db)
        # Candle-resolutie instelbaar: kort (bv. 15m/5m) = reflex-daytrader; lang (1h/1d) = rustiger.
        self.candle_interval = str(self.params.get("candle_interval", self.candle_interval))
        self.candle_limit = int(self.params.get("candle_limit", self.candle_limit))

    def generate_signals(self, candles: dict[str, list[Candle]],
                         positions: list[Position], now: datetime) -> list[Signal]:
        buy_threshold = float(self.params.get("buy_threshold", 0.25))
        sell_threshold = float(self.params.get("sell_threshold", -0.10))
        min_confidence = float(self.params.get("min_confidence", 0.15))
        max_positions = int(self.params.get("max_positions", 5))
        # Kostenpoort: alleen kopen als de verwachte beweging de rondreis-kosten (fee + spread)
        # overtreft. conviction (−1..+1) × edge_scale = ruwe verwachte beweging; die moet groter
        # zijn dan cost_mult × round-trip-kosten. Zo "zoekt" de bot altijd, maar handelt hij
        # alleen als het de moeite loont — ongeacht hoe snel het ritme staat.
        edge_scale = float(self.params.get("edge_scale", 0.08))
        cost_mult = float(self.params.get("cost_mult", 1.0))
        roundtrip = fl.roundtrip_cost(self.cfg)          # fractie: 2×(fee+slippage)
        min_conviction_for_cost = (roundtrip * cost_mult) / edge_scale if edge_scale > 0 else 0.0

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
        buy_floor = max(buy_threshold, min_conviction_for_cost)
        available = self.db.get_meta_float("bot_cash_eur", self.cfg.capital_eur)
        have_cash = available >= MIN_ORDER_EUR
        signals: list[Signal] = []
        sold: set[str] = set()

        # sterkste overtuiging eerst, zodat nieuwe posities naar de beste kansen gaan
        for pair, read in sorted(reads.items(), key=lambda kv: kv[1].conviction, reverse=True):
            holding = pair in held
            if holding:
                if read.conviction <= sell_threshold:
                    sold.add(pair)
                    signals.append(Signal(pair=pair, side=Side.SELL,
                                          reason=f"overtuiging {read.conviction:+.2f} gekanteld "
                                                 f"(≤ {sell_threshold:+.2f})",
                                          strategy=self.name))
            elif (have_cash and read.conviction >= buy_floor
                  and read.confidence >= min_confidence and n_open < max_positions):
                n_open += 1
                signals.append(Signal(pair=pair, side=Side.BUY,  # grootte laat de risk engine bepalen
                                      reason=f"geleerde overtuiging {read.conviction:+.2f} "
                                             f"(zekerheid {read.confidence:.0%}, dekt kosten)",
                                      strategy=self.name))

        # ── Rotatie: geen cash maar wél een duidelijk betere kans? Verkoop de ZWAKSTE holding
        #    en koop de betere ervoor in de plaats. Zo blijft hij actief handelen ook als alles
        #    in munten zit. Alleen als de winst in overtuiging ruim boven de kosten uitkomt. ──
        rotate_margin = float(self.params.get("rotate_margin", 0.15))
        if not have_cash:
            keepers = [(p, reads[p].conviction) for p in held if p in reads and p not in sold]
            cands = [(p, r) for p, r in reads.items()
                     if p not in held and r.conviction >= buy_floor and r.confidence >= min_confidence]
            if keepers and cands:
                worst_pair, worst_conv = min(keepers, key=lambda x: x[1])
                best_pair, best_read = max(cands, key=lambda x: x[1].conviction)
                if best_read.conviction > worst_conv + rotate_margin:
                    signals.append(Signal(pair=worst_pair, side=Side.SELL,  # eerst cash vrijmaken
                                          reason=f"rotatie: ruil zwakste holding ({worst_conv:+.2f}) "
                                                 f"voor sterkere kans {best_pair} ({best_read.conviction:+.2f})",
                                          strategy=self.name))
                    signals.append(Signal(pair=best_pair, side=Side.BUY,
                                          reason=f"rotatie-koop: overtuiging {best_read.conviction:+.2f} "
                                                 f"(zekerheid {best_read.confidence:.0%})",
                                          strategy=self.name))
        return signals
