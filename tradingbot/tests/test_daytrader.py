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
