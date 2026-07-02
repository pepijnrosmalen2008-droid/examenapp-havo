"""Tests voor de backtest-machinerie: replay, slicing, walk-forward."""

import math
import random
from datetime import datetime, timezone

import pytest

from autopilot.backtesting import (ReplayMarket, buy_and_hold, max_drawdown,
                                   run_backtest, slice_data)
from autopilot.models import Candle
from conftest import make_config

H = 3_600_000
START = int(datetime(2025, 1, 1, tzinfo=timezone.utc).timestamp() * 1000)


def synth(n_hours: int, p0: float = 100.0, seed: int = 7) -> list[Candle]:
    rnd = random.Random(seed)
    out, price, ts = [], p0, START
    for _ in range(n_hours):
        o = price
        price = max(price * math.exp(rnd.gauss(0.00002, 0.004)), 0.01)
        out.append(Candle(ts, o, max(o, price) * 1.001, min(o, price) * 0.999, price, 1.0))
        ts += H
    return out


def two_pair_data(n_hours: int):
    return {"BTC-EUR": synth(n_hours, 30_000, seed=1), "ETH-EUR": synth(n_hours, 2_000, seed=2)}


def test_slice_data_includes_warmup():
    data = two_pair_data(24 * 60)
    start = START + 24 * 40 * H
    sliced = slice_data(data, start, start + 24 * 10 * H, warmup=100)
    series = sliced["BTC-EUR"]
    assert series[0].ts == start - 100 * H
    assert series[-1].ts < start + 24 * 10 * H


def test_replay_market_no_lookahead():
    data = two_pair_data(24 * 40)
    m = ReplayMarket(data)
    ts = data["BTC-EUR"][500].ts
    m.seek(ts)
    assert m.ticker_price("BTC-EUR") == data["BTC-EUR"][500].close
    got = m.candles("BTC-EUR", "1h", limit=50)
    assert got[-1].ts == ts and len(got) == 50


def test_replay_market_daily_aggregation_only_closed_days():
    data = two_pair_data(24 * 40)
    m = ReplayMarket(data)
    m.seek(data["BTC-EUR"][24 * 10 + 5].ts)  # midden op dag 10
    daily = m.candles("BTC-EUR", "1d", limit=400)
    assert len(daily) == 10  # dag 10 is nog niet af → niet meegeleverd
    assert daily[-1].close == data["BTC-EUR"][24 * 10 - 1].close


def test_run_backtest_equity_starts_at_capital():
    cfg = make_config()
    res = run_backtest(cfg, "dca", two_pair_data(24 * 45), warmup=24 * 35)
    assert res["equity_curve"][0][1] == pytest.approx(500, rel=0.05)
    assert res["trades"] >= 2  # minstens één DCA-koop per pair


def test_buy_and_hold_costs_applied():
    data = two_pair_data(24 * 45)
    cfg = make_config()
    res = buy_and_hold(cfg, data, warmup=24 * 35)
    # vlakke markt → resultaat ≈ alleen fees/slippage kwijt (±enkele %)
    assert res["final_equity"] < 500 * 1.2
    assert res["trades"] == 2


def test_max_drawdown():
    assert max_drawdown([100, 120, 90, 110]) == pytest.approx(25.0)
    assert max_drawdown([100, 110, 120]) == pytest.approx(0.0)


def test_walk_forward_runs_and_chains_capital():
    from walkforward import walk_forward
    cfg = make_config()
    data = two_pair_data(24 * 100)  # 100 dagen: 30 warmup + 2 vensters van (20+15)
    res = walk_forward(cfg, "dca", data, train_days=20, test_days=15)
    assert len(res["rows"]) >= 2
    for row in res["rows"]:
        assert row["params"] in [{"every_hours": h} for h in (12, 24, 48)]
    # aaneengeschakeld OOS-rendement is consistent met het eindkapitaal
    assert res["final"] == pytest.approx(500 * (1 + res["oos_return_pct"] / 100), rel=1e-6)
