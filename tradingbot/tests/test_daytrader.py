"""Reflex-daytrader-afstellingen: instelbare candle-resolutie + gestorte EUR meteen bruikbaar (LIVE)."""

from datetime import datetime, timezone

import pytest

from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import make_config


def test_adaptive_candle_interval_is_configurable(db):
    cfg = make_config(strategy={"name": "adaptive",
                                "params": {"candle_interval": "5m", "candle_limit": 120}})
    strat = get_strategy(cfg, db)
    assert strat.candle_interval == "5m" and strat.candle_limit == 120


def test_adaptive_candle_interval_defaults(db):
    strat = get_strategy(make_config(strategy={"name": "adaptive", "params": {}}), db)
    assert strat.candle_interval == "1h"


class _FakeLiveX:
    """Minimale broker-stub met alleen een EUR-saldo, voor de LIVE cash-logica."""
    def __init__(self, eur):
        self.eur = eur

    def balances(self):
        return {"EUR": self.eur}


def _live_engine(db, eur):
    cfg = make_config(strategy={"name": "hold", "params": {}})
    return TradingEngine(cfg, db, _FakeLiveX(eur), RiskEngine(cfg, db),
                         get_strategy(cfg, db), TradingMode.LIVE)


def test_deposit_becomes_tradeable_immediately(db):
    db.set_meta("bot_cash_eur", "50")        # bot kent €50
    eng = _live_engine(db, eur=120.0)        # maar er staat €120 echt (je stortte bij)
    assert eng._cash_eur() == pytest.approx(120.0)                 # storting direct beschikbaar
    assert db.get_meta_float("bot_cash_eur", 0) == pytest.approx(120.0)  # boekhouding bijgewerkt


def test_live_cash_never_exceeds_real_balance(db):
    db.set_meta("bot_cash_eur", "100")       # boekhouding €100
    eng = _live_engine(db, eur=80.0)         # maar er staat maar €80 echt
    assert eng._cash_eur() == pytest.approx(80.0)                  # nooit meer dan het echte saldo


class _FakeWalletX:
    """Broker-stub met EUR + muntsaldi en tickerprijzen, voor _wallet_equity."""
    def __init__(self, balances, prices):
        self._b = balances
        self._p = prices

    def balances(self):
        return dict(self._b)

    def ticker_price(self, pair):
        return self._p[pair]


def test_wallet_equity_uses_real_balances(db):
    cfg = make_config(strategy={"name": "hold", "params": {}})
    x = _FakeWalletX({"EUR": 50.0, "BTC": 0.001, "ETH": 0.02},
                     {"BTC-EUR": 60000.0, "ETH-EUR": 3000.0})
    eng = TradingEngine(cfg, db, x, RiskEngine(cfg, db), get_strategy(cfg, db), TradingMode.LIVE)
    # 50 + 0.001*60000 (60) + 0.02*3000 (60) = 170
    assert eng._wallet_equity({"BTC-EUR": 60000.0, "ETH-EUR": 3000.0}) == pytest.approx(170.0)


def test_wallet_equity_none_when_balance_unreadable(db):
    class _Dead:
        def balances(self):
            raise ConnectionError("down")
    cfg = make_config(strategy={"name": "hold", "params": {}})
    eng = TradingEngine(cfg, db, _Dead(), RiskEngine(cfg, db), get_strategy(cfg, db), TradingMode.LIVE)
    assert eng._wallet_equity({}) is None     # onleesbaar → val terug op interne berekening
