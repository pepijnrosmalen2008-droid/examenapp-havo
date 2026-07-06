"""Forward-only leerlus: observaties afrekenen, betrouwbaarheid, effectief gewicht, context."""

from datetime import datetime, timedelta, timezone

from autopilot import factor_learning as fl
from autopilot.factors import compute_reads
from autopilot.models import Candle

NOW = datetime(2026, 7, 1, tzinfo=timezone.utc)
D = 86_400_000


def ramp(start, step, n=70):
    closes = [start + step * i for i in range(n)]
    return [Candle(i * D, c, c, c, c, 1.0) for i, c in enumerate(closes)]


def flat_events():
    return [{"pair": "AAA-EUR", "kind": "news", "direction": 1, "confidence": 0.9,
             "rationale": "listing"}]


def test_reliability_multiplier_monotone():
    assert fl.reliability_multiplier(0.5) == 1.0
    assert fl.reliability_multiplier(0.7) > 1.0
    assert fl.reliability_multiplier(0.3) < 1.0


def test_record_and_grade_updates_stats_cross_section(db):
    # Twee coins die uiteenlopen: AAA stijgt (momentum +), CCC daalt (momentum −).
    pairs = ["AAA-EUR", "CCC-EUR"]
    candles = {"AAA-EUR": ramp(100, 1), "CCC-EUR": ramp(100, -1)}
    reads = compute_reads(candles, pairs, NOW)
    obs_px = {"AAA-EUR": candles["AAA-EUR"][-1].close, "CCC-EUR": candles["CCC-EUR"][-1].close}
    fl.record_observations(db, reads, obs_px, NOW)
    # nog niets af te rekenen vóór de horizon
    assert fl.grade_due(db, obs_px, NOW + timedelta(hours=1)) == 0
    # ná de horizon: de winnaar liep verder op, de verliezer verder omlaag → momentum
    # discrimineerde correct (relatief aan de mand), dus 'hits'
    later = {"AAA-EUR": obs_px["AAA-EUR"] * 1.2, "CCC-EUR": obs_px["CCC-EUR"] * 0.8}
    graded = fl.grade_due(db, later, NOW + timedelta(hours=25))
    assert graded > 0
    rel = db.factor_reliabilities()
    mom = rel.get("momentum")
    assert mom and mom["n"] > 0 and mom["precision"] > 0.5


def test_single_coin_cohort_has_zero_excess(db):
    # Met één coin is er geen mand om je tegen te meten → excess = 0 → niet als hit geteld.
    reads = compute_reads({"AAA-EUR": ramp(100, 1)}, ["AAA-EUR"], NOW)
    fl.record_observations(db, reads, {"AAA-EUR": 169.0}, NOW)
    fl.grade_due(db, {"AAA-EUR": 250.0}, NOW + timedelta(hours=25))
    rel = db.factor_reliabilities()
    # alle edges ~0 → geen enkele factor bewijst iets (opportunity-cost-correctie)
    assert all(abs(v["avg_edge"]) < 1e-6 for v in rel.values())


def test_sample_gate_prevents_spam(db):
    reads = compute_reads({"AAA-EUR": ramp(100, 1)}, ["AAA-EUR"], NOW)
    fl.record_observations(db, reads, {"AAA-EUR": 100.0}, NOW)
    n1 = len(db.due_factor_obs("2999-01-01T00:00:00"))
    fl.record_observations(db, reads, {"AAA-EUR": 100.0}, NOW + timedelta(minutes=5))
    n2 = len(db.due_factor_obs("2999-01-01T00:00:00"))
    assert n1 == n2 and n1 > 0  # tweede batch binnen het uur genegeerd


