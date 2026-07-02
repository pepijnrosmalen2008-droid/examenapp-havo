"""Crash-recovery: idempotentie van het order-journal. Geen dubbele orders na een crash."""

from datetime import datetime, timezone

import pytest

from autopilot.config import TradingMode
from autopilot.database import Database
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.models import OrderStatus, Side
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


def build(db, market, cfg=None, exchange=None):
    cfg = cfg or make_config()
    x = exchange or PaperExchange(db, market, capital_eur=cfg.capital_eur)
    engine = TradingEngine(cfg, db, x, RiskEngine(cfg, db), get_strategy(cfg, db), TradingMode.PAPER)
    engine.startup()
    return engine


def test_pending_intent_abandoned_not_replayed(db, market):
    """Crash tussen journal en plaatsing → intent wordt ABANDONED, nooit opnieuw geplaatst."""
    engine = build(db, market)
    coid = db.journal_order_intent("BTC-EUR", Side.BUY, amount_eur=50, amount_asset=None,
                                   reason="test-crash", strategy="dca")
    assert len(db.pending_orders()) == 1

    engine.reconcile()  # PaperExchange heeft geen order-lookup → niet aantoonbaar geplaatst

    row = db.conn.execute("SELECT * FROM orders WHERE client_order_id=?", (coid,)).fetchone()
    assert row["status"] == OrderStatus.ABANDONED.value
    assert db.paper_balance("EUR") == pytest.approx(500)  # geen geld bewogen
    assert db.open_positions() == []


def test_restart_resumes_state(db, market):
    """Herstart: nieuwe engine op dezelfde database ziet posities, cash en dag-anker terug."""
    engine = build(db, market)
    engine.cycle(NOW)
    positions_before = {(p.pair, round(p.amount, 12)) for p in db.open_positions()}
    cash_before = db.get_meta_float("bot_cash_eur", 0)
    assert positions_before

    engine2 = build(db, market)  # startup() draait opnieuw → mag niets dubbel doen
    assert {(p.pair, round(p.amount, 12)) for p in db.open_positions()} == positions_before
    assert db.get_meta_float("bot_cash_eur", 0) == pytest.approx(cash_before)
    assert db.get_meta_float("starting_capital", 0) == pytest.approx(500)  # niet opnieuw gezet

    # en dezelfde dag geen dubbele DCA-koop na herstart
    engine2.cycle(NOW)
    fills = [o for o in db.recent_orders(100) if o["status"] == "FILLED"]
    assert len(fills) == 2


class LiveLookupExchange(PaperExchange):
    """Mockt een live exchange met order-lookup voor reconciliatie."""

    def __init__(self, *args, lookup: dict | None = None, **kw):
        super().__init__(*args, **kw)
        self.lookup = lookup or {}

    def find_order_by_client_id(self, coid: str, pair: str):
        return self.lookup.get(coid)


def test_placed_order_found_filled_is_applied_once(db, market):
    """Crash ná plaatsing: reconcile vindt de gevulde order en verwerkt de fill precies één keer."""
    cfg = make_config()
    coid_holder = {}

    x = LiveLookupExchange(db, market, capital_eur=cfg.capital_eur)
    engine = build(db, market, cfg, exchange=x)

    coid = db.journal_order_intent("BTC-EUR", Side.BUY, amount_eur=50, amount_asset=None,
                                   reason="crash-na-plaatsing", strategy="dca")
    x.lookup[coid] = {"status": "closed", "average": 50_000.0, "filled": 0.001,
                      "cost": 50.0, "fee": {"currency": "EUR", "cost": 0.125}}
    coid_holder["coid"] = coid

    engine.reconcile()

    row = db.conn.execute("SELECT * FROM orders WHERE client_order_id=?", (coid,)).fetchone()
    assert row["status"] == OrderStatus.FILLED.value
    assert row["fee_eur"] == pytest.approx(0.125)
    positions = db.open_positions("BTC-EUR")
    assert len(positions) == 1 and positions[0].amount == pytest.approx(0.001)
    assert db.get_meta_float("bot_cash_eur", 0) == pytest.approx(450)

    # tweede reconcile (bv. nog een herstart) verwerkt NIETS dubbel
    engine.reconcile()
    positions = db.open_positions("BTC-EUR")
    assert len(positions) == 1 and positions[0].amount == pytest.approx(0.001)
    assert db.get_meta_float("bot_cash_eur", 0) == pytest.approx(450)


def test_lookup_failure_leaves_order_pending(db, market):
    """Netwerkfout bij reconcile → order blijft staan voor de volgende poging (geen ABANDONED)."""
    cfg = make_config()

    class BrokenLookup(LiveLookupExchange):
        def find_order_by_client_id(self, coid, pair):
            raise ConnectionError("netwerk kapot")

    x = BrokenLookup(db, market, capital_eur=cfg.capital_eur)
    engine = build(db, market, cfg, exchange=x)
    coid = db.journal_order_intent("BTC-EUR", Side.BUY, amount_eur=50, amount_asset=None,
                                   reason="t", strategy="dca")
    engine.reconcile()
    row = db.conn.execute("SELECT * FROM orders WHERE client_order_id=?", (coid,)).fetchone()
    assert row["status"] == OrderStatus.PENDING.value


def test_mode_mismatch_refuses_start(db, market, tmp_path):
    """PAPER-database mag nooit stilzwijgend door een LIVE-bot hergebruikt worden."""
    engine = build(db, market)  # zet mode=PAPER in meta
    cfg = make_config()
    x = PaperExchange(db, market, capital_eur=cfg.capital_eur)
    live_engine = TradingEngine(cfg, db, x, RiskEngine(cfg, db), get_strategy(cfg, db),
                                TradingMode.LIVE)
    with pytest.raises(RuntimeError, match="mode"):
        live_engine.startup()
