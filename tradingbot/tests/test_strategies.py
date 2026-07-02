"""Unit tests voor indicatoren en de ma_cross/grid strategieën (dca zit in test_paper_loop)."""

import math
from datetime import datetime, timezone

import pytest

from autopilot.indicators import ema, rsi, volatility
from autopilot.models import Candle, Position, Side
from autopilot.strategies import get_strategy
from conftest import make_config

NOW = datetime(2026, 7, 1, tzinfo=timezone.utc)
H = 3_600_000


def candles_from_closes(closes, start_ts=0):
    return [Candle(ts=start_ts + i * H, open=c, high=c * 1.01, low=c * 0.99, close=c, volume=1.0)
            for i, c in enumerate(closes)]


# ── indicatoren ──────────────────────────────────────────────────────

def test_ema_known_values():
    out = ema([1, 2, 3, 4, 5], 3)
    assert math.isnan(out[0]) and math.isnan(out[1])
    assert out[2] == pytest.approx(2.0)      # seed = SMA(1,2,3)
    assert out[3] == pytest.approx(3.0)      # 4*0.5 + 2*0.5
    assert out[4] == pytest.approx(4.0)


def test_rsi_bounds_and_direction():
    up = rsi(list(range(1, 40)), 14)
    assert up[-1] == pytest.approx(100.0)     # alleen stijgingen
    down = rsi(list(range(40, 1, -1)), 14)
    assert down[-1] == pytest.approx(0.0, abs=1e-9)
    mixed = rsi([100 + (i % 2) for i in range(40)], 14)
    assert 0 < mixed[-1] < 100


def test_volatility_zero_for_constant_series():
    assert volatility([100.0] * 50) == pytest.approx(0.0)
    assert volatility([100, 110, 90, 105, 95] * 10) > 0


# ── momentum_ma_cross ────────────────────────────────────────────────

def ma_cfg():
    return make_config(strategy={"name": "momentum_ma_cross",
                                 "params": {"fast": 3, "slow": 5, "rsi_period": 3,
                                            "rsi_min": 50, "rsi_max": 95}},
                       pairs=["BTC-EUR"])


# dip → herstel; de bullish cross (EMA3 boven EMA5) valt precies op de laatste candle
BULL_CLOSES = [100.0] * 30 + [95, 92, 90, 88, 87, 90, 95]
BEAR_CLOSES = [100.0] * 30 + [105, 108, 110, 112, 113, 110, 105]


def test_ma_cross_buy_on_bullish_cross(db):
    strat = get_strategy(ma_cfg(), db)
    sigs = strat.generate_signals({"BTC-EUR": candles_from_closes(BULL_CLOSES)}, [], NOW)
    assert len(sigs) == 1 and sigs[0].side == Side.BUY
    assert "bullish" in sigs[0].reason


def test_ma_cross_same_candle_not_signalled_twice(db):
    strat = get_strategy(ma_cfg(), db)
    data = {"BTC-EUR": candles_from_closes(BULL_CLOSES)}
    assert len(strat.generate_signals(data, [], NOW)) == 1
    assert strat.generate_signals(data, [], NOW) == []  # zelfde candle → geen herhaling


def test_ma_cross_sell_on_bearish_cross(db):
    strat = get_strategy(ma_cfg(), db)
    pos = Position(pair="BTC-EUR", amount=0.01, avg_price=100, opened_at="2026-01-01")
    sigs = strat.generate_signals({"BTC-EUR": candles_from_closes(BEAR_CLOSES)}, [pos], NOW)
    assert len(sigs) == 1 and sigs[0].side == Side.SELL


def test_ma_cross_no_buy_without_position_free_cross_or_overbought(db):
    cfg = make_config(strategy={"name": "momentum_ma_cross",
                                "params": {"fast": 3, "slow": 5, "rsi_period": 3,
                                           "rsi_min": 50, "rsi_max": 60}},  # streng: RSI zal >60 zijn
                      pairs=["BTC-EUR"])
    strat = get_strategy(cfg, db)
    closes = [100.0] * 30 + [95, 92, 90, 88, 87] + [90, 95, 101, 108]
    sigs = strat.generate_signals({"BTC-EUR": candles_from_closes(closes)}, [], NOW)
    assert sigs == []  # RSI-filter blokkeert overbought entry


# ── grid ─────────────────────────────────────────────────────────────

def grid_cfg():
    return make_config(strategy={"name": "grid",
                                 "params": {"levels": 4, "order_eur": 25, "band_k": 2.0}},
                       pairs=["BTC-EUR"])


def make_grid_series(final_price: float, n: int = 24 * 10):
    """Stabiele reeks rond 100 met wat ruis (σ>0), eindigend op final_price."""
    closes = [100 + (1 if i % 2 else -1) * 0.8 for i in range(n)]
    closes[-1] = final_price
    return candles_from_closes(closes)


def test_grid_calibrates_then_buys_on_drop(db):
    strat = get_strategy(grid_cfg(), db)
    data = {"BTC-EUR": make_grid_series(100.0)}
    assert strat.generate_signals(data, [], NOW) == []  # eerste cycle: alleen kalibratie
    band = strat.load_state("BTC-EUR")["band"]
    assert band["low"] < 100 < band["high"]

    # prijs zakt naar het midden van precies één level lager → BUY van 1 × order_eur
    step = (band["high"] - band["low"]) / 4
    cur = strat._level(100.0, band, 4)
    target = band["low"] + (cur - 0.5) * step  # midden van level cur-1
    drop = candles_from_closes([c.close for c in data["BTC-EUR"]][:-1] + [target])
    sigs = strat.generate_signals({"BTC-EUR": drop}, [], NOW)
    assert len(sigs) == 1 and sigs[0].side == Side.BUY
    assert sigs[0].amount_eur == pytest.approx(25)


def test_grid_sells_on_rise_only_what_it_has(db):
    strat = get_strategy(grid_cfg(), db)
    data = {"BTC-EUR": make_grid_series(100.0)}
    strat.generate_signals(data, [], NOW)  # kalibratie
    band = strat.load_state("BTC-EUR")["band"]
    step = (band["high"] - band["low"]) / 4

    rise = candles_from_closes([c.close for c in data["BTC-EUR"]][:-1] + [100 + step * 2.2])
    pos = Position(pair="BTC-EUR", amount=0.3, avg_price=95, opened_at="2026-01-01")
    sigs = strat.generate_signals({"BTC-EUR": rise}, [pos], NOW)
    assert len(sigs) == 1 and sigs[0].side == Side.SELL
    assert sigs[0].amount_asset <= 0.3

    # zonder holdings géén sell-signaal
    strat2 = get_strategy(grid_cfg(), db)
    db.set_strategy_state("grid", "BTC-EUR", strat.load_state("BTC-EUR") | {"last_level": 2})
    sigs = strat2.generate_signals({"BTC-EUR": rise}, [], NOW)
    assert all(s.side != Side.SELL or s.amount_asset * 100 >= 5 for s in sigs)


def test_grid_state_survives_restart(db):
    strat = get_strategy(grid_cfg(), db)
    data = {"BTC-EUR": make_grid_series(100.0)}
    strat.generate_signals(data, [], NOW)
    strat2 = get_strategy(grid_cfg(), db)  # "herstart"
    assert strat2.load_state("BTC-EUR")["band"] == strat.load_state("BTC-EUR")["band"]
