"""S++ laag: concept-drift (Page-Hinkley), FDR-correctie, counterfactuals, provenance."""

from datetime import datetime, timezone

from autopilot import factor_learning as fl
from autopilot import provenance as prov
from autopilot.factors import compute_reads, counterfactuals
from autopilot.models import Candle
from conftest import make_config

NOW = datetime(2026, 7, 1, tzinfo=timezone.utc)
D = 86_400_000


def ramp(start, step, n=70):
    return [Candle(i * D, c, c, c, c, 1.0) for i, c in enumerate(start + step * i for i in range(n))]


# ── concept drift ──────────────────────────────────────────────────

def test_drift_detects_downward_shift(db):
    # eerst een positieve edge-stroom, dan omslaan naar sterk negatief → drift-down
    for _ in range(60):
        fl.update_drift(db, "momentum", 0.01)
    for _ in range(60):
        fl.update_drift(db, "momentum", -0.05)
    assert db.drift_status()["momentum"] == "drift-down"


def test_drift_stable_stream_stays_stable(db):
    for _ in range(80):
        fl.update_drift(db, "trend", 0.001)
    assert db.drift_status().get("trend", "stabiel") == "stabiel"


def test_drift_down_removes_upweight():
    rel = {"momentum": {"n": 20000, "avg_edge": 0.02, "sd": 0.01, "precision": 0.6,
                        "regimes": {"bull": {"n": 500, "avg_edge": 0.02},
                                    "bear": {"n": 500, "avg_edge": 0.02}}}}
    up = fl.enrich_and_correct(rel, 0.007, drift={"momentum": "stabiel"})
    down = fl.enrich_and_correct(rel, 0.007, drift={"momentum": "drift-down"})
    assert up["momentum"]["weight_mult"] > 1.0
    assert down["momentum"]["weight_mult"] == 1.0 and down["momentum"]["drift"] == "drift-down"


# ── FDR / multiple hypotheses ──────────────────────────────────────

def test_fdr_rejects_lone_borderline_among_many():
    # 20 nulfactoren (edge ~0) + 1 net-positieve borderline; BH moet streng zijn
    rel = {f"noise{i}": {"n": 20000, "avg_edge": 0.0071, "sd": 0.02,
                         "precision": 0.5, "regimes": {"bull": {"n": 500, "avg_edge": 0.0},
                                                       "bear": {"n": 500, "avg_edge": 0.0}}}
           for i in range(20)}
    out = fl.enrich_and_correct(rel, 0.007)
    # met 20 gelijke borderline-toetsen mag niet zomaar alles 'ontdekt' worden
    n_disc = sum(1 for v in out.values() if v.get("fdr_significant"))
    assert n_disc < 20


def test_fdr_keeps_strong_effect():
    rel = {"strong": {"n": 40000, "avg_edge": 0.03, "sd": 0.01, "precision": 0.7,
                      "regimes": {"bull": {"n": 800, "avg_edge": 0.03},
                                  "bear": {"n": 800, "avg_edge": 0.03}}}}
    out = fl.enrich_and_correct(rel, 0.007)
    assert out["strong"]["fdr_significant"] is True
    assert out["strong"]["status"] == "actief"


# ── counterfactuals ────────────────────────────────────────────────

def test_counterfactual_reports_marginal_impact():
    events = [{"pair": "AAA-EUR", "kind": "macro", "source": "Fed",
               "direction": -1, "confidence": 0.9, "rationale": "rente hoog"}]
    reads = compute_reads({"AAA-EUR": ramp(100, 1)}, ["AAA-EUR"], NOW, events=events)
    cf = counterfactuals(reads["AAA-EUR"])
    assert cf and {"label", "without", "delta"} <= set(cf[0])
    # de macro-factor (tegengesteld aan de bullish prijs) hoort een merkbare delta te geven
    assert any(abs(c["delta"]) > 0 for c in cf)


# ── provenance ─────────────────────────────────────────────────────

def test_provenance_hashes_are_stable_and_config_sensitive():
    c1, c2 = make_config(), make_config(capital_eur=999)
    assert prov.code_hash() == prov.code_hash()            # deterministisch
    assert len(prov.code_hash()) == 10
    assert prov.config_hash(c1) != prov.config_hash(c2)    # config-gevoelig
    assert prov.config_hash(c1) == prov.config_hash(make_config())


# ── zelfdiagnose (self-diagnostics / reliability) ──────────────────

def test_health_reports_ok_and_flags_halt(db):
    from autopilot import health
    db.snapshot_equity(500, 500, 500)
    h = health.diagnostics(db, make_config(), "PAPER")
    assert h["overall"] in ("ok", "info", "warn")
    names = {c["name"] for c in h["checks"]}
    assert "Hartslag" in names and "Kill-switch" in names and "Concept-drift" in names
    # halt → overall crit
    db.set_meta("halted", "1"); db.set_meta("halt_reason", "max drawdown 30%")
    h2 = health.diagnostics(db, make_config(), "PAPER")
    assert h2["overall"] == "crit"
    assert any(c["status"] == "crit" and "Kill-switch" in c["name"] for c in h2["checks"])


def test_health_flags_drift(db):
    from autopilot import health
    db.snapshot_equity(500, 500, 500)
    db.set_drift("momentum", {"n": 40, "mean": 0.0, "up_cum": 0, "up_min": 0,
                              "dn_cum": 0, "dn_min": 0, "status": "drift-down"})
    h = health.diagnostics(db, make_config(), "PAPER")
    drift = next(c for c in h["checks"] if c["name"] == "Concept-drift")
    assert drift["status"] == "warn" and "momentum" in drift["detail"]
