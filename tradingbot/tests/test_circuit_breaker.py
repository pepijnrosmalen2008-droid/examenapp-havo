"""Circuit breakers: API-storingen → cooldown; abnormale spread → pair overslaan."""

from datetime import datetime, timedelta, timezone

import pytest

from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


def build(db, market, cfg=None):
    cfg = cfg or make_config()
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur)
    engine = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                           TradingMode.PAPER)
    engine.startup()
    return engine


def test_consecutive_failures_open_breaker(db, market):
    engine = build(db, market)
    market.fail_ticker = True
    for i in range(3):
        with pytest.raises(ConnectionError):
            engine.cycle(NOW + timedelta(minutes=15 * i))
    assert db.get_meta("cb_pause_until") is not None

    # API is terug, maar de cooldown geldt nog → geen handel
    market.fail_ticker = False
    engine.cycle(NOW + timedelta(minutes=50))
    assert db.recent_orders() == []

    # na de cooldown (30 min na opening) hervat de bot en handelt hij weer
    engine.cycle(NOW + timedelta(minutes=45 + 31))
    assert db.get_meta("cb_pause_until") is None
    assert len([o for o in db.recent_orders() if o["status"] == "FILLED"]) == 2


def test_single_failure_recovers_without_breaker(db, market):
    engine = build(db, market)
    market.fail_ticker = True
    with pytest.raises(ConnectionError):
        engine.cycle(NOW)
    market.fail_ticker = False
    engine.cycle(NOW + timedelta(minutes=15))  # één storing → teller reset, gewoon handelen
    assert db.get_meta("cb_pause_until") is None
    assert db.get_meta("cb_failures") == "0"
    assert len([o for o in db.recent_orders() if o["status"] == "FILLED"]) == 2


def test_failure_counter_survives_restart(db, market, cfg):
    engine = build(db, market)
    market.fail_ticker = True
    with pytest.raises(ConnectionError):
        engine.cycle(NOW)
    with pytest.raises(ConnectionError):
        engine.cycle(NOW + timedelta(minutes=15))

    engine2 = build(db, market)  # herstart (bv. systemd Restart=always)
    with pytest.raises(ConnectionError):
        engine2.cycle(NOW + timedelta(minutes=30))
    assert db.get_meta("cb_pause_until") is not None  # 3e storing telt door over de herstart


def test_wide_spread_blocks_strategy_trading(db, market):
    engine = build(db, market)
    market.spreads = {"BTC-EUR": 2.5, "ETH-EUR": 0.1}
    engine.cycle(NOW)

    fills = [o for o in db.recent_orders() if o["status"] == "FILLED"]
    assert {o["pair"] for o in fills} == {"ETH-EUR"}  # BTC deze cycle overgeslagen
    blocks = db.conn.execute(
        "SELECT * FROM risk_decisions WHERE allowed=0 AND reason LIKE '%spread%'").fetchall()
    assert len(blocks) == 1 and blocks[0]["pair"] == "BTC-EUR"


def test_stop_loss_exit_ignores_spread_breaker(db, market):
    engine = build(db, market)
    engine.cycle(NOW)  # posities openen (spread normaal)
    market.prices["BTC-EUR"] *= 0.90       # stop-loss geraakt
    market.spreads = {"BTC-EUR": 5.0}      # én de spread is abnormaal wijd
    engine.cycle(NOW + timedelta(minutes=15))

    sells = [o for o in db.recent_orders() if o["side"] == "SELL" and o["status"] == "FILLED"]
    assert len(sells) == 1  # kapitaal beschermen gaat vóór fill-kwaliteit


def test_breaker_disabled_via_config(db, market):
    cfg = make_config(circuit_breaker={"enabled": False})
    engine = build(db, market, cfg)
    market.spreads = {"BTC-EUR": 9.0, "ETH-EUR": 9.0}
    engine.cycle(NOW)
    assert len([o for o in db.recent_orders() if o["status"] == "FILLED"]) == 2
