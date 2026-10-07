"""LIVE/SHADOW-start neemt de echte Bitvavo-portefeuille over (munten als posities + EUR als cash)."""

from datetime import datetime, timezone

import pytest

from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import ShadowExchange
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


def _engine(db, market):
    cfg = make_config(pairs=["BTC-EUR", "ETH-EUR", "MOODENG-EUR"], capital_eur=100,
                      strategy={"name": "hold", "params": {}})
    sx = ShadowExchange(db, market, capital_eur=0.0)     # geen auto-stort; wij zetten het saldo zelf
    return TradingEngine(cfg, db, sx, RiskEngine(cfg, db), get_strategy(cfg, db), TradingMode.SHADOW)


def test_adopts_coins_and_eur_skips_dust(db):
    market = FakeMarket({"BTC-EUR": 50_000.0, "ETH-EUR": 2_500.0, "MOODENG-EUR": 0.02})
    db.set_paper_balance("EUR", 94.0)
    db.set_paper_balance("MOODENG", 1000.0)      # €20 → overgenomen
    db.set_paper_balance("BTC", 0.00000010)      # €0.005 dust → overgeslagen
    _engine(db, market).startup()

    pairs = {p.pair for p in db.open_positions()}
    assert "MOODENG-EUR" in pairs                # echte holding wordt een beheerde positie
    assert "BTC-EUR" not in pairs                # stof onder de minimale ordergrootte → genegeerd
    assert db.get_meta_float("bot_cash_eur", -1) == pytest.approx(94.0)      # echte EUR = cash
    assert db.get_meta_float("starting_capital", 0) == pytest.approx(94 + 20, rel=1e-3)


def test_entry_price_is_current_so_pnl_starts_flat(db):
    market = FakeMarket({"MOODENG-EUR": 0.02})
    db.set_paper_balance("EUR", 0.0)
    db.set_paper_balance("MOODENG", 5000.0)      # €100
    _engine(db, market).startup()
    pos = next(p for p in db.open_positions() if p.pair == "MOODENG-EUR")
    assert pos.avg_price == pytest.approx(0.02)  # instap = huidige prijs → 0% P&L bij adoptie
