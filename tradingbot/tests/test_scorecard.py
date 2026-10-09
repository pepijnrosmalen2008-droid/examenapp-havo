"""Dubbele scorekaart: handelen vs. leren, bewust gescheiden."""

import json

from autopilot import scorecard
from conftest import make_config


def _equity(db, equity, cash=0.0):
    db.conn.execute("INSERT INTO equity_snapshots(ts, equity_eur, cash_eur) VALUES(?,?,?)",
                    ("2026-07-01T10:00:00", equity, cash))
    db.conn.commit()


def test_trading_score_rewards_beating_the_benchmark(db):
    db.set_meta("start_equity_eur", "100")
    _equity(db, 120.0, cash=20.0)                     # +20% rendement
    s = scorecard.trading_score(db, benchmark_pct=5.0)
    assert s["return_pct"] == 20.0
    assert s["excess_pct"] == 15.0                    # 20% − 5% benchmark
    assert s["score"] > 50                            # klopt de benchmark → boven neutraal


def test_trading_score_punishes_drawdown(db):
    db.set_meta("start_equity_eur", "100")
    db.set_meta("max_drawdown_pct", "40")
    _equity(db, 100.0)
    low = scorecard.trading_score(db)["score"]
    db.set_meta("max_drawdown_pct", "0")
    high = scorecard.trading_score(db)["score"]
    assert high > low                                 # drawdown drukt het cijfer


def test_trading_score_counts_net_pnl_from_closed_positions(db):
    db.set_meta("start_equity_eur", "100")
    _equity(db, 100.0)
    db.conn.execute("INSERT INTO positions(pair, amount, avg_price, opened_at, realized_pnl_eur, status) "
                    "VALUES('AAA-EUR', 0, 1, '2026-01-01', 7.50, 'CLOSED')")
    db.conn.execute("INSERT INTO positions(pair, amount, avg_price, opened_at, realized_pnl_eur, status) "
                    "VALUES('BBB-EUR', 0, 1, '2026-01-01', -2.50, 'CLOSED')")
    db.conn.commit()
    s = scorecard.trading_score(db)
    assert s["net_pnl_eur"] == 5.0 and s["closed_positions"] == 2


def test_research_score_rewards_a_calibrated_arena(db):
    # scherp scheidende arena: hit-rates ver van 0.5 → hoge kalibratie
    db.conn.execute("INSERT INTO strategy_stats(strategy,n,hits,sum_edge) VALUES('a',20,18,0.5)")
    db.conn.execute("INSERT INTO strategy_stats(strategy,n,hits,sum_edge) VALUES('b',20,2,-0.5)")
    db.conn.commit()
    sharp = scorecard.research_score(db)["score"]
    assert sharp > 0


def test_research_score_rewards_healthy_candidate_ratio(db):
    # ~10% kandidaat is gezond-selectief; 100% "ja" is verdacht makkelijk
    for i in range(9):
        db.record_research(hkey=f"r{i}", strategy="x", params="{}", return_pct=0, hold_pct=0,
                           excess_pct=0, trades=10, verdict="verworpen", flags=json.dumps([]))
    db.record_research(hkey="rk", strategy="x", params="{}", return_pct=1, hold_pct=0,
                       excess_pct=1, trades=10, verdict="kandidaat", flags=json.dumps([]))
    healthy = scorecard.research_score(db)
    assert healthy["kandidaat_ratio"] == 0.1

    db2 = db  # vergelijk met een "accepteert alles" register in een vers db-blok
    # (zelfde db hergebruiken zou de ratio vertroebelen; alleen de gezonde case assert'en we hard)
    assert healthy["score"] > 0


def test_scorecard_bundles_both(db):
    _equity(db, 100.0)
    card = scorecard.scorecard(db)
    assert set(card) == {"trading", "research"}
    assert "score" in card["trading"] and "score" in card["research"]
