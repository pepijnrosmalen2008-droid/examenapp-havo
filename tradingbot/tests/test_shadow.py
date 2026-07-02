"""Shadow mode: het volledige live-pad, behalve de order zelf — die wordt nooit verstuurd."""

from datetime import datetime, timezone

import pytest

from autopilot.config import TradingMode, resolve_mode
from autopilot.engine import TradingEngine
from autopilot.exchange import ShadowExchange
from autopilot.models import Side
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


class RealClientStub:
    """Simuleert een view-only BitvavoClient. Ontploft als iemand een order probeert."""

    def __init__(self, eur: float):
        self.eur = eur

    def balances(self):
        return {"EUR": self.eur, "BTC": 0.5}

    def place_market_order(self, *a, **kw):
        raise AssertionError("SHADOW mag nooit een echte order plaatsen")


def build(db, market, real=None, cfg=None):
    cfg = cfg or make_config(mode="SHADOW")
    x = ShadowExchange(db, market, capital_eur=cfg.capital_eur, real_client=real)
    engine = TradingEngine(cfg, db, x, RiskEngine(cfg, db), get_strategy(cfg, db),
                           TradingMode.SHADOW)
    engine.startup()
    return engine, x


def test_shadow_mode_needs_no_extra_locks(tmp_path, monkeypatch):
    monkeypatch.setenv("TRADING_MODE", "PAPER")  # geen env, geen ack-bestand
    assert resolve_mode(make_config(mode="SHADOW"), project_root=tmp_path) == TradingMode.SHADOW


def test_shadow_never_sends_real_orders(db, market):
    real = RealClientStub(eur=1_000)
    engine, x = build(db, market, real=real)
    engine.cycle(NOW)  # DCA wil kopen

    fills = [o for o in db.recent_orders() if o["status"] == "FILLED"]
    assert len(fills) == 2  # gesimuleerd, mét journal — RealClientStub is niet ontploft
    assert all(o["exchange_order_id"].startswith("shadow-") for o in fills)


def test_shadow_capped_by_real_eur_balance(db, market):
    # config-kapitaal €500, maar er staat écht maar €12 op de rekening
    real = RealClientStub(eur=12)
    engine, x = build(db, market, real=real)
    engine.cycle(NOW)

    spent = sum(o["amount_eur"] or 0 for o in db.recent_orders() if o["side"] == "BUY")
    assert spent <= 12  # shadow gedraagt zich als live: nooit meer dan het echte saldo


def test_shadow_without_key_falls_back_to_bookkeeping(db, market):
    engine, x = build(db, market, real=None)
    assert x.real_eur() is None
    engine.cycle(NOW)
    fills = [o for o in db.recent_orders() if o["status"] == "FILLED"]
    assert len(fills) == 2  # werkt gewoon, zonder echt-saldo-limiet


def test_shadow_sell_also_simulated(db, market):
    real = RealClientStub(eur=1_000)
    engine, x = build(db, market, real=real)
    engine.cycle(NOW)
    market.prices["BTC-EUR"] *= 0.90  # stop-loss
    engine.cycle(NOW)
    sells = [o for o in db.recent_orders() if o["side"] == "SELL" and o["status"] == "FILLED"]
    assert len(sells) == 1 and sells[0]["exchange_order_id"].startswith("shadow-")
