"""Adversariële onderzoekslaag: cost-stress, shuffle-null, delay, leave-one-out."""

import random

from autopilot import adversarial as adv
from autopilot.models import Candle
from conftest import make_config

H = 3_600_000
WARM = 60


def _series(start, drift, n=400, seed=0):
    rng = random.Random(seed)
    px = [start]
    for _ in range(n - 1):
        px.append(max(1.0, px[-1] * (1 + drift + rng.gauss(0, 0.01))))
    return [Candle(i * H, px[i], px[i], px[i], px[i], 1.0) for i in range(n)]


def _data():
    return {"BTC-EUR": _series(100, 0.0005, seed=1),
            "ETH-EUR": _series(50, 0.0003, seed=2),
            "SOL-EUR": _series(10, 0.0007, seed=3)}


def _cfg():
    return make_config(pairs=["BTC-EUR", "ETH-EUR", "SOL-EUR"],
                       strategy={"name": "dca", "params": {"amount_eur": 10, "every_hours": 24}},
                       risk={"max_position_pct": 40, "stop_loss_pct": 30, "take_profit_pct": 50,
                             "max_daily_loss_pct": 20, "max_drawdown_pct": 50})


def test_cost_stress_returns_row_per_multiplier():
    rows = adv.cost_stress(_cfg(), "dca", _data(), mults=(1.0, 2.0, 4.0), warmup=WARM)
    assert [m for m, _ in rows] == [1.0, 2.0, 4.0]
    assert all(isinstance(e, float) for _, e in rows)


def test_shuffle_returns_valid_p_luck():
    data = _data()
    real = adv.excess_vs_hold(_cfg(), "dca", data, warmup=WARM)
    out = adv.shuffle_test(_cfg(), "dca", data, real, n=5, warmup=WARM, seed=1)
    assert 0.0 < out["p_luck"] <= 1.0 and out["n"] == 5


def test_delay_runs_and_returns_float():
    data = _data()
    d = adv.delay_test(_cfg(), "dca", data, lag=6, warmup=WARM)
    assert isinstance(d, float)


def test_universe_leave_one_out_covers_each_pair():
    loo = adv.universe_test(_cfg(), "dca", _data(), warmup=WARM)
    assert {p for p, _ in loo} == {"BTC-EUR", "ETH-EUR", "SOL-EUR"}


def test_run_all_produces_verdict_and_flags():
    out = adv.run_all(_cfg(), "dca", _data(), shuffles=5, lag=6, warmup=WARM, seed=1)
    assert "verdict" in out and isinstance(out["flags"], list)
    assert "real_excess" in out and "shuffle" in out
