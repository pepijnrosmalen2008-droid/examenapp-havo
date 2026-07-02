"""Regime-filter: geen nieuwe BUY's onder de lange-termijn EMA."""

from autopilot.database import Database
from autopilot.models import Candle, Side, Signal
from autopilot.regime import RegimeFilter
from conftest import make_config

D = 86_400_000


class DailyMarket:
    """Levert 1d-candles met gegeven closes en een ticker."""

    def __init__(self, closes: list[float], price: float):
        self._daily = [Candle(i * D, c, c, c, c, 1.0) for i, c in enumerate(closes)]
        self._price = price

    def candles(self, pair, interval="1d", limit=200, since_ms=None):
        assert interval == "1d"
        return self._daily[-limit:]

    def ticker_price(self, pair):
        return self._price


def regime_cfg(enabled=True, exempt=None):
    return make_config(regime={"enabled": enabled, "ema_days": 50,
                               "exempt": exempt if exempt is not None else ["dca"]})


def buy(strategy="momentum_ma_cross"):
    return Signal(pair="BTC-EUR", side=Side.BUY, amount_eur=50, strategy=strategy)


def test_bear_regime_drops_buys(db):
    f = RegimeFilter(regime_cfg(), db)
    market = DailyMarket([100.0] * 80, price=90.0)  # prijs 10% onder EMA50 → bear
    assert f.apply([buy()], market) == []
    blocks = db.conn.execute("SELECT * FROM risk_decisions WHERE allowed=0").fetchall()
    assert len(blocks) == 1 and "regime" in blocks[0]["reason"]


def test_bull_regime_passes_buys(db):
    f = RegimeFilter(regime_cfg(), db)
    market = DailyMarket([100.0] * 80, price=110.0)
    sigs = f.apply([buy()], market)
    assert len(sigs) == 1


def test_exempt_strategy_not_filtered(db):
    f = RegimeFilter(regime_cfg(), db)
    market = DailyMarket([100.0] * 80, price=90.0)  # bear
    assert len(f.apply([buy(strategy="dca")], market)) == 1


def test_sells_never_filtered(db):
    f = RegimeFilter(regime_cfg(), db)
    market = DailyMarket([100.0] * 80, price=90.0)
    sell = Signal(pair="BTC-EUR", side=Side.SELL, strategy="momentum_ma_cross")
    assert len(f.apply([sell], market)) == 1


def test_disabled_filter_is_noop(db):
    f = RegimeFilter(regime_cfg(enabled=False), db)
    market = DailyMarket([100.0] * 80, price=90.0)
    assert len(f.apply([buy()], market)) == 1


def test_insufficient_history_skips_filter(db):
    f = RegimeFilter(regime_cfg(), db)
    market = DailyMarket([100.0] * 20, price=90.0)  # < ema_days → 'unknown', niet blokkeren
    assert len(f.apply([buy()], market)) == 1
