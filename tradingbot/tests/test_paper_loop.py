"""Integration tests: paper-trading loop end-to-end met gemockte marktdata.

Geen enkele test raakt de echte Bitvavo API.
"""

from datetime import datetime, timedelta, timezone

import pytest

from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config


def build(db, market: FakeMarket, cfg=None) -> TradingEngine:
    cfg = cfg or make_config()
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur,
                          taker_fee_pct=cfg.costs.taker_fee_pct,
                          slippage_pct=cfg.costs.slippage_pct)
    engine = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                           TradingMode.PAPER)
    engine.startup()
    return engine


NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


def test_dca_buys_once_per_interval(db, market):
    engine = build(db, market)
    engine.cycle(NOW)

    orders = db.recent_orders()
    fills = [o for o in orders if o["status"] == "FILLED"]
    assert len(fills) == 2  # één DCA-koop per pair
    assert {o["pair"] for o in fills} == {"BTC-EUR", "ETH-EUR"}
    assert all(o["side"] == "BUY" for o in fills)

    # tweede cycle binnen het interval: géén nieuwe kopen
    engine.cycle(NOW + timedelta(minutes=15))
    assert len([o for o in db.recent_orders() if o["status"] == "FILLED"]) == 2

    # na 24 uur wél weer
    engine.cycle(NOW + timedelta(hours=25))
    assert len([o for o in db.recent_orders() if o["status"] == "FILLED"]) == 4


def test_paper_balances_and_positions_update(db, market):
    engine = build(db, market)
    engine.cycle(NOW)

    positions = db.open_positions()
    assert len(positions) == 2
    btc = next(p for p in positions if p.pair == "BTC-EUR")
    # €10 gekocht met 0,25% fee en 0,1% slippage → iets minder dan 10/50000 BTC
    assert btc.amount == pytest.approx((10 - 0.025) / (50_000 * 1.001), rel=1e-6)

    eur = db.paper_balance("EUR")
    assert eur == pytest.approx(500 - 20)  # 2 × €10 uitgegeven

    cash = db.get_meta_float("bot_cash_eur", 0)
    assert cash == pytest.approx(480)  # bot-boekhouding loopt gelijk met paper-balans


def test_stop_loss_closes_position(db, market):
    engine = build(db, market)
    engine.cycle(NOW)
    assert len(db.open_positions()) == 2

    # BTC zakt 6% (> 5% stop-loss); ETH blijft gelijk
    market.prices["BTC-EUR"] = 50_000 * 0.94
    engine.cycle(NOW + timedelta(minutes=15))

    open_pairs = {p.pair for p in db.open_positions()}
    assert "BTC-EUR" not in open_pairs and "ETH-EUR" in open_pairs
    sells = [o for o in db.recent_orders() if o["side"] == "SELL" and o["status"] == "FILLED"]
    assert len(sells) == 1 and "stop-loss" in sells[0]["reason"]


def test_take_profit_closes_position(db, market):
    engine = build(db, market)
    engine.cycle(NOW)
    market.prices["ETH-EUR"] = 2_500 * 1.12  # +12% > 10% TP
    engine.cycle(NOW + timedelta(minutes=15))
    sells = [o for o in db.recent_orders() if o["side"] == "SELL" and o["status"] == "FILLED"]
    assert len(sells) == 1 and "take-profit" in sells[0]["reason"]
    assert sells[0]["pair"] == "ETH-EUR"


def test_daily_kill_switch_liquidates_and_pauses(db, market):
    cfg = make_config(risk={"max_position_pct": 50, "stop_loss_pct": 30, "take_profit_pct": 50,
                            "max_daily_loss_pct": 3, "max_drawdown_pct": 40},
                      strategy={"name": "dca", "params": {"amount_eur": 100, "every_hours": 1}})
    engine = build(db, market, cfg)
    engine.cycle(NOW)
    assert len(db.open_positions()) == 2  # €100 BTC + €100 ETH

    # markt -10% → verlies op €200 exposure ≈ -€20 op €500 = -4% dag → kill switch
    market.prices = {"BTC-EUR": 45_000.0, "ETH-EUR": 2_250.0}
    engine.cycle(NOW + timedelta(hours=2))

    assert len(db.open_positions()) == 0          # alles geliquideerd
    assert engine.risk.is_paused(NOW + timedelta(hours=3))
    assert not engine.risk.is_halted()

    # tijdens de pauze geen nieuwe trades
    n_orders = len(db.recent_orders(100))
    engine.cycle(NOW + timedelta(hours=4))
    assert len(db.recent_orders(100)) == n_orders

    # na 24 uur weer wel
    assert not engine.risk.is_paused(NOW + timedelta(hours=27))


def test_drawdown_kill_switch_halts_permanently(db, market):
    cfg = make_config(risk={"max_position_pct": 80, "stop_loss_pct": 40, "take_profit_pct": 50,
                            "max_daily_loss_pct": 25, "max_drawdown_pct": 30},
                      strategy={"name": "dca", "params": {"amount_eur": 400, "every_hours": 1}})
    engine = build(db, market, cfg)
    engine.cycle(NOW)

    # crash van 50% → drawdown ~40% van startkapitaal
    market.prices = {"BTC-EUR": 25_000.0, "ETH-EUR": 1_250.0}
    engine.cycle(NOW + timedelta(hours=2))

    assert engine.risk.is_halted()
    assert len(db.open_positions()) == 0
    # alles staat weer in EUR
    balances = db.paper_balances()
    assert all(v == pytest.approx(0, abs=1e-9) for a, v in balances.items() if a != "EUR")

    # cycles doen daarna niets meer, ook na "herstart" (nieuwe engine, zelfde db)
    n_orders = len(db.recent_orders(100))
    engine2 = build(db, FakeMarket({"BTC-EUR": 60_000.0, "ETH-EUR": 3_000.0}))
    engine2.cycle(NOW + timedelta(days=2))
    assert len(db.recent_orders(100)) == n_orders


def test_cycle_logs_a_decision(db, market):
    engine = build(db, market)
    engine.cycle(NOW)
    decisions = db.recent_decisions(5)
    assert decisions, "elke cycle hoort een beslissing vast te leggen"
    # DCA kocht twee coins → stance 'kopen'
    assert decisions[0]["stance"] == "kopen"
    assert decisions[0]["headline"]


def test_bot_never_exceeds_capital(db, market):
    cfg = make_config(capital_eur=100,
                      risk={"max_position_pct": 90, "stop_loss_pct": 30, "take_profit_pct": 50,
                            "max_daily_loss_pct": 20, "max_drawdown_pct": 50},
                      strategy={"name": "dca", "params": {"amount_eur": 500, "every_hours": 1}})
    engine = build(db, market, cfg)
    engine.cycle(NOW)
    # DCA vroeg €500 per pair; risk engine capt op 90% van €100 kapitaal
    spent = sum(o["amount_eur"] or 0 for o in db.recent_orders() if o["side"] == "BUY")
    assert spent <= 100
