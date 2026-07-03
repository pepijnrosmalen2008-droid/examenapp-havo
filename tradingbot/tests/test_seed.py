"""Seed-portefeuille: PAPER-bot start vanaf bestaande holdings + cash."""

import pytest

from autopilot.config import TradingMode
from autopilot.database import Database
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config


def build(cfg, market):
    db = Database(":memory:")
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur)
    engine = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                           TradingMode.PAPER)
    engine.startup()
    return db, engine


def seed_cfg():
    return make_config(
        capital_eur=190,
        strategy={"name": "dca", "params": {"amount_eur": 10, "every_hours": 999}},
        seed={"enabled": True, "eur": 40,
              "holdings": {"BTC-EUR": 100, "ETH-EUR": 50}})


def test_seed_sets_balances_positions_and_capital():
    market = FakeMarket({"BTC-EUR": 50_000.0, "ETH-EUR": 2_500.0})
    db, engine = build(seed_cfg(), market)

    assert db.paper_balance("EUR") == pytest.approx(40)
    assert db.paper_balance("BTC") == pytest.approx(100 / 50_000)
    assert db.paper_balance("ETH") == pytest.approx(50 / 2_500)

    pos = {p.pair: p for p in db.open_positions()}
    assert set(pos) == {"BTC-EUR", "ETH-EUR"}
    assert pos["BTC-EUR"].avg_price == pytest.approx(50_000)  # instap = prijs bij seed → P&L 0
    # startkapitaal = cash + holdings-waarde
    assert db.get_meta_float("starting_capital", 0) == pytest.approx(40 + 100 + 50)
    assert db.get_meta_float("bot_cash_eur", 0) == pytest.approx(40)


def test_seed_only_runs_once():
    market = FakeMarket({"BTC-EUR": 50_000.0, "ETH-EUR": 2_500.0})
    db, engine = build(seed_cfg(), market)
    btc_before = db.paper_balance("BTC")
    # herstart: nieuwe engine op dezelfde db mag NIET opnieuw seeden
    paper = PaperExchange(db, market, capital_eur=190)
    engine2 = TradingEngine(seed_cfg(), db, paper, RiskEngine(seed_cfg(), db),
                            get_strategy(seed_cfg(), db), TradingMode.PAPER)
    engine2.startup()
    assert db.paper_balance("BTC") == pytest.approx(btc_before)  # niet verdubbeld


def test_seeded_position_is_sellable():
    market = FakeMarket({"BTC-EUR": 50_000.0, "ETH-EUR": 2_500.0})
    db, engine = build(seed_cfg(), market)
    # BTC keldert → stop-loss (25% in default? hier default make_config stop 5%) moet 'm kunnen verkopen
    market.prices["BTC-EUR"] = 50_000 * 0.90
    engine.cycle()
    sells = [o for o in db.recent_orders(50) if o["side"] == "SELL" and o["pair"] == "BTC-EUR"]
    assert sells  # de geseede positie kan verhandeld worden
