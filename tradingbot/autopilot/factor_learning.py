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
from collections import defaultdict
from datetime import datetime, timedelta

log = logging.getLogger("autopilot.learning")

HORIZON_HOURS = 24.0        # over welke termijn een factor-observatie wordt afgerekend
SAMPLE_SECONDS = 3600       # hoogstens één observatie-batch per uur (houdt de tabel klein)
DEADBAND = 0.05             # scores dichter bij 0 dan dit tellen niet mee (ruis)

# ── Vooraf vastgelegde drempels om ruis niet als signaal te lezen ──────────────
#   Z = eenzijdige 95%-grens; een factor mag zijn gewicht pas van 1,0 laten afwijken
#   als de ondergrens van zijn netto-edge (na kosten) déze kant van nul ligt.
Z_SIGNIF = 1.64
MIN_N_SIGNIF = 30           # onder dit aantal observaties: nooit 'bewezen', altijd neutraal


def reliability_multiplier(precision: float) -> float:
    """Betrouwbaarheid (0..1, krimp naar 0,5) → gewichtsvermenigvuldiger.

    0,5 (geen bewijs) → 1,0 (ongewijzigd). Hoger tilt op tot ~1,6; lager knijpt af
    tot ~0,4. Door de krimp in de precisie beweegt dit pas echt bij voldoende data.
    Alleen gebruikt als terugval zolang er nog geen edge-cijfer is."""
    return max(0.4, min(1.6, 1.0 + (precision - 0.5) * 3.0))


def _conservative_edge(net: float, se: float) -> float:
    """De rand van het betrouwbaarheidsinterval die het dichtst bij nul ligt.
    Zo telt alleen het deel van de edge dat statistisch overeind blijft; bij grote
    onzekerheid (kleine n, hoge variantie) valt dit vanzelf naar 0 → gewicht blijft 1,0."""
    if se == float("inf") or se <= 0:
        return 0.0
    if net > 0:
        return max(0.0, net - Z_SIGNIF * se)
    return min(0.0, net + Z_SIGNIF * se)


def weight_multiplier(avg_edge: float, se: float, n: int, roundtrip_cost: float) -> float:
    """Effectief gewicht op basis van de **statistisch verantwoorde** netto-edge.

    Niet het gemiddelde stuurt het gewicht, maar de conservatieve ondergrens ervan
    (mean − Z·SE). Een factor die vaak 'goed' zit maar met veel ruis of weinig data
    krijgt dus géén hoger gewicht — precies om noise niet als signaal te lezen. Onder
    MIN_N_SIGNIF observaties blijft het gewicht neutraal (1,0)."""
    if n < MIN_N_SIGNIF:
        return 1.0
    cons = _conservative_edge(avg_edge - roundtrip_cost, se)
    return max(0.3, min(1.6, 1.0 + cons * 60.0))   # +1%/obs bewezen-netto → ~1,6


def factor_status(avg_edge: float, se: float, n: int, roundtrip_cost: float) -> str:
    """Track-record-status: is de netto-edge statistisch te onderscheiden van ruis?
      observeren   – onvoldoende data
      actief       – ondergrens netto-edge > 0 (bewezen positief, na kosten)
      uitgeschakeld– bovengrens netto-edge < 0 (bewezen verlieslatend)
      onbewezen    – niet van nul te onderscheiden (ruis; gewicht blijft neutraal)"""
    net = avg_edge - roundtrip_cost
    if n < MIN_N_SIGNIF or se == float("inf"):
        return "observeren"
    if net - Z_SIGNIF * se > 0:
        return "actief"
    if net + Z_SIGNIF * se < 0:
        return "uitgeschakeld"
    return "onbewezen"


def enrich(rel: dict[str, dict], roundtrip_cost: float) -> dict[str, dict]:
    """Voeg netto-edge, significantie, gewichts-multiplier en status toe. `se` (met
    mogelijke inf) blijft binnen deze laag — de payload krijgt alleen JSON-veilige velden."""
    out: dict[str, dict] = {}
    for k, v in rel.items():
        ae, n, se = v.get("avg_edge", 0.0), v.get("n", 0), v.get("se", float("inf"))
        net = ae - roundtrip_cost
        significant = n >= MIN_N_SIGNIF and se != float("inf") and abs(net) - Z_SIGNIF * se > 0
        out[k] = {"n": n, "precision": v.get("precision", 0.5), "avg_edge": round(ae, 4),
                  "net_edge": round(net, 4),
                  "net_edge_lo": None if se == float("inf") else round(net - Z_SIGNIF * se, 4),
                  "significant": bool(significant),
                  "weight_mult": round(weight_multiplier(ae, se, n, roundtrip_cost), 3),
                  "status": factor_status(ae, se, n, roundtrip_cost)}
    return out


def roundtrip_cost(cfg) -> float:
    """Round-trip-kosten als fractie: (koop + verkoop) × (fee + slippage)."""
    c = cfg.costs
    return 2.0 * (c.taker_fee_pct + c.slippage_pct) / 100.0


def grade_due(db, prices: dict[str, float], now: datetime) -> int:
    """Beoordeel alle observaties waarvan de horizon is verstreken — **relatief aan de
    markt** (opportunity cost). De edge is niet "ging de coin omhoog?" maar "deed de coin
    het béter dan de gemiddelde coin over hetzelfde venster?". Zo wordt een factor die
    alleen beta rijdt (in een stijgende markt lijkt alles goed) correct als géén edge
    beoordeeld; alleen echte relatieve voorspelkracht telt.

    De mand-benchmark per observatiebatch (zelfde `ts`) = het gemiddelde forward-rendement
    van alle coins in die batch die we nú kunnen prijzen."""
    due = db.due_factor_obs(now.isoformat(timespec="seconds"))
    if not due:
        return 0

    # forward-return per observatie berekenen + de mand-benchmark per batch
    fwd_by_id: dict[int, float] = {}
    cohort_rets: dict[str, list[float]] = defaultdict(list)
    for obs in due:
        price_now = prices.get(obs["pair"])
        if price_now and obs["price"] > 0:
            fwd = price_now / obs["price"] - 1.0
            fwd_by_id[obs["id"]] = fwd
            cohort_rets[obs["ts"]].append(fwd)
    bench = {ts: (sum(rs) / len(rs)) for ts, rs in cohort_rets.items() if rs}

    graded = 0
    for obs in due:
        if obs["id"] not in fwd_by_id:
            db.resolve_factor_obs(obs["id"], obs["factor_key"], None, 0.0)  # onbeoordeelbaar
            continue
        sign = 1 if obs["score"] > 0 else -1 if obs["score"] < 0 else 0
        if sign == 0:
            db.resolve_factor_obs(obs["id"], obs["factor_key"], None, 0.0)
            continue
        excess = fwd_by_id[obs["id"]] - bench.get(obs["ts"], 0.0)   # opportunity-cost-correctie
        edge = excess * sign
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
