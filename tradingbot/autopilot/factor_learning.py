"""Factor-leerlus — forward-only: welke informatie bleek achteraf nuttig?

Elke observatie (factor-score voor een coin op moment T) wordt pas ná een horizon
beoordeeld tegen de werkelijke koersbeweging tussen T en T+horizon. Klopte de richting
(positieve score → koers omhoog), dan telt dat als 'hit'. Zo bouwt elke factor een eigen
betrouwbaarheid op — gemeten, niet aangenomen, en zonder leakage (we kijken alleen
vooruit, nooit terug op data die het model al kende).

De geleerde betrouwbaarheid stuurt het *effectieve gewicht* van een factor in de
gedachtegang: een factor die het structureel mis heeft, vervaagt vanzelf. Dit raakt
bewust NIET de order-logica van de getoetste prijsstrategieën — het maakt alleen de
uitleg (en de gated research-voorstellen) slimmer.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta

log = logging.getLogger("autopilot.learning")

HORIZON_HOURS = 24.0        # over welke termijn een factor-observatie wordt afgerekend
SAMPLE_SECONDS = 3600       # hoogstens één observatie-batch per uur (houdt de tabel klein)
DEADBAND = 0.05             # scores dichter bij 0 dan dit tellen niet mee (ruis)


def reliability_multiplier(precision: float) -> float:
    """Betrouwbaarheid (0..1, krimp naar 0,5) → gewichtsvermenigvuldiger.

    0,5 (geen bewijs) → 1,0 (ongewijzigd). Hoger tilt op tot ~1,6; lager knijpt af
    tot ~0,4. Door de krimp in de precisie beweegt dit pas echt bij voldoende data."""
    return max(0.4, min(1.6, 1.0 + (precision - 0.5) * 3.0))


def grade_due(db, prices: dict[str, float], now: datetime) -> int:
    """Beoordeel alle observaties waarvan de horizon is verstreken. Geeft aantal terug."""
    graded = 0
    for obs in db.due_factor_obs(now.isoformat(timespec="seconds")):
        price_now = prices.get(obs["pair"])
        if not price_now or obs["price"] <= 0:
            db.resolve_factor_obs(obs["id"], obs["factor_key"], None, 0.0)  # onbeoordeelbaar → laten vallen
            continue
        fwd = price_now / obs["price"] - 1.0
        sign = 1 if obs["score"] > 0 else -1 if obs["score"] < 0 else 0
        if sign == 0:
            db.resolve_factor_obs(obs["id"], obs["factor_key"], None, 0.0)
            continue
        edge = fwd * sign
        db.resolve_factor_obs(obs["id"], obs["factor_key"], edge > 0, edge)
        graded += 1
    return graded


def record_observations(db, reads: dict, prices: dict[str, float], now: datetime) -> None:
    """Leg de factor-scores van deze cycle vast om later af te rekenen. Gegate op
    SAMPLE_SECONDS zodat een 1-minuut-bot de tabel niet laat exploderen."""
    last = db.get_meta("factor_obs_last")
    if last:
        try:
            if (now - datetime.fromisoformat(last)).total_seconds() < SAMPLE_SECONDS:
                return
        except (ValueError, TypeError):
            pass
    ts = now.isoformat(timespec="seconds")
    due = (now + timedelta(hours=HORIZON_HOURS)).isoformat(timespec="seconds")
    n = 0
    for pair, read in reads.items():
        price = prices.get(pair)
        if not price:
            continue
        for f in read.factors:
            if abs(f.score) < DEADBAND:
                continue
            db.record_factor_obs(ts=ts, due_ts=due, factor_key=f.key,
                                 pair=pair, score=f.score, price=price)
            n += 1
    if n:
        db.set_meta("factor_obs_last", ts)
        log.debug("leerlus: %d observaties vastgelegd (afrekenen over %.0fu)", n, HORIZON_HOURS)
