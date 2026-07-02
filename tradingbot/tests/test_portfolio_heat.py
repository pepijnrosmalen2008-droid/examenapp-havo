"""Portfolio heat: totale kapitaal-op-risico-limiet over alle posities samen."""

import pytest

from autopilot.models import Position, Side, Signal
from autopilot.risk import RiskEngine
from conftest import make_config

PRICES = {"BTC-EUR": 50_000.0, "ETH-EUR": 2_500.0}


def heat_cfg(heat_pct=2.0, max_pos=40):
    return make_config(risk={"max_position_pct": max_pos, "stop_loss_pct": 5,
                             "take_profit_pct": 10, "max_daily_loss_pct": 6,
                             "max_drawdown_pct": 15, "max_portfolio_heat_pct": heat_pct})


def engine_for(cfg, db):
    db.set_meta("starting_capital", "500")
    db.set_meta("day_start_equity", "500")
    return RiskEngine(cfg, db)


def buy(pair="BTC-EUR", eur=200.0):
    return Signal(pair=pair, side=Side.BUY, amount_eur=eur, strategy="test")


def pos(pair, value_eur, price):
    return Position(pair=pair, amount=value_eur / price, avg_price=price, opened_at="2026-01-01")


def test_heat_disabled_by_default(db):
    cfg = make_config()  # geen max_portfolio_heat_pct
    assert cfg.risk.max_portfolio_heat_pct is None
    engine = engine_for(cfg, db)
    d = engine.evaluate(buy(eur=100), cash_eur=500, equity_eur=500, positions=[], prices=PRICES)
    assert d.allowed and d.approved_eur == pytest.approx(100)


def test_heat_caps_buy_size(db):
    # heat-budget: 2% / 5% SL × €500 = €200 totale exposure
    engine = engine_for(heat_cfg(), db)
    d = engine.evaluate(buy(pair="BTC-EUR", eur=200), cash_eur=500, equity_eur=500,
                        positions=[pos("ETH-EUR", 150, 2_500)], prices=PRICES)
    assert d.allowed and d.approved_eur == pytest.approx(50)  # €200 − €150 bestaand


def test_heat_blocks_when_budget_full(db):
    engine = engine_for(heat_cfg(), db)
    d = engine.evaluate(buy(pair="BTC-EUR", eur=100), cash_eur=300, equity_eur=500,
                        positions=[pos("ETH-EUR", 198, 2_500)], prices=PRICES)
    assert not d.allowed and "portfolio heat" in d.reason


def test_heat_counts_all_pairs_as_one_bucket(db):
    # per-pair limiet (40% = €200) laat de koop toe; heat over BTC+ETH samen blokkeert
    engine = engine_for(heat_cfg(), db)
    positions = [pos("ETH-EUR", 110, 2_500), pos("BTC-EUR", 95, 50_000)]
    d = engine.evaluate(buy(pair="BTC-EUR", eur=100), cash_eur=300, equity_eur=500,
                        positions=positions, prices=PRICES)
    assert not d.allowed and "portfolio heat" in d.reason


def test_sells_never_blocked_by_heat(db):
    engine = engine_for(heat_cfg(), db)
    d = engine.evaluate(Signal(pair="BTC-EUR", side=Side.SELL), cash_eur=0, equity_eur=500,
                        positions=[pos("BTC-EUR", 400, 50_000)], prices=PRICES)
    assert d.allowed
