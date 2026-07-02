"""Risk engine tests — het belangrijkste onderdeel van de testsuite.

Test elke limiet, elke kill switch en de bijbehorende logging.
"""

from datetime import datetime, timedelta, timezone

import pytest

from autopilot.database import Database
from autopilot.models import Position, Side, Signal
from autopilot.risk import RiskEngine
from conftest import make_config


PRICES = {"BTC-EUR": 50_000.0, "ETH-EUR": 2_500.0}


@pytest.fixture
def engine(cfg, db) -> RiskEngine:
    db.set_meta("starting_capital", "500")
    db.set_meta("day_start_equity", "500")
    return RiskEngine(cfg, db)


def buy(pair="BTC-EUR", eur=50.0, **kw) -> Signal:
    return Signal(pair=pair, side=Side.BUY, amount_eur=eur, strategy="test", **kw)


def pos(pair="BTC-EUR", amount=0.001, price=50_000.0) -> Position:
    return Position(pair=pair, amount=amount, avg_price=price, opened_at="2026-01-01T00:00:00+00:00")


def decisions(db: Database):
    return db.conn.execute("SELECT * FROM risk_decisions ORDER BY id").fetchall()


# ── Pair-whitelist ───────────────────────────────────────────────────

def test_blocks_pair_outside_whitelist(engine, db):
    d = engine.evaluate(buy(pair="DOGE-EUR"), cash_eur=500, equity_eur=500, positions=[], prices=PRICES)
    assert not d.allowed and "whitelist" in d.reason
    assert any("whitelist" in r["reason"] for r in decisions(db))  # blokkade gelogd


def test_whitelist_applies_even_when_forced(engine):
    d = engine.evaluate(Signal(pair="DOGE-EUR", side=Side.SELL), cash_eur=0, equity_eur=500,
                        positions=[], prices=PRICES, forced=True)
    assert not d.allowed


# ── Position sizing ──────────────────────────────────────────────────

def test_buy_capped_at_max_position_pct(engine):
    # max 20% van 500 = €100
    d = engine.evaluate(buy(eur=300), cash_eur=500, equity_eur=500, positions=[], prices=PRICES)
    assert d.allowed and d.approved_eur == pytest.approx(100)


def test_buy_capped_at_available_cash(engine):
    d = engine.evaluate(buy(eur=80), cash_eur=30, equity_eur=500, positions=[], prices=PRICES)
    assert d.allowed and d.approved_eur == pytest.approx(30)


def test_buy_blocked_when_position_full(engine):
    # bestaande exposure: 0.002 BTC × 50k = €100 = de volledige 20%-limiet
    d = engine.evaluate(buy(eur=50), cash_eur=400, equity_eur=500,
                        positions=[pos(amount=0.002)], prices=PRICES)
    assert not d.allowed and "positielimiet" in d.reason


def test_buy_reduced_by_existing_exposure(engine):
    # €60 exposure → nog €40 ruimte binnen de €100-limiet
    d = engine.evaluate(buy(eur=80), cash_eur=400, equity_eur=500,
                        positions=[pos(amount=0.0012)], prices=PRICES)
    assert d.allowed and d.approved_eur == pytest.approx(40)


def test_buy_below_min_order_blocked(engine):
    d = engine.evaluate(buy(eur=80), cash_eur=3, equity_eur=500, positions=[], prices=PRICES)
    assert not d.allowed and "minimum" in d.reason


def test_exposure_other_pair_does_not_count(engine):
    d = engine.evaluate(buy(pair="ETH-EUR", eur=100), cash_eur=400, equity_eur=500,
                        positions=[pos(amount=0.002)], prices=PRICES)  # BTC vol, ETH leeg
    assert d.allowed and d.approved_eur == pytest.approx(100)


# ── SELL-regels ──────────────────────────────────────────────────────

def test_sell_without_position_blocked(engine):
    d = engine.evaluate(Signal(pair="BTC-EUR", side=Side.SELL, amount_asset=1.0),
                        cash_eur=0, equity_eur=500, positions=[], prices=PRICES)
    assert not d.allowed


def test_sell_capped_at_holdings(engine):
    d = engine.evaluate(Signal(pair="BTC-EUR", side=Side.SELL, amount_asset=5.0),
                        cash_eur=0, equity_eur=500, positions=[pos(amount=0.001)], prices=PRICES)
    assert d.allowed and d.approved_asset == pytest.approx(0.001)


def test_sell_none_amount_sells_all(engine):
    d = engine.evaluate(Signal(pair="BTC-EUR", side=Side.SELL),
                        cash_eur=0, equity_eur=500, positions=[pos(amount=0.0015)], prices=PRICES)
    assert d.allowed and d.approved_asset == pytest.approx(0.0015)


# ── Dag-kill-switch ──────────────────────────────────────────────────

def test_daily_loss_detection(engine, db):
    db.set_meta("day_start_equity", "500")
    breached, pct = engine.daily_loss_breached(484.0)  # -3.2%
    assert breached and pct == pytest.approx(3.2)
    breached, _ = engine.daily_loss_breached(486.0)  # -2.8%
    assert not breached


