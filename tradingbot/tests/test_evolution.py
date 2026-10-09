"""Evolutie-laag: de bot schrijft zijn eigen strategie-code, toetst die, wiret hem gated in en
rolt mislukkingen terug. Veiligheidsgrens: zelf-geschreven code kan alleen Signals afgeven."""

import json
import sys

import pytest

from autopilot import evolution
from autopilot.models import Candle, Side
from autopilot.strategies import _REGISTRY, get_strategy
from conftest import make_config


@pytest.fixture
def clean_generated():
    """Verwijder na afloop alle in de test geschreven gen_*-modules (en hun registratie)."""
    existing = {p.name for p in evolution.GEN_DIR.glob("gen_*.py")}
    yield
    for p in evolution.GEN_DIR.glob("gen_*.py"):
        if p.name not in existing:
            p.unlink()
    for name in [n for n in _REGISTRY if n.startswith("gen_")]:
        _REGISTRY.pop(name, None)
    for mod in [m for m in sys.modules if m.startswith(f"{evolution.GEN_PKG}.gen_")]:
        del sys.modules[mod]


def test_rand_params_stay_within_bounds():
    import random
    for seed in range(20):
        p = evolution._rand_params(random.Random(seed))
        assert p["candle_interval"] in evolution.BOUNDS["candle_interval"]
        for key in ("buy_threshold", "sell_threshold", "min_confidence",
                    "edge_scale", "cost_mult", "rotate_margin"):
            lo, hi = evolution.BOUNDS[key]
            assert lo <= p[key] <= hi
        lo, hi = evolution.BOUNDS["max_positions"]
        assert lo <= p["max_positions"] <= hi


def test_render_and_write_produces_importable_registered_strategy(db, clean_generated):
    params = {"candle_interval": "15m", "buy_threshold": 0.2, "sell_threshold": -0.1,
              "min_confidence": 0.1, "max_positions": 4, "edge_scale": 0.08,
              "cost_mult": 1.5, "rotate_margin": 0.2}
    name = evolution._name_for(params)
    source = evolution.render_module(name, params, version=1, excess=3.0)
    module = evolution.write_module(name, source)
    assert module == f"{name}.py"
    assert (evolution.GEN_DIR / module).exists()

    # importeer zoals de live-bot dat doet → de klasse registreert zichzelf
    import importlib
    importlib.import_module(f"{evolution.GEN_PKG}.{name}")
    assert name in _REGISTRY

    # de gegenereerde strategie is een ECHTE Strategy die alleen Signals afgeeft
    cfg = make_config(pairs=["AAA-EUR", "BBB-EUR"], strategy={"name": name, "params": {}})
    strat = get_strategy(cfg, db)
    assert isinstance(strat, _REGISTRY[name])
    # params zijn in de klasse gebakken (zelf-geschreven code, niet alleen config)
    assert strat.params["buy_threshold"] == 0.2
    assert strat.candle_interval == "15m"


def _force_verdict(verdict, excess=5.0):
    def fake(cfg, strategy, params, data, **kw):
        return {"strategy": strategy, "params": params, "hkey": evolution.researcher.hkey(strategy, params),
                "return_pct": excess + 1, "hold_pct": 1.0, "excess_pct": excess,
                "trades": 20, "real_excess": excess, "flags": [] if verdict == "kandidaat" else ["x"],
                "verdict": verdict}
    return fake


def test_evolve_once_only_writes_survivors(db, monkeypatch, clean_generated):
    cfg = make_config(pairs=["AAA-EUR", "BBB-EUR"])
    monkeypatch.setattr(evolution.researcher, "evaluate", _force_verdict("kandidaat"))
    survivors = evolution.evolve_once(cfg, db, {"AAA-EUR": [], "BBB-EUR": []}, n=3, seed=7)
    assert len(survivors) == 3
    gen = db.generated_by_status(("kandidaat",))
    assert len(gen) == 3
    # elke overlever is als echt bestand geschreven
    for g in gen:
        assert (evolution.GEN_DIR / g["module"]).exists()
    # en het oordeel staat in het onderzoeksregister
    assert db.research_summary().get("kandidaat") == 3


