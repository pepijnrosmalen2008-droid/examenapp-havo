"""Cross-sectional momentum: rangschikt het universe, roteert de top-N, long-only."""

from datetime import datetime, timedelta, timezone

import pytest

from autopilot.models import Candle, Position, Side
from autopilot.strategies import get_strategy
from conftest import make_config

D = 86_400_000
NOW = datetime(2026, 7, 1, tzinfo=timezone.utc)


def daily(closes, start_ts=0):
    return [Candle(start_ts + i * D, c, c, c, c, 1.0) for i, c in enumerate(closes)]


def make_universe(returns: dict[str, float], days=40):
    """Bouw voor elke coin een reeks die precies `ret` rendement over de reeks geeft."""
    data = {}
    for pair, ret in returns.items():
        step = (1 + ret) ** (1 / (days - 1))
        data[pair] = daily([100 * step**i for i in range(days)])
    return data


def cfg_cs(**params):
    p = {"lookback_days": 20, "top_n": 2, "rebalance_days": 7}
    p.update(params)
    return make_config(pairs=["A-EUR", "B-EUR", "C-EUR", "D-EUR"],
                       strategy={"name": "cross_sectional", "params": p})


def test_buys_top_n_by_relative_strength(db):
    strat = get_strategy(cfg_cs(top_n=2), db)
    data = make_universe({"A-EUR": 0.50, "B-EUR": 0.30, "C-EUR": -0.10, "D-EUR": -0.30})
    sigs = strat.generate_signals(data, [], NOW)
    buys = [s for s in sigs if s.side == Side.BUY]
    assert {s.pair for s in buys} == {"A-EUR", "B-EUR"}   # de twee sterkste
    assert all(s.amount_eur == pytest.approx(500 / 2) for s in buys)  # kapitaal/top_n


def test_rotates_out_dropped_coin(db):
    strat = get_strategy(cfg_cs(top_n=2), db)
    # we houden C en A aan; nieuwe ranking wil A en B → C moet verkocht, B gekocht
    data = make_universe({"A-EUR": 0.50, "B-EUR": 0.30, "C-EUR": -0.10, "D-EUR": -0.30})
    held = [Position(pair="A-EUR", amount=1, avg_price=100, opened_at="2026-01-01"),
            Position(pair="C-EUR", amount=1, avg_price=100, opened_at="2026-01-01")]
    sigs = strat.generate_signals(data, held, NOW)
    sells = {s.pair for s in sigs if s.side == Side.SELL}
    buys = {s.pair for s in sigs if s.side == Side.BUY}
    assert sells == {"C-EUR"}          # uit de top gevallen
    assert buys == {"B-EUR"}           # nieuw in de top; A al aangehouden → niet opnieuw gekocht


def test_rebalance_gate(db):
    strat = get_strategy(cfg_cs(rebalance_days=7), db)
    data = make_universe({"A-EUR": 0.5, "B-EUR": 0.3, "C-EUR": -0.1, "D-EUR": -0.3})
    assert strat.generate_signals(data, [], NOW)                 # eerste keer: rebalance
    assert strat.generate_signals(data, [], NOW + timedelta(days=3)) == []   # te vroeg
    assert strat.generate_signals(data, [], NOW + timedelta(days=8))         # weer toegestaan


def test_skips_coins_without_history(db):
    strat = get_strategy(cfg_cs(lookback_days=20, top_n=3), db)
    data = make_universe({"A-EUR": 0.5, "B-EUR": 0.3}, days=40)
    data["NEW-EUR"] = daily([100, 101, 102])   # te kort → genegeerd
    sigs = strat.generate_signals(data, [], NOW)
    assert "NEW-EUR" not in {s.pair for s in sigs}


def test_state_survives_restart(db):
    strat = get_strategy(cfg_cs(), db)
    data = make_universe({"A-EUR": 0.5, "B-EUR": 0.3, "C-EUR": -0.1, "D-EUR": -0.3})
    strat.generate_signals(data, [], NOW)
    strat2 = get_strategy(cfg_cs(), db)  # herstart
    assert strat2.generate_signals(data, [], NOW + timedelta(days=2)) == []  # gate blijft gelden
