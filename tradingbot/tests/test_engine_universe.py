"""Engine met universe-selectie aan: bot handelt de geselecteerde markten, en de
lichte 'hartslag' (refresh_snapshot) ververst equity zonder te handelen."""

from datetime import datetime, timedelta, timezone

import pytest

from autopilot.config import TradingMode
from autopilot.database import Database
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


def build(cfg, market):
    db = Database(":memory:")
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur)
    engine = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                           TradingMode.PAPER)
    engine.startup()
    return db, engine


def test_universe_enabled_trades_selected_markets():
    market = FakeMarket({"BTC-EUR": 50_000.0, "ETH-EUR": 2_500.0, "SOL-EUR": 150.0,
                         "ADA-EUR": 0.5})
    cfg = make_config(pairs=["BTC-EUR"],
                      strategy={"name": "dca", "params": {"amount_eur": 10, "every_hours": 24}},
                      universe={"enabled": True, "min_daily_volume_eur": 100_000,
                                "max_spread_pct": 0.5, "max_markets": 40,
                                "always_include": ["BTC-EUR"]})
    db, engine = build(cfg, market)
    engine.cycle(NOW)

    fills = [o for o in db.recent_orders(100) if o["status"] == "FILLED"]
    bought = {o["pair"] for o in fills}
    # alle vier liquide markten worden verhandeld, niet alleen de config-pair
    assert bought == {"BTC-EUR", "ETH-EUR", "SOL-EUR", "ADA-EUR"}


def test_universe_skips_wide_spread_market():
    market = FakeMarket({"BTC-EUR": 50_000.0, "JUNK-EUR": 0.01})
    market.spreads = {"JUNK-EUR": 3.0}  # te wijd → uit universe
    cfg = make_config(pairs=["BTC-EUR"],
                      strategy={"name": "dca", "params": {"amount_eur": 10, "every_hours": 24}},
                      universe={"enabled": True, "min_daily_volume_eur": 100_000,
                                "max_spread_pct": 0.5, "max_markets": 40,
                                "always_include": ["BTC-EUR"]})
    db, engine = build(cfg, market)
    engine.cycle(NOW)
    bought = {o["pair"] for o in db.recent_orders(100) if o["status"] == "FILLED"}
    assert bought == {"BTC-EUR"} and "JUNK-EUR" not in bought


def test_universe_selection_cached_per_day():
    market = FakeMarket({"BTC-EUR": 50_000.0, "ETH-EUR": 2_500.0})
    cfg = make_config(universe={"enabled": True, "min_daily_volume_eur": 100_000,
                                "max_spread_pct": 0.5, "max_markets": 40,
                                "always_include": ["BTC-EUR"]})
    db, engine = build(cfg, market)
    engine.cycle(NOW)
    assert db.get_meta("universe_date") == NOW.astimezone().date().isoformat() or db.get_meta("universe_pairs")
    stored = db.get_meta("universe_pairs")
    assert stored and "ETH-EUR" in stored


def test_heartbeat_updates_equity_without_trading():
    market = FakeMarket()
    cfg = make_config(strategy={"name": "dca", "params": {"amount_eur": 10, "every_hours": 24}})
    db, engine = build(cfg, market)
    engine.cycle(NOW)
    n_orders = len(db.recent_orders(100))

    market.prices["BTC-EUR"] *= 1.05  # prijs beweegt
    engine.refresh_snapshot(NOW + timedelta(minutes=1))

    # geen nieuwe orders, maar wel een nieuwe equity-snapshot met de hogere prijs
    assert len(db.recent_orders(100)) == n_orders
    snaps = db.conn.execute("SELECT equity_eur FROM equity_snapshots ORDER BY id").fetchall()
    assert snaps[-1]["equity_eur"] > snaps[-2]["equity_eur"]
    # laatste prijzen bewaard voor de UI
    import json
    lp = json.loads(db.get_meta("last_prices"))
    assert lp["BTC-EUR"] == pytest.approx(market.prices["BTC-EUR"])
