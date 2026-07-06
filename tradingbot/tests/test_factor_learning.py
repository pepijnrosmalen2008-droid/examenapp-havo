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


def test_record_and_grade_updates_stats(db):
    reads = compute_reads({"AAA-EUR": ramp(100, 1)}, ["AAA-EUR"], NOW)
    fl.record_observations(db, reads, {"AAA-EUR": 100.0}, NOW)
    # nog niets af te rekenen vóór de horizon
    assert fl.grade_due(db, {"AAA-EUR": 110.0}, NOW + timedelta(hours=1)) == 0
    # ná de horizon met een gestegen koers → positieve prijsfactoren krijgen 'hits'
    graded = fl.grade_due(db, {"AAA-EUR": 130.0}, NOW + timedelta(hours=25))
    assert graded > 0
    rel = db.factor_reliabilities()
    assert rel and any(v["n"] > 0 for v in rel.values())
    mom = rel.get("momentum")
    assert mom and mom["precision"] > 0.5  # bullish momentum bleek te kloppen


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


def test_weight_multiplier_uses_net_edge_not_accuracy():
    cost = 0.007  # ~round-trip
    # ruime data, positieve netto-edge → opgetild
    assert fl.weight_multiplier(0.02, 200, cost) > 1.1
    # ruime data, negatieve netto-edge → afgeknepen (ook al 'klopt de richting' vaak)
    assert fl.weight_multiplier(-0.02, 200, cost) < 0.9
    # weinig data → dicht bij 1,0 (nog geen bewijs)
    assert abs(fl.weight_multiplier(0.02, 2, cost) - 1.0) < 0.1


def test_factor_status_thresholds():
    cost = 0.007
    assert fl.factor_status(0.05, 5, cost) == "observeren"
    assert fl.factor_status(0.02, 100, cost) == "actief"
    assert fl.factor_status(-0.02, 100, cost) == "uitgeschakeld"


def test_enrich_adds_net_edge_and_status(db):
    db.conn.execute("INSERT INTO factor_stats(factor_key,n,hits,sum_edge) VALUES('momentum',100,60,2.0)")
    db.conn.commit()
    rel = fl.enrich(db.factor_reliabilities(), 0.007)
    assert "net_edge" in rel["momentum"] and "status" in rel["momentum"]
    assert rel["momentum"]["net_edge"] == round(0.02 - 0.007, 4)


def test_positive_edge_outweighs_high_accuracy_negative_edge():
    candles = {"AAA-EUR": ramp(100, 1)}
    # momentum: hoge accuracy maar netto verlieslatend; trend: nette positieve edge
    rel = fl.enrich({"momentum": {"precision": 0.7, "n": 200, "avg_edge": -0.02},
                     "trend": {"precision": 0.55, "n": 200, "avg_edge": 0.02}}, 0.007)
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
