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
    tot ~0,4. Door de krimp in de precisie beweegt dit pas echt bij voldoende data.
    Alleen gebruikt als terugval zolang er nog geen edge-cijfer is."""
    return max(0.4, min(1.6, 1.0 + (precision - 0.5) * 3.0))


# Vanaf hoeveel observaties de edge het gewicht mag sturen (daaronder krimp naar 1,0).
EDGE_CONFIDENCE_N = 30


def weight_multiplier(avg_edge: float, n: int, roundtrip_cost: float) -> float:
    """Effectieve gewichtsvermenigvuldiger op basis van de **netto verwachte return**
    (na kosten), niet op accuracy. Een factor die vaker goed dan fout zit maar door
    fees/spread/slippage tóch geld verliest, verdient géén hoger gewicht.

    net_edge = gemiddelde (return × teken score) − round-trip-kosten. 0 → 1,0;
    positief tilt op tot ~1,6; negatief knijpt af tot ~0,3. Met weinig data schuift
    het resultaat naar 1,0 (we geloven een edge pas na genoeg observaties)."""
    net = avg_edge - roundtrip_cost
    edge_mult = max(0.3, min(1.6, 1.0 + net * 60.0))   # +1%/obs netto → ~1,6; −1% → 0,4
    blend = n / (n + EDGE_CONFIDENCE_N) if n >= 0 else 0.0
    return 1.0 * (1 - blend) + edge_mult * blend


def factor_status(avg_edge: float, n: int, roundtrip_cost: float) -> str:
    """Track-record-status à la factor-competitie: verdient de factor zijn plek?"""
    net = avg_edge - roundtrip_cost
    if n < 20:
        return "observeren"          # onvoldoende data
    if net > 0.001:
        return "actief"              # positieve netto-edge
    if net >= -0.001:
        return "voorzichtig"         # rond nul
    if n >= 60 and net <= -0.003:
        return "uitgeschakeld"       # structureel negatief, veel data
    return "verzwakt"


def enrich(rel: dict[str, dict], roundtrip_cost: float) -> dict[str, dict]:
    """Voeg netto-edge, gewichts-multiplier en status toe aan de ruwe betrouwbaarheden."""
    out: dict[str, dict] = {}
    for k, v in rel.items():
        ae, n = v.get("avg_edge", 0.0), v.get("n", 0)
        out[k] = {**v,
                  "net_edge": round(ae - roundtrip_cost, 4),
                  "weight_mult": round(weight_multiplier(ae, n, roundtrip_cost), 3),
                  "status": factor_status(ae, n, roundtrip_cost)}
    return out


def roundtrip_cost(cfg) -> float:
    """Round-trip-kosten als fractie: (koop + verkoop) × (fee + slippage)."""
    c = cfg.costs
    return 2.0 * (c.taker_fee_pct + c.slippage_pct) / 100.0


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
