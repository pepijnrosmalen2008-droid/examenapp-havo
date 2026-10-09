"""Autonome strategie + arena: meet kandidaten forward-only, stuurt kapitaal alleen naar bewezen."""

from datetime import datetime, timedelta, timezone

from autopilot import arena
from autopilot.models import Candle, Side
from autopilot.strategies import get_strategy
from conftest import make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)
D = 3_600_000


def up(n=200):
    return [Candle(i * D, (c := 100.0 * 1.01 ** i), c, c, c, 1.0) for i in range(n)]


def _strat(db):
    cfg = make_config(pairs=["AAA-EUR", "BBB-EUR"], strategy={"name": "autonomous", "params": {}})
    return get_strategy(cfg, db), cfg


def test_cash_until_a_strategy_is_proven(db):
    strat, _ = _strat(db)
    sigs = strat.generate_signals({"AAA-EUR": up(), "BBB-EUR": up()}, [], NOW)
    assert sigs == []                                  # niets bewezen → cash
    # maar de kandidaten zijn wél gemeten (observaties vastgelegd)
    assert len(db.due_strategy_obs("2999-01-01T00:00:00")) > 0


def test_arena_grades_and_builds_edge(db):
    cfg = make_config()
    # observatie uit het verleden: instap 100, nu 110 → +10% bruto, ruim boven kosten → hit
    db.record_strategy_obs(ts=(NOW - timedelta(hours=2)).isoformat(),
                           due_ts=(NOW - timedelta(hours=1)).isoformat(),
                           strategy="cand", pair="AAA-EUR", entry_price=100.0)
    graded = arena.grade(db, {"AAA-EUR": 110.0}, NOW, cfg)
    assert graded == 1
    s = db.strategy_stats()["cand"]
    assert s["n"] == 1 and s["net_edge"] > 0


def test_capital_routes_to_the_proven_strategy(db):
    strat, _ = _strat(db)
    # maak één kandidaat 'actief' met ruim bewijs + positieve netto edge
    db.conn.execute("INSERT INTO strategy_stats(strategy,n,hits,sum_edge) VALUES('adaptive:5m',50,30,0.5)")
    db.conn.commit()
    assert arena.best_strategy(db) == "adaptive:5m"
    sigs = strat.generate_signals({"AAA-EUR": up(), "BBB-EUR": up()}, [], NOW)
    assert sigs and all(s.side == Side.BUY for s in sigs)
    assert all(s.strategy == "autonomous[adaptive:5m]" for s in sigs)   # echt kapitaal volgt de winnaar


def test_negative_edge_strategy_stays_cash(db):
    strat, _ = _strat(db)
    # genoeg observaties maar negatieve netto edge → niet actief → cash
    db.conn.execute("INSERT INTO strategy_stats(strategy,n,hits,sum_edge) VALUES('adaptive:5m',50,10,-0.8)")
    db.conn.commit()
    assert arena.best_strategy(db) is None
    assert strat.generate_signals({"AAA-EUR": up(), "BBB-EUR": up()}, [], NOW) == []
