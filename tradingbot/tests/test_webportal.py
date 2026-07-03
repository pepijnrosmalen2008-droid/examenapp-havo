"""Webportaal-sync: login, state-upsert, noodstop-commando, fail-silent gedrag."""

import json
from datetime import datetime, timedelta, timezone

import pytest

from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from autopilot.webportal import Portal, build_payload, portal_tick
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


class FakeResponse:
    def __init__(self, payload, status=200):
        self._payload = payload
        self.status_code = status

    def json(self):
        return self._payload

    def raise_for_status(self):
        if self.status_code >= 400:
            raise RuntimeError(f"HTTP {self.status_code}")


class FakeSession:
    """Neemt alle HTTP-verkeer op; geen echte netwerk-calls."""

    def __init__(self, commands=None, fail=False):
        self.calls = []
        self.commands = commands or []
        self.fail = fail

    def _record(self, method, url, **kw):
        self.calls.append((method, url, kw.get("json")))
        if self.fail:
            return FakeResponse({}, status=500)
        if "auth/v1/token" in url:
            return FakeResponse({"access_token": "tok", "expires_in": 3600,
                                 "user": {"id": "uid-123"}})
        if "bot_commands" in url and method == "GET":
            return FakeResponse(self.commands)
        return FakeResponse({})

    def post(self, url, **kw):
        return self._record("POST", url, **kw)

    def get(self, url, **kw):
        return self._record("GET", url, **kw)

    def patch(self, url, **kw):
        return self._record("PATCH", url, **kw)


def make_portal(session) -> Portal:
    return Portal("https://x.supabase.co", "anon", "ik@slagio.nl", "geheim", session=session)


def build_engine(db, market):
    cfg = make_config()
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur)
    engine = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                           TradingMode.PAPER)
    engine.startup()
    return cfg, engine


def test_sync_logs_in_once_and_upserts(db, market):
    cfg, engine = build_engine(db, market)
    engine.cycle(NOW)
    session = FakeSession()
    portal = make_portal(session)

    portal.sync_state(build_payload(db, cfg, "PAPER"))
    portal.sync_state(build_payload(db, cfg, "PAPER"))

    logins = [c for c in session.calls if "auth/v1/token" in c[1]]
    upserts = [c for c in session.calls if "bot_state" in c[1]]
    assert len(logins) == 1  # token wordt hergebruikt
    assert len(upserts) == 2
    body = upserts[0][2]
    assert body["user_id"] == "uid-123"
    json.dumps(body["state"])  # payload is JSON-serialiseerbaar


def test_payload_contents(db, market):
    cfg, engine = build_engine(db, market)
    engine.cycle(NOW)
    p = build_payload(db, cfg, "PAPER")
    assert p["mode"] == "PAPER" and p["strategy"] == "dca"
    assert p["halted"] is False
    assert len(p["positions"]) == 2
    assert p["eq_recent"] and p["eq_recent"][-1][1] == pytest.approx(p["equity_now"], rel=0.01)
    assert p["eq_all"]
    assert "bh_now" in p and "bh_recent" in p and "bh_all" in p
    assert {"max_dd_pct", "sharpe", "sortino", "volatility_pct", "n_trades",
            "win_rate", "avg_win", "avg_loss", "vs_benchmark_pct"} <= set(p["metrics"])
    import json
    json.dumps(p)  # geen NaN → geldige JSON
    assert all({"t", "side", "pair", "eur", "price", "amount", "status", "reason"} <= set(o)
               for o in p["orders"])
    assert all({"price", "value_eur", "pnl_eur", "pnl_pct", "alloc_pct"} <= set(pos)
               for pos in p["positions"])


def test_emergency_stop_command_halts_and_liquidates(db, market):
    cfg, engine = build_engine(db, market)
    engine.cycle(NOW)
    assert len(db.open_positions()) == 2

    session = FakeSession(commands=[{"id": 7, "command": "emergency_stop"}])
    portal_tick(make_portal(session), engine, db, cfg, "PAPER")

    assert engine.risk.is_halted()
    assert db.open_positions() == []
    handled = [c for c in session.calls if c[0] == "PATCH" and "id=eq.7" in c[1]]
    assert handled and handled[0][2] == {"handled": True}
    # gestopte status is direct opnieuw gesynct
    states = [c[2]["state"] for c in session.calls if c[2] and "state" in (c[2] or {})]
    assert states[-1]["halted"] is True


def test_unknown_command_marked_handled_without_action(db, market):
    cfg, engine = build_engine(db, market)
    session = FakeSession(commands=[{"id": 9, "command": "make_me_rich"}])
    portal_tick(make_portal(session), engine, db, cfg, "PAPER")
    assert not engine.risk.is_halted()
    assert any(c[0] == "PATCH" and "id=eq.9" in c[1] for c in session.calls)


def test_portal_failure_never_breaks_loop(db, market):
    cfg, engine = build_engine(db, market)
    portal_tick(make_portal(FakeSession(fail=True)), engine, db, cfg, "PAPER")  # geen exception
    portal_tick(None, engine, db, cfg, "PAPER")  # portal uit → no-op


def test_emergency_stop_without_prices_still_halts(db, market):
    cfg, engine = build_engine(db, market)
    engine.cycle(NOW)
    market.fail_ticker = True  # API kapot op het moment van de noodstop
    engine.emergency_stop("test-noodstop")
    assert engine.risk.is_halted()  # halt gaat door, ook zonder liquidatie