def test_reliability_changes_effective_weight(db):
    candles = {"AAA-EUR": ramp(100, 1)}
    base = compute_reads(candles, ["AAA-EUR"], NOW)
    mom_base = next(f for f in base["AAA-EUR"].factors if f.key == "momentum")
    # forceer een lage betrouwbaarheid voor momentum
    rel = {"momentum": {"precision": 0.3, "n": 100}}
    low = compute_reads(candles, ["AAA-EUR"], NOW, reliabilities=rel)
    mom_low = next(f for f in low["AAA-EUR"].factors if f.key == "momentum")
    assert mom_low.weight_effective < mom_base.weight_effective
    assert mom_low.reliability == 0.3 and mom_low.n_obs == 100


def test_weight_multiplier_needs_significance():
    cost = 0.007
    # veel data, kleine SE, positieve netto-edge boven de ondergrens → opgetild
    assert fl.weight_multiplier(0.02, 0.002, 200, cost) > 1.1
    # zelfde gemiddelde maar grote SE (ruis) → ondergrens < 0 → géén optillen
    assert abs(fl.weight_multiplier(0.02, 0.05, 200, cost) - 1.0) < 0.05
    # weinig data → altijd neutraal
    assert fl.weight_multiplier(0.02, 0.002, 5, cost) == 1.0
    # bewezen negatief → afgeknepen
    assert fl.weight_multiplier(-0.02, 0.002, 200, cost) < 0.9


def test_factor_status_significance():
    cost = 0.007
    assert fl.factor_status(0.05, 0.001, 5, cost) == "observeren"        # te weinig data
    assert fl.factor_status(0.02, 0.002, 200, cost) == "actief"          # significant positief
    assert fl.factor_status(-0.02, 0.002, 200, cost) == "uitgeschakeld"  # significant negatief
    assert fl.factor_status(0.02, 0.05, 200, cost) == "onbewezen"        # ruis


def test_enrich_adds_significance_fields(db):
    db.conn.execute("INSERT INTO factor_stats(factor_key,n,hits,sum_edge,sum_edge2) "
                    "VALUES('momentum',100,60,2.0,0.06)")
    db.conn.commit()
    rel = fl.enrich(db.factor_reliabilities(), 0.007)
    m = rel["momentum"]
    assert m["net_edge"] == round(0.02 - 0.007, 4)
    assert "significant" in m and "net_edge_lo" in m and "status" in m


def test_positive_edge_outweighs_high_accuracy_negative_edge():
    candles = {"AAA-EUR": ramp(100, 1)}
    # momentum: hoge accuracy maar bewezen netto-negatief; trend: bewezen netto-positief
    rel = fl.enrich({"momentum": {"precision": 0.7, "n": 200, "avg_edge": -0.02, "se": 0.002},
                     "trend": {"precision": 0.55, "n": 200, "avg_edge": 0.02, "se": 0.002}}, 0.007)
    reads = compute_reads(candles, ["AAA-EUR"], NOW, reliabilities=rel)
    facs = {f.key: f for f in reads["AAA-EUR"].factors}
    assert facs["trend"].weight_effective > facs["momentum"].weight_effective


def test_external_entity_gets_own_factor_key():
    events = [{"pair": "AAA-EUR", "kind": "smart_money", "entity": "Musk",
               "direction": 1, "confidence": 0.6, "rationale": "post"}]
    reads = compute_reads({"AAA-EUR": ramp(100, 0)}, ["AAA-EUR"], NOW, events=events)
    keys = {f.key for f in reads["AAA-EUR"].factors}
    assert "smart_money:musk" in keys


def test_overextended_dampens_bullish_news():
    calm = compute_reads({"AAA-EUR": ramp(100, 0)}, ["AAA-EUR"], NOW, events=flat_events())
    hot = compute_reads({"AAA-EUR": ramp(100, 3)}, ["AAA-EUR"], NOW, events=flat_events())
    n_calm = next(f for f in calm["AAA-EUR"].factors if f.key == "news").score
    n_hot = next(f for f in hot["AAA-EUR"].factors if f.key == "news").score
    assert n_hot < n_calm  # zelfde nieuws telt minder als de koers al ver op staat
