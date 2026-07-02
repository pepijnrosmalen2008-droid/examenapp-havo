"""Dashboard: genereert valide, complete HTML uit de database-state."""

from datetime import datetime, timedelta, timezone

from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config
from dashboard import collect, render

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


def run_session(db, market, cycles=30):
    cfg = make_config(strategy={"name": "dca", "params": {"amount_eur": 10, "every_hours": 4}})
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur)
    engine = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                           TradingMode.PAPER)
    engine.startup()
    for i in range(cycles):
        market.prices["BTC-EUR"] *= 1.001 if i % 3 else 0.998
        engine.cycle(NOW + timedelta(hours=i))
    return cfg, engine


def test_dashboard_renders_state(db, market):
    cfg, _ = run_session(db, market)
    page = render(collect(db, cfg), cfg)
    for fragment in ("Equity", "Drawdown", "Open posities", "Laatste orders",
                     "risk-blokkades", "PAPER", "kill-switch", "<svg", "prefers-color-scheme"):
        assert fragment in page
    assert "BTC-EUR" in page  # posities/orders zichtbaar


def test_dashboard_shows_halt_status(db, market):
    cfg, engine = run_session(db, market, cycles=5)
    engine.risk.trigger_halt("drawdown 15.2%")
    page = render(collect(db, cfg), cfg)
    assert "GESTOPT" in page and "drawdown 15.2%" in page


def test_dashboard_empty_database(db):
    cfg = make_config()
    page = render(collect(db, cfg), cfg)  # geen snapshots/orders → geen crash
    assert "geen open posities" in page and "nog geen orders" in page
