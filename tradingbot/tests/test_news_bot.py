"""Nieuws-/event-bot: 'hold' basis + research-laag → trades komen alléén van events."""

import json
from datetime import datetime, timezone

from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


def _news_cfg(events_file):
    return make_config(
        strategy={"name": "hold", "params": {}},
        research={"enabled": True, "agent": "rulebased", "min_confidence": 0.6,
                  "max_position_eur": 25, "events_file": events_file},
        risk={"max_position_pct": 25, "stop_loss_pct": 15, "take_profit_pct": 20,
              "max_daily_loss_pct": 15, "max_drawdown_pct": 40})


def _build(db, market, cfg):
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur,
                          taker_fee_pct=cfg.costs.taker_fee_pct, slippage_pct=cfg.costs.slippage_pct)
    eng = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                        TradingMode.PAPER, research_agent=__import__(
                            "autopilot.research", fromlist=["get_research_agent"]).get_research_agent(cfg))
    eng.startup()
    return eng


def test_hold_alone_does_nothing(db, market):
    cfg = make_config(strategy={"name": "hold", "params": {}})
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur,
                          taker_fee_pct=cfg.costs.taker_fee_pct, slippage_pct=cfg.costs.slippage_pct)
    eng = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db), TradingMode.PAPER)
    eng.startup(); eng.cycle(NOW)
    assert [o for o in db.recent_orders() if o["status"] == "FILLED"] == []


def test_news_event_drives_a_trade(db, market, tmp_path):
    ev = tmp_path / "research_events.json"
    ev.write_text(json.dumps([{
        "pair": "BTC-EUR", "kind": "news", "source": "Reuters", "direction": 1,
        "confidence": 0.8, "rationale": "grote ETF-instroom gemeld",
        "expires": "2099-01-01T00:00:00+00:00"}]), encoding="utf-8")
    cfg = _news_cfg(str(ev))
    eng = _build(db, market, cfg)
    eng.cycle(NOW)
    fills = [o for o in db.recent_orders() if o["status"] == "FILLED"]
    assert any(o["pair"] == "BTC-EUR" and o["side"] == "BUY" for o in fills)
    assert any("research" in (o["reason"] or "") for o in fills)
