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
MIN_NEFF_SIGNIF = 30        # minimaal aantal EFFECTIEVE (onafhankelijke) observaties

# Overlap-correctie: we samplen elk uur maar rekenen over HORIZON_HOURS af, dus
# opeenvolgende vensters overlappen sterk → ze zijn NIET onafhankelijk. De effectieve
# steekproef is grofweg n × (sample-interval / horizon). Zonder deze correctie
# onderschat de standaardfout de onzekerheid en 'bewijs' je te makkelijk een edge.
# (De cross-sectionele correlatie is al grotendeels weg door de excess-t.o.v.-mand-meting;
#  dit corrigeert de resterende overlap in de TIJD.)
OVERLAP_FRACTION = SAMPLE_SECONDS / (HORIZON_HOURS * 3600.0)

# Regime-stabiliteit: een edge die maar in één regime bestaat is geen edge om op te
# vertrouwen. Per regime dit aantal observaties nodig om mee te tellen.
MIN_REGIME_N = 15


def effective_n(n: int) -> float:
    return max(1.0, n * OVERLAP_FRACTION)


def market_regime(candles: dict) -> str:
    """Grof marktregime uit de mand: bull (breed boven het 50-gemiddelde), bear (breed
    eronder) of chop (richtingloos). Bewust simpel en deterministisch; het dient om de
    edge per regime te kunnen uitsplitsen, niet om te handelen."""
    devs = []
    for c in candles.values():
        closes = [x.close for x in c] if c else []
        if len(closes) >= 50:
            sma = sum(closes[-50:]) / 50
            if sma > 0:
                devs.append(closes[-1] / sma - 1)
    if len(devs) < 2:
        return "onbekend"
    breadth = sum(1 for d in devs if d > 0) / len(devs)
    devs.sort()
    med = devs[len(devs) // 2]
    if med > 0.02 and breadth >= 0.6:
        return "bull"
    if med < -0.02 and breadth <= 0.4:
        return "bear"
    return "chop"


def reliability_multiplier(precision: float) -> float:
    """Betrouwbaarheid (0..1, krimp naar 0,5) → gewichtsvermenigvuldiger.

    0,5 (geen bewijs) → 1,0 (ongewijzigd). Hoger tilt op tot ~1,6; lager knijpt af
    tot ~0,4. Door de krimp in de precisie beweegt dit pas echt bij voldoende data.
    Alleen gebruikt als terugval zolang er nog geen edge-cijfer is."""
    return max(0.4, min(1.6, 1.0 + (precision - 0.5) * 3.0))


def _se(sd: float | None, n: int) -> float:
    """Standaardfout met overlap-correctie (effectieve steekproef)."""
    if sd is None or n <= 1:
        return float("inf")
    import math
    return sd / math.sqrt(effective_n(n))


def _conservative_edge(net: float, se: float) -> float:
    """De rand van het betrouwbaarheidsinterval die het dichtst bij nul ligt.
    Zo telt alleen het deel van de edge dat statistisch overeind blijft; bij grote
    onzekerheid (kleine n_eff, hoge variantie) valt dit vanzelf naar 0 → gewicht 1,0."""
    if se == float("inf") or se <= 0:
        return 0.0
    if net > 0:
        return max(0.0, net - Z_SIGNIF * se)
    return min(0.0, net + Z_SIGNIF * se)


def regime_consistent(regimes: dict) -> bool:
    """Is de edge over meerdere regimes positief, of leunt hij op één regime?
    Vereist ≥2 regimes met genoeg data en een positieve edge in de meerderheid ervan."""
    data = [info for info in regimes.values() if info.get("n", 0) >= MIN_REGIME_N]
    if len(data) < 2:
        return False
    pos = sum(1 for info in data if info.get("avg_edge", 0) > 0)
    return pos >= (len(data) + 1) // 2 and pos >= 2


def weight_multiplier(avg_edge: float, sd: float | None, n: int, roundtrip_cost: float,
                      consistent: bool = True) -> float:
    """Effectief gewicht op basis van de **statistisch verantwoorde, regime-stabiele**
    netto-edge. Niet het gemiddelde stuurt het gewicht maar de conservatieve ondergrens
    (mean − Z·SE) mét overlap-correctie. Onder MIN_NEFF_SIGNIF effectieve observaties, of
    als de edge niet regime-stabiel is, blijft een OPWAARTS gewicht achterwege (max 1,0)."""
    se = _se(sd, n)
    if effective_n(n) < MIN_NEFF_SIGNIF:
        return 1.0
    cons = _conservative_edge(avg_edge - roundtrip_cost, se)
    mult = max(0.3, min(1.6, 1.0 + cons * 60.0))   # +1%/obs bewezen-netto → ~1,6
    if mult > 1.0 and not consistent:
        return 1.0                                  # positief maar niet regime-stabiel → geen upweight
    return mult


def factor_status(avg_edge: float, sd: float | None, n: int, roundtrip_cost: float,
                  consistent: bool = True) -> str:
    """Track-record-status:
      observeren   – te weinig (effectieve) data
      actief       – ondergrens netto-edge > 0 ÉN regime-stabiel
      eenzijdig    – significant positief maar leunt op één regime (niet te vertrouwen)
      uitgeschakeld– bovengrens netto-edge < 0 (bewezen verlieslatend)
      onbewezen    – niet van nul te onderscheiden (ruis)"""
    net = avg_edge - roundtrip_cost
    se = _se(sd, n)
    if effective_n(n) < MIN_NEFF_SIGNIF or se == float("inf"):
        return "observeren"
    if net + Z_SIGNIF * se < 0:
        return "uitgeschakeld"
    if net - Z_SIGNIF * se > 0:
        return "actief" if consistent else "eenzijdig"
    return "onbewezen"


def enrich(rel: dict[str, dict], roundtrip_cost: float) -> dict[str, dict]:
    """Voeg netto-edge, significantie (overlap-gecorrigeerd), regime-stabiliteit,
    gewichts-multiplier en status toe. Alleen JSON-veilige velden gaan naar buiten."""
    out: dict[str, dict] = {}
    for k, v in rel.items():
        ae, n, sd = v.get("avg_edge", 0.0), v.get("n", 0), v.get("sd")
        regimes = v.get("regimes", {})
        consistent = regime_consistent(regimes)
        se = _se(sd, n)
        net = ae - roundtrip_cost
        significant = effective_n(n) >= MIN_NEFF_SIGNIF and se != float("inf") \
            and abs(net) - Z_SIGNIF * se > 0
        out[k] = {"n": n, "n_eff": round(effective_n(n), 1),
                  "precision": v.get("precision", 0.5), "avg_edge": round(ae, 4),
                  "net_edge": round(net, 4),
                  "net_edge_lo": None if se == float("inf") else round(net - Z_SIGNIF * se, 4),
                  "significant": bool(significant), "regime_stable": bool(consistent),
                  "regimes": regimes,
                  "weight_mult": round(weight_multiplier(ae, sd, n, roundtrip_cost, consistent), 3),
                  "status": factor_status(ae, sd, n, roundtrip_cost, consistent)}
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
        regime = obs["regime"] if "regime" in obs.keys() else None
        db.resolve_factor_obs(obs["id"], obs["factor_key"], edge > 0, edge, regime=regime)
        graded += 1
    return graded


def record_observations(db, reads: dict, prices: dict[str, float], now: datetime,
                        regime: str | None = None) -> None:
    """Leg de factor-scores van deze cycle vast (met het huidige regime) om later af te
    rekenen. Gegate op SAMPLE_SECONDS zodat een 1-minuut-bot de tabel niet laat exploderen."""
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
                                 pair=pair, score=f.score, price=price, regime=regime)
            n += 1
    if n:
        db.set_meta("factor_obs_last", ts)
        log.debug("leerlus: %d observaties (regime=%s) vastgelegd (afrekenen over %.0fu)",
                  n, regime, HORIZON_HOURS)
