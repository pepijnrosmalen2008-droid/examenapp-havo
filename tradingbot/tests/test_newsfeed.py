"""Proactieve nieuwsfeed: kop → event-mapping, dedup/fire-once, en trades via de engine."""

from datetime import datetime, timedelta, timezone

from autopilot import newsfeed as nf
from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.research import get_research_agent
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)
ALLOWED = {"BTC", "ETH", "MOODENG"}


def test_bullish_headline_maps_to_buy_event():
    ev = nf.headline_to_event("Bitcoin surges as spot ETF sees record inflows",
                              None, "coindesk.com", ALLOWED, NOW)
    assert ev and ev["pair"] == "BTC-EUR" and ev["direction"] == 1 and ev["confidence"] >= 0.6


def test_bearish_headline_maps_to_sell_event():
    ev = nf.headline_to_event("Ethereum plunges after major exchange hack", None, "x", ALLOWED, NOW)
    assert ev and ev["pair"] == "ETH-EUR" and ev["direction"] == -1


def test_unmapped_or_directionless_headlines_ignored():
    assert nf.headline_to_event("Tim Cook unveils new iPhone", None, "x", ALLOWED, NOW) is None
    assert nf.headline_to_event("Bitcoin trades sideways in quiet session", None, "x", ALLOWED, NOW) is None
    # coin buiten de whitelist → genegeerd
    assert nf.headline_to_event("Cardano rallies on upgrade", None, "x", ALLOWED, NOW) is None


def _cfg(tmp_path):
    return make_config(
        bot_id="news", strategy={"name": "hold", "params": {}},
        research={"enabled": True, "agent": "newsfeed", "min_confidence": 0.6,
                  "max_position_eur": 25, "events_file": str(tmp_path / "manual.json"),
                  "sources": ["http://x"], "fetch_minutes": 10},
        risk={"max_position_pct": 25, "stop_loss_pct": 15, "take_profit_pct": 20,
              "max_daily_loss_pct": 15, "max_drawdown_pct": 40})


def _agent(cfg, headlines):
    from autopilot.newsfeed import NewsFeedResearchAgent
    return NewsFeedResearchAgent(cfg, fetcher=lambda sources, timeout=5.0: headlines)


def test_agent_fires_once_per_headline(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(nf, "auto_path", lambda cfg: tmp_path / f"news_{cfg.bot_id}.json")
    cfg = _cfg(tmp_path)
    heads = [("Bitcoin surges on ETF approval and record inflows", None, "coindesk.com")]
    agent = _agent(cfg, heads)
    first = agent.evaluate(["BTC-EUR", "ETH-EUR"], NOW)
    assert len(first) == 1 and first[0].pair == "BTC-EUR" and first[0].direction == 1
    # tweede evaluatie binnen fetch-venster: dezelfde kop vuurt NIET opnieuw
    again = agent.evaluate(["BTC-EUR", "ETH-EUR"], NOW + timedelta(minutes=1))
    assert again == []
    # maar hij telt nog wel als (nog geldig) event voor de gedachtegang
    assert any(e["pair"] == "BTC-EUR" for e in nf.load_auto_events(cfg, NOW + timedelta(minutes=1)))


def test_news_agent_drives_trade_through_engine(monkeypatch, tmp_path):
    monkeypatch.setattr(nf, "auto_path", lambda cfg: tmp_path / f"news_{cfg.bot_id}.json")
    cfg = _cfg(tmp_path)
    heads = [("Bitcoin rallies as adoption surges to record high", None, "decrypt.co")]
    db = __import__("autopilot.database", fromlist=["Database"]).Database(":memory:")
    market = FakeMarket()
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur,
                          taker_fee_pct=cfg.costs.taker_fee_pct, slippage_pct=cfg.costs.slippage_pct)
    agent = _agent(cfg, heads)
    eng = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                        TradingMode.PAPER, research_agent=agent)
    eng.startup()
    eng.cycle(NOW)
    fills = [o for o in db.recent_orders() if o["status"] == "FILLED"]
    assert any(o["pair"] == "BTC-EUR" and o["side"] == "BUY" for o in fills)
    assert any("nieuws" in (o["reason"] or "") for o in fills)
