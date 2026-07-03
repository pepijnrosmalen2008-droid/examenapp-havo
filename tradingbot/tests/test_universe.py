"""Coin-universe selectie: liquiditeits-/spread-filter over alle EUR-markten."""

from autopilot.universe import select_universe
from conftest import make_config


MARKETS = [
    {"pair": "BTC-EUR", "active": True},
    {"pair": "ETH-EUR", "active": True},
    {"pair": "SOL-EUR", "active": True},
    {"pair": "DOGE-EUR", "active": True},
    {"pair": "DEAD-EUR", "active": False},   # in onderhoud
    {"pair": "ILLIQ-EUR", "active": True},
]
STATS = {
    "BTC-EUR":  {"volume_eur": 5_000_000, "spread_pct": 0.02},
    "ETH-EUR":  {"volume_eur": 3_000_000, "spread_pct": 0.03},
    "SOL-EUR":  {"volume_eur": 800_000,   "spread_pct": 0.1},
    "DOGE-EUR": {"volume_eur": 400_000,   "spread_pct": 0.9},   # spread te wijd
    "DEAD-EUR": {"volume_eur": 9_000_000, "spread_pct": 0.01},  # maar inactief
    "ILLIQ-EUR":{"volume_eur": 5_000,     "spread_pct": 0.05},  # omzet te laag
}


def ucfg(**kw):
    return make_config(universe={"enabled": True, "min_daily_volume_eur": 250_000,
                                 "max_spread_pct": 0.5, "max_markets": 40,
                                 "always_include": ["BTC-EUR", "ETH-EUR"], **kw})


def test_disabled_returns_config_pairs():
    cfg = make_config()  # universe uit
    assert select_universe(cfg, MARKETS, STATS) == cfg.pairs


def test_filters_volume_spread_and_inactive():
    sel = select_universe(ucfg(), MARKETS, STATS)
    assert set(sel) == {"BTC-EUR", "ETH-EUR", "SOL-EUR"}
    assert "DOGE-EUR" not in sel   # spread 0.9 > 0.5
    assert "ILLIQ-EUR" not in sel  # 5k < 250k
    assert "DEAD-EUR" not in sel   # inactief


def test_sorted_by_volume_and_capped():
    sel = select_universe(ucfg(max_markets=2), MARKETS, STATS)
    # top-2 op omzet zijn BTC, ETH; SOL valt buiten de cap...
    assert sel[:2] == ["BTC-EUR", "ETH-EUR"]
    assert "SOL-EUR" not in sel


def test_always_include_added_even_if_capped_out():
    # cap 1 → alleen BTC op omzet; ETH moet er via always_include alsnog bij
    sel = select_universe(ucfg(max_markets=1), MARKETS, STATS)
    assert "BTC-EUR" in sel and "ETH-EUR" in sel


def test_always_include_skipped_if_market_absent():
    sel = select_universe(ucfg(always_include=["BTC-EUR", "NOPE-EUR"]), MARKETS, STATS)
    assert "NOPE-EUR" not in sel
