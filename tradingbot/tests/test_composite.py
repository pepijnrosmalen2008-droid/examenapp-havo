"""All-in composite research-agent: draait meerdere bronnen tegelijk en voegt voorstellen samen."""

from datetime import datetime, timezone

from autopilot.composite import CompositeResearchAgent
from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.research import get_research_agent
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


def _cfg(**research):
    base = {"enabled": True, "agent": "allin", "min_confidence": 0.6, "max_position_eur": 20,
            "fetch_minutes": 15}
    base.update(research)
    return make_config(bot_id="allin", strategy={"name": "hold", "params": {}}, research=base,
                       pairs=["BTC-EUR", "ETH-EUR"],
                       risk={"max_position_pct": 25, "stop_loss_pct": 15, "take_profit_pct": 25,
                             "max_daily_loss_pct": 15, "max_drawdown_pct": 40})


def test_factory_builds_composite():
    agent = get_research_agent(_cfg(news_sources=["http://x"]))
    assert isinstance(agent, CompositeResearchAgent)


def test_empty_sources_means_no_subagents():
    agent = CompositeResearchAgent(_cfg())
    assert agent._agents == []
    assert agent.evaluate(["BTC-EUR"], NOW) == []     # niets ingesteld → geen voorstellen, geen fouten


def test_composite_merges_news_and_disclosures(monkeypatch, tmp_path):
    from autopilot import newsfeed as nf, disclosures as dc
    monkeypatch.setattr(nf, "auto_path", lambda cfg: tmp_path / f"news_{cfg.bot_id}.json")
    monkeypatch.setattr(dc, "auto_path", lambda cfg: tmp_path / f"disc_{cfg.bot_id}.json")
    cfg = _cfg(news_sources=["http://news"], disclosure_sources=["http://disc"])
    agent = CompositeResearchAgent(cfg)
    # injecteer per sub-agent een eigen fetcher (geen netwerk)
    agent._agents[0]._fetcher = lambda sources, timeout=5.0: [
        ("Bitcoin surges as ETF inflows hit record high", None, "coindesk.com")]
    agent._agents[1]._fetcher = lambda sources, timeout=8.0: [
        {"representative": "Nancy Pelosi", "ticker": "IBIT", "type": "Purchase",
         "transaction_date": "2026-06-01", "disclosure_date": "2026-06-20", "amount": "$1,000,001 -"}]
    sigs = agent.evaluate(["BTC-EUR", "ETH-EUR"], NOW)
    # beide bronnen leveren een BTC-koopvoorstel → minstens twee signalen, beide BTC bullish
    assert len(sigs) >= 2 and all(s.pair == "BTC-EUR" and s.direction == 1 for s in sigs)


def test_one_dead_subagent_does_not_break_the_rest(monkeypatch, tmp_path):
    from autopilot import newsfeed as nf, disclosures as dc
    monkeypatch.setattr(nf, "auto_path", lambda cfg: tmp_path / f"news_{cfg.bot_id}.json")
    monkeypatch.setattr(dc, "auto_path", lambda cfg: tmp_path / f"disc_{cfg.bot_id}.json")
    cfg = _cfg(news_sources=["http://news"], disclosure_sources=["http://disc"])
    agent = CompositeResearchAgent(cfg)
    def boom(*a, **k):
        raise RuntimeError("feed down")
    agent._agents[0]._fetcher = boom       # nieuws valt om
    agent._agents[1]._fetcher = lambda sources, timeout=8.0: [
        {"representative": "X", "ticker": "IBIT", "type": "Purchase",
         "transaction_date": "2026-06-01", "disclosure_date": "2026-06-20", "amount": "$500,001 -"}]
    sigs = agent.evaluate(["BTC-EUR"], NOW)      # mag niet crashen; politici-voorstel komt door
    assert any(s.pair == "BTC-EUR" for s in sigs)