def test_buy_blocked_when_daily_loss_hit(engine):
    d = engine.evaluate(buy(), cash_eur=400, equity_eur=484, positions=[], prices=PRICES)
    assert not d.allowed and "dagverlies" in d.reason


def test_daily_pause_blocks_everything(engine):
    engine.trigger_daily_pause("test")
    assert engine.is_paused()
    d = engine.evaluate(buy(), cash_eur=400, equity_eur=500, positions=[], prices=PRICES)
    assert not d.allowed and "pauze" in d.reason
    d = engine.evaluate(Signal(pair="BTC-EUR", side=Side.SELL), cash_eur=0, equity_eur=500,
                        positions=[pos()], prices=PRICES)
    assert not d.allowed


def test_daily_pause_expires_after_24h(engine, db):
    engine.trigger_daily_pause("test", now=datetime.now(timezone.utc) - timedelta(hours=25))
    assert not engine.is_paused()
    assert db.get_meta("paused_until") is None  # opgeruimd


def test_forced_liquidation_allowed_during_pause(engine):
    engine.trigger_daily_pause("test")
    d = engine.evaluate(Signal(pair="BTC-EUR", side=Side.SELL), cash_eur=0, equity_eur=480,
                        positions=[pos()], prices=PRICES, forced=True)
    assert d.allowed


# ── Totale kill-switch (max drawdown) ────────────────────────────────

def test_drawdown_detection(engine):
    breached, pct = engine.drawdown_breached(425.0)  # -15%
    assert breached and pct == pytest.approx(15.0)
    breached, _ = engine.drawdown_breached(426.0)
    assert not breached


def test_halt_blocks_everything_and_persists(engine, cfg, db):
    engine.trigger_halt("drawdown 15.5%")
    d = engine.evaluate(buy(), cash_eur=400, equity_eur=420, positions=[], prices=PRICES)
    assert not d.allowed and "gestopt" in d.reason

    # Persistentie: een NIEUWE engine op dezelfde database (= herstart) blijft gestopt
    engine2 = RiskEngine(cfg, db)
    assert engine2.is_halted()
    d = engine2.evaluate(buy(), cash_eur=400, equity_eur=500, positions=[], prices=PRICES)
    assert not d.allowed


def test_forced_liquidation_allowed_during_halt(engine):
    engine.trigger_halt("test")
    d = engine.evaluate(Signal(pair="BTC-EUR", side=Side.SELL), cash_eur=0, equity_eur=420,
                        positions=[pos()], prices=PRICES, forced=True)
    assert d.allowed


def test_clear_halt_via_meta(engine, db):
    engine.trigger_halt("test")
    db.del_meta("halted")  # wat status.py --clear-halt doet
    assert not engine.is_halted()


# ── Per-positie exits (SL/TP/trailing) ───────────────────────────────

def test_stop_loss_triggers(engine):
    p = pos(price=50_000)
    sig = engine.position_exit_signal(p, 47_400)  # -5.2%
    assert sig is not None and sig.side == Side.SELL and "stop-loss" in sig.reason
    assert engine.position_exit_signal(p, 47_600) is None  # -4.8%: nog niet


def test_take_profit_triggers(engine):
    p = pos(price=50_000)
    sig = engine.position_exit_signal(p, 55_100)  # +10.2%
    assert sig is not None and "take-profit" in sig.reason
    assert engine.position_exit_signal(p, 54_900) is None


def test_trailing_take_profit(db):
    cfg = make_config(risk={"max_position_pct": 20, "stop_loss_pct": 5, "take_profit_pct": 10,
                            "trailing_take_profit": True, "max_daily_loss_pct": 3, "max_drawdown_pct": 15})
    db.set_meta("starting_capital", "500")
    engine = RiskEngine(cfg, db)
    p = pos(price=50_000)

    p.peak_price = 54_000  # TP-niveau (55k) nog niet gehaald → geen trailing exit
    assert engine.position_exit_signal(p, 51_500) is None

    p.peak_price = 58_000  # TP-niveau gehaald; 5% onder piek = 55.100
    assert engine.position_exit_signal(p, 55_200) is None
    sig = engine.position_exit_signal(p, 55_000)
    assert sig is not None and "trailing" in sig.reason


# ── Logging van beslissingen ─────────────────────────────────────────

def test_every_decision_is_logged(engine, db):
    engine.evaluate(buy(eur=50), cash_eur=400, equity_eur=500, positions=[], prices=PRICES)   # allow
    engine.evaluate(buy(pair="DOGE-EUR"), cash_eur=400, equity_eur=500, positions=[], prices=PRICES)  # block
    rows = decisions(db)
    assert len(rows) == 2
    assert rows[0]["allowed"] == 1 and rows[0]["approved_eur"] == pytest.approx(50)
    assert rows[1]["allowed"] == 0 and rows[1]["reason"]
