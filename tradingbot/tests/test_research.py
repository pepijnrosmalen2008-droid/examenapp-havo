"""Research-laag: gestructureerde voorstellen, gating op zekerheid, en het feit dat
voorstellen ALTIJD door de risk engine gaan (nooit rechtstreeks een order)."""

import json
from datetime import datetime, timezone

import pytest

from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.models import Side
from autopilot.research import (ResearchSignal, RuleBasedResearchAgent,
                                get_research_agent, to_trade_signals)
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


_RESEARCH_KEYS = {"enabled", "agent", "min_confidence", "max_position_eur", "events_file"}


def rcfg(tmp_path, **kw):
    research = {"enabled": True, "agent": "rulebased", "min_confidence": 0.6,
                "max_position_eur": 25, "events_file": str(tmp_path / "events.json")}
    top = {}
    for k, v in kw.items():
        (research if k in _RESEARCH_KEYS else top)[k] = v
    return make_config(research=research, **top)


def write_events(tmp_path, events):
    (tmp_path / "events.json").write_text(json.dumps(events), encoding="utf-8")


# ── ResearchSignal validatie ─────────────────────────────────────────

def test_research_signal_validates():
    ResearchSignal(pair="BTC-EUR", direction=1, confidence=0.7, horizon_hours=24, rationale="x")
    with pytest.raises(ValueError):
        ResearchSignal(pair="BTC-EUR", direction=2, confidence=0.7, horizon_hours=24, rationale="x")
    with pytest.raises(ValueError):
        ResearchSignal(pair="BTC-EUR", direction=1, confidence=1.5, horizon_hours=24, rationale="x")


# ── rule-based agent ─────────────────────────────────────────────────

def test_reads_events_for_allowed_pairs(tmp_path):
    write_events(tmp_path, [
        {"pair": "BTC-EUR", "direction": 1, "confidence": 0.8, "horizon_hours": 24, "rationale": "ETF"},
        {"pair": "XRP-EUR", "direction": 1, "confidence": 0.9, "horizon_hours": 24, "rationale": "buiten whitelist"},
    ])
    agent = RuleBasedResearchAgent(rcfg(tmp_path))
    props = agent.evaluate(["BTC-EUR", "ETH-EUR"], NOW)
    assert len(props) == 1 and props[0].pair == "BTC-EUR"


def test_expired_events_ignored(tmp_path):
    write_events(tmp_path, [
        {"pair": "BTC-EUR", "direction": 1, "confidence": 0.8, "horizon_hours": 24,
         "rationale": "oud", "expires": "2026-06-01T00:00:00+00:00"},
    ])
    agent = RuleBasedResearchAgent(rcfg(tmp_path))
    assert agent.evaluate(["BTC-EUR"], NOW) == []


def test_missing_file_is_no_crash(tmp_path):
    agent = RuleBasedResearchAgent(rcfg(tmp_path))  # bestand bestaat niet
    assert agent.evaluate(["BTC-EUR"], NOW) == []


def test_malformed_event_skipped_not_fatal(tmp_path):
    write_events(tmp_path, [
        {"pair": "BTC-EUR", "direction": 1},  # mist confidence
        {"pair": "ETH-EUR", "direction": -1, "confidence": 0.7, "horizon_hours": 12, "rationale": "ok"},
    ])
    props = RuleBasedResearchAgent(rcfg(tmp_path)).evaluate(["BTC-EUR", "ETH-EUR"], NOW)
    assert len(props) == 1 and props[0].pair == "ETH-EUR"


# ── gating naar handels-signalen ─────────────────────────────────────

def test_gating_on_confidence(tmp_path):
    cfg = rcfg(tmp_path, min_confidence=0.6)
    props = [
        ResearchSignal("BTC-EUR", 1, 0.9, 24, "sterk"),
        ResearchSignal("ETH-EUR", 1, 0.4, 24, "te zwak"),
        ResearchSignal("BTC-EUR", 0, 0.9, 24, "neutraal"),
    ]
    sigs = to_trade_signals(props, cfg)
    assert len(sigs) == 1 and sigs[0].pair == "BTC-EUR" and sigs[0].side == Side.BUY
    assert sigs[0].amount_eur == 25 and sigs[0].strategy == "research"


def test_bearish_becomes_sell(tmp_path):
    sigs = to_trade_signals([ResearchSignal("BTC-EUR", -1, 0.8, 24, "negatief")], rcfg(tmp_path))
    assert len(sigs) == 1 and sigs[0].side == Side.SELL


def test_get_agent_disabled_returns_none():
    assert get_research_agent(make_config()) is None  # research uit


# ── integratie: voorstel gaat door de risk engine, niet eromheen ─────

def test_research_buy_passes_through_risk_engine(tmp_path):
    write_events(tmp_path, [
        {"pair": "BTC-EUR", "direction": 1, "confidence": 0.85, "horizon_hours": 24, "rationale": "test"},
    ])
    cfg = rcfg(tmp_path, strategy={"name": "dca", "params": {"amount_eur": 10, "every_hours": 999}})
    db_market = FakeMarket()
    from autopilot.database import Database
    db = Database(":memory:")
    paper = PaperExchange(db, db_market, capital_eur=cfg.capital_eur)
    engine = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                           TradingMode.PAPER, research_agent=get_research_agent(cfg))
    engine.startup()
    engine.cycle(NOW)

    fills = [o for o in db.recent_orders() if o["status"] == "FILLED" and o["strategy"] == "research"]
    assert len(fills) == 1 and fills[0]["pair"] == "BTC-EUR"
    # de order is via de risk engine gegaan (gelogde beslissing bestaat)
    dec = db.conn.execute("SELECT COUNT(*) c FROM risk_decisions WHERE side='BUY' AND allowed=1").fetchone()
    assert dec["c"] >= 1
    db.close()


def test_research_buy_still_blocked_by_kill_switch(tmp_path):
    write_events(tmp_path, [
        {"pair": "BTC-EUR", "direction": 1, "confidence": 0.95, "horizon_hours": 24, "rationale": "test"},
    ])
    cfg = rcfg(tmp_path, strategy={"name": "dca", "params": {"amount_eur": 10, "every_hours": 999}})
    from autopilot.database import Database
    db = Database(":memory:")
    paper = PaperExchange(db, FakeMarket(), capital_eur=cfg.capital_eur)
    risk = RiskEngine(cfg, db)
    engine = TradingEngine(cfg, db, paper, risk, get_strategy(cfg, db),
                           TradingMode.PAPER, research_agent=get_research_agent(cfg))
    engine.startup()
    risk.trigger_halt("test: bot gestopt")  # kill switch aan
    engine.cycle(NOW)

    fills = [o for o in db.recent_orders() if o["status"] == "FILLED"]
    assert fills == []  # research-voorstel wordt óók door de halt geblokkeerd
    db.close()
