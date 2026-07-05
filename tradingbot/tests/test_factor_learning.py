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


def test_overextended_dampens_bullish_news():
    calm = compute_reads({"AAA-EUR": ramp(100, 0)}, ["AAA-EUR"], NOW, events=flat_events())
    hot = compute_reads({"AAA-EUR": ramp(100, 3)}, ["AAA-EUR"], NOW, events=flat_events())
    n_calm = next(f for f in calm["AAA-EUR"].factors if f.key == "news").score
    n_hot = next(f for f in hot["AAA-EUR"].factors if f.key == "news").score
    assert n_hot < n_calm  # zelfde nieuws telt minder als de koers al ver op staat