def test_evolve_once_rejects_do_not_write_code(db, monkeypatch, clean_generated):
    cfg = make_config(pairs=["AAA-EUR", "BBB-EUR"])
    monkeypatch.setattr(evolution.researcher, "evaluate", _force_verdict("verworpen"))
    survivors = evolution.evolve_once(cfg, db, {"AAA-EUR": [], "BBB-EUR": []}, n=3, seed=7)
    assert survivors == []
    assert db.generated_by_status(("kandidaat", "actief", "retired")) == []
    assert db.research_summary().get("verworpen") == 3     # wel gelogd als verworpen


def test_load_generated_imports_and_skips_retired(db, monkeypatch, clean_generated):
    cfg = make_config(pairs=["AAA-EUR", "BBB-EUR"])
    monkeypatch.setattr(evolution.researcher, "evaluate", _force_verdict("kandidaat"))
    evolution.evolve_once(cfg, db, {"AAA-EUR": [], "BBB-EUR": []}, n=2, seed=3)
    specs = evolution.load_generated(db)
    assert len(specs) == 2 and all(s["name"] in _REGISTRY for s in specs)
    # retire er één → load_generated laat die weg
    victim = specs[0]["name"]
    db.set_generated_status(victim, "retired", "test")
    specs2 = evolution.load_generated(db)
    assert victim not in {s["name"] for s in specs2} and len(specs2) == 1


def test_auto_retire_drops_proven_negative_edge(db):
    db.record_generated(name="gen_abc", params="{}", module="gen_abc.py", status="actief")
    # genoeg observaties, duidelijk negatieve netto edge → terugval
    db.conn.execute("INSERT INTO strategy_stats(strategy,n,hits,sum_edge) VALUES('gen_abc',50,10,-1.0)")
    db.conn.commit()
    retired = evolution.auto_retire(db, min_obs=40)
    assert retired == ["gen_abc"]
    assert db.generated_by_status(("retired",))[0]["name"] == "gen_abc"


def test_auto_retire_spares_young_strategies(db):
    db.record_generated(name="gen_young", params="{}", module="gen_young.py", status="actief")
    db.conn.execute("INSERT INTO strategy_stats(strategy,n,hits,sum_edge) VALUES('gen_young',5,1,-0.5)")
    db.conn.commit()
    assert evolution.auto_retire(db, min_obs=40) == []     # te weinig bewijs → niet doden
    assert db.generated_by_status(("actief",))[0]["name"] == "gen_young"


def test_promote_from_research_turns_candidates_into_code(db, clean_generated):
    params = {"candle_interval": "5m", "buy_threshold": 0.15}
    db.record_research(hkey=evolution.researcher.hkey("adaptive", params), strategy="adaptive",
                       params=json.dumps(params, sort_keys=True), return_pct=10, hold_pct=2,
                       excess_pct=8, trades=15, verdict="kandidaat", flags=json.dumps([]))
    written = evolution.promote_from_research(db)
    assert len(written) == 1
    assert (evolution.GEN_DIR / written[0]["module"]).exists()
    assert db.generated_by_status(("kandidaat",))[0]["parent"] == "research"


def test_autonomous_runs_generated_as_gated_roster_member(db, monkeypatch, clean_generated):
    """Integratie: een zelf-geschreven strategie draait mee in de arena, gated op bewijs."""
    cfg = make_config(pairs=["AAA-EUR", "BBB-EUR"])
    monkeypatch.setattr(evolution.researcher, "evaluate", _force_verdict("kandidaat"))
    evolution.evolve_once(cfg, db, {"AAA-EUR": [], "BBB-EUR": []}, n=1, seed=11)
    gen_name = db.generated_by_status(("kandidaat",))[0]["name"]

    acfg = make_config(pairs=["AAA-EUR", "BBB-EUR"],
                       strategy={"name": "autonomous", "params": {"self_evolve": True}})
    strat = get_strategy(acfg, db)
    labels = {label for label, _ in strat._subs}
    assert gen_name in labels                              # zelf-geschreven code zit in de roster

    from datetime import datetime, timezone
    D = 3_600_000
    up = [Candle(i * D, (c := 100.0 * 1.01 ** i), c, c, c, 1.0) for i in range(200)]
    now = datetime(2026, 7, 1, tzinfo=timezone.utc)
    # niets bewezen → cash, ook met de gegenereerde strategie erbij (gated, geen gratis kapitaal)
    assert strat.generate_signals({"AAA-EUR": up, "BBB-EUR": up}, [], now) == []
