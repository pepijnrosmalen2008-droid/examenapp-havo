"""Monte Carlo: bootstrap behoudt structuur, jitter en verdeling werken."""

import random

import pytest

from autopilot.montecarlo import bootstrap_data, percentile, run_monte_carlo
from conftest import make_config
from test_backtesting import two_pair_data


def test_bootstrap_preserves_shape_and_timestamps():
    data = two_pair_data(24 * 40)
    boot = bootstrap_data(data, random.Random(1))
    for pair in data:
        assert len(boot[pair]) == len(data[pair])
        assert [c.ts for c in boot[pair]] == [c.ts for c in data[pair]]
        assert boot[pair][0].close == data[pair][0].close  # zelfde startprijs
        # maar een ander pad
        assert [c.close for c in boot[pair]] != [c.close for c in data[pair]]
        for c in boot[pair]:
            assert c.low <= min(c.open, c.close) + 1e-9
            assert c.high >= max(c.open, c.close) - 1e-9


def test_bootstrap_shares_blocks_across_pairs():
    """Zelfde blokvolgorde voor beide pairs → correlatie blijft behouden."""
    data = two_pair_data(24 * 40)
    b1 = bootstrap_data(data, random.Random(7))
    b2 = bootstrap_data(data, random.Random(7))
    assert [c.close for c in b1["BTC-EUR"]] == [c.close for c in b2["BTC-EUR"]]


def test_percentile():
    xs = [1.0, 2.0, 3.0, 4.0, 5.0]
    assert percentile(xs, 50) == pytest.approx(3.0)
    assert percentile(xs, 0) == pytest.approx(1.0)
    assert percentile(xs, 100) == pytest.approx(5.0)


def test_run_monte_carlo_summary(capsys):
    cfg = make_config()
    data = two_pair_data(24 * 45)
    s = run_monte_carlo(cfg, "dca", data, n=3, seed=2)
    assert s["ret_p5"] <= s["ret_p50"] <= s["ret_p95"]
    assert 0 <= s["halted_pct"] <= 100
    assert len(s["runs"]) == 3
