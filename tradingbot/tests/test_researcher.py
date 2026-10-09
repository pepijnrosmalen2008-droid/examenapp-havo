"""Autonome onderzoeker: hypothese-generatie, dedup, verdict-logica en het research_log-register."""

import json

from autopilot import researcher
from autopilot.models import Candle
from conftest import make_config


def test_hypotheses_cover_the_grid_deterministically():
    h1 = researcher.hypotheses(["momentum_ma_cross"])
    h2 = researcher.hypotheses(["momentum_ma_cross"])
    assert h1 == h2                                   # deterministisch geordend
    # 3 fast × 2 slow = 6 combinaties
    assert len(h1) == 6
    assert all(name == "momentum_ma_cross" for name, _ in h1)
    assert {"fast", "slow"} == set(h1[0][1])


def test_hkey_is_order_independent_and_stable():
    a = researcher.hkey("adaptive", {"buy_threshold": 0.15, "min_confidence": 0.10})
    b = researcher.hkey("adaptive", {"min_confidence": 0.10, "buy_threshold": 0.15})
    assert a == b                                     # sleutelvolgorde maakt niet uit
    assert a != researcher.hkey("adaptive", {"buy_threshold": 0.25, "min_confidence": 0.10})


def test_verdict_rejects_on_adversarial_flags():
    bt = {"return_pct": 30.0, "trades": 20}
    hold = {"return_pct": 5.0}
    adv = {"flags": ["verdampt bij hogere kosten"], "real_excess": 25.0}
    verdict, excess = researcher._verdict(bt, hold, adv)
    assert verdict == "verworpen"                     # overleeft kosten-stress niet → weg
    assert excess == 25.0


def test_verdict_candidate_only_when_clean_and_positive():
    bt = {"return_pct": 30.0, "trades": 20}
    hold = {"return_pct": 5.0}
    adv = {"flags": [], "real_excess": 25.0}
    assert researcher._verdict(bt, hold, adv)[0] == "kandidaat"


def test_verdict_inconclusive_on_too_few_trades():
    bt = {"return_pct": 99.0, "trades": 1}            # bijna geen trades → geen statistiek
    hold = {"return_pct": 0.0}
    adv = {"flags": [], "real_excess": 99.0}
    assert researcher._verdict(bt, hold, adv)[0] == "inconclusief"


def test_verdict_rejects_when_not_beating_hold():
    bt = {"return_pct": 3.0, "trades": 20}
    hold = {"return_pct": 10.0}                       # verliest van gewoon aanhouden
    adv = {"flags": [], "real_excess": -7.0}
    assert researcher._verdict(bt, hold, adv)[0] == "verworpen"


def test_record_and_dedup_via_research_seen(db):
    key = researcher.hkey("adaptive", {"buy_threshold": 0.15})
    assert not db.research_seen(key)
    db.record_research(hkey=key, strategy="adaptive", params=json.dumps({"buy_threshold": 0.15}),
                       return_pct=12.0, hold_pct=4.0, excess_pct=8.0, trades=11,
                       verdict="kandidaat", flags=json.dumps([]))
    assert db.research_seen(key)
    assert db.research_summary() == {"kandidaat": 1}
    assert researcher.promoted(db)[0]["strategy"] == "adaptive"


def test_research_once_skips_seen(db, monkeypatch):
    cfg = make_config(pairs=["AAA-EUR", "BBB-EUR"])
    calls = []

    def fake_evaluate(cfg, strategy, params, data, **kw):
        calls.append((strategy, tuple(sorted(params.items()))))
        return {"strategy": strategy, "params": params, "hkey": researcher.hkey(strategy, params),
                "return_pct": 1.0, "hold_pct": 0.0, "excess_pct": 1.0, "trades": 10,
                "real_excess": 1.0, "flags": [], "verdict": "verworpen"}

    monkeypatch.setattr(researcher, "evaluate", fake_evaluate)
    data = {"AAA-EUR": [], "BBB-EUR": []}

    first = researcher.research_once(cfg, db, data, strategies=["momentum_ma_cross"])
    assert len(first) == 6 and len(calls) == 6
    # tweede ronde: alles al gezien → niets opnieuw getoetst
    calls.clear()
    second = researcher.research_once(cfg, db, data, strategies=["momentum_ma_cross"])
    assert second == [] and calls == []
    # tenzij expliciet rerun
    third = researcher.research_once(cfg, db, data, strategies=["momentum_ma_cross"], skip_seen=False)
    assert len(third) == 6


def _trend(n, rate):
    return [Candle(i * 3_600_000, (c := 100.0 * rate ** i), c, c, c, 1.0) for i in range(n)]


def test_evaluate_runs_end_to_end_and_records(db):
    """Lichte integratie: echte backtest + adversariële toets op een stijgende markt."""
    cfg = make_config(pairs=["AAA-EUR", "BBB-EUR"],
                      strategy={"name": "momentum_ma_cross", "params": {}})
    data = {"AAA-EUR": _trend(120, 1.01), "BBB-EUR": _trend(120, 1.005)}
    res = researcher.evaluate(cfg, "momentum_ma_cross", {"fast": 8, "slow": 26},
                              data, shuffles=3, warmup=30)
    assert res["verdict"] in {"kandidaat", "verworpen", "inconclusief"}
    assert set(res) >= {"strategy", "params", "hkey", "return_pct", "hold_pct",
                        "excess_pct", "trades", "flags", "verdict"}
