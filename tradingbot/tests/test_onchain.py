"""On-chain money-flow-probe: flow → event-mapping, dedup/fire-once, trade via de engine.

Geen enkele test raakt het netwerk (de fetcher wordt geïnjecteerd)."""

from datetime import datetime, timedelta, timezone

from autopilot import onchain as oc
from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)
ALLOWED = {"BTC", "ETH"}


def _rec(**kw):
    base = {"label": "Whale 0xabc", "symbol": "BTC", "flow": "to_exchange",
            "amount_usd": 25_000_000, "timestamp": "2026-07-01T09:00:00"}
    base.update(kw)
    return base


def test_deposit_is_bearish():
    ev = oc.flow_to_event(_rec(flow="to_exchange"), ALLOWED, NOW)
    assert ev and ev["pair"] == "BTC-EUR" and ev["direction"] == -1
    assert ev["kind"] == "smart_money" and ev["entity"] == "Whale 0xabc"


def test_withdrawal_is_bullish():
    ev = oc.flow_to_event(_rec(flow="from_exchange", symbol="ETH"), ALLOWED, NOW)
    assert ev and ev["pair"] == "ETH-EUR" and ev["direction"] == 1


def test_direction_inferred_from_owner_types():
    ev = oc.flow_to_event(_rec(flow="", from_owner_type="unknown", to_owner_type="exchange"),
                          ALLOWED, NOW)
    assert ev and ev["direction"] == -1          # naar de beurs → verkoopdruk


def test_small_flows_are_noise():
    assert oc.flow_to_event(_rec(amount_usd=50_000), ALLOWED, NOW) is None


def test_unknown_asset_or_directionless_ignored():
    assert oc.flow_to_event(_rec(symbol="DOGE"), ALLOWED, NOW) is None
    assert oc.flow_to_event(_rec(flow="internal", from_owner_type="x", to_owner_type="y"),
                            ALLOWED, NOW) is None


def test_bigger_flow_more_confidence():
    small = oc.flow_to_event(_rec(amount_usd=1_000_000), ALLOWED, NOW)
    big = oc.flow_to_event(_rec(amount_usd=100_000_000), ALLOWED, NOW)
    assert big["confidence"] > small["confidence"]


def _cfg(tmp_path):
    return make_config(
        bot_id="onchain", strategy={"name": "hold", "params": {}},
        research={"enabled": True, "agent": "onchain", "min_confidence": 0.6,
                  "max_position_eur": 20, "events_file": str(tmp_path / "manual.json"),
                  "sources": ["http://x"], "fetch_minutes": 15},
        risk={"max_position_pct": 25, "stop_loss_pct": 12, "take_profit_pct": 18,
              "max_daily_loss_pct": 15, "max_drawdown_pct": 40})


def _agent(cfg, records):
    return oc.OnChainResearchAgent(cfg, fetcher=lambda sources, timeout=8.0: records)


def test_agent_fires_once_per_flow(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(oc, "auto_path", lambda cfg: tmp_path / f"oc_{cfg.bot_id}.json")
    cfg = _cfg(tmp_path)
    # withdrawal → bullish → een koop-voorstel dat de engine kan uitvoeren
    agent = _agent(cfg, [_rec(flow="from_exchange", symbol="BTC")])
    first = agent.evaluate(["BTC-EUR", "ETH-EUR"], NOW)
    assert len(first) == 1 and first[0].pair == "BTC-EUR" and first[0].direction == 1
    again = agent.evaluate(["BTC-EUR", "ETH-EUR"], NOW + timedelta(minutes=1))
    assert again == []
    assert any(e["pair"] == "BTC-EUR" for e in oc.load_auto_events(cfg, NOW + timedelta(minutes=1)))


def test_onchain_agent_drives_trade_through_engine(monkeypatch, tmp_path):
    monkeypatch.setattr(oc, "auto_path", lambda cfg: tmp_path / f"oc_{cfg.bot_id}.json")
    cfg = _cfg(tmp_path)
    db = __import__("autopilot.database", fromlist=["Database"]).Database(":memory:")
    market = FakeMarket()
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur,
                          taker_fee_pct=cfg.costs.taker_fee_pct,
                          maker_fee_pct=cfg.costs.maker_fee_pct, slippage_pct=cfg.costs.slippage_pct)
    agent = _agent(cfg, [_rec(flow="from_exchange", symbol="BTC", amount_usd=50_000_000)])
    eng = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                        TradingMode.PAPER, research_agent=agent)
    eng.startup()
    eng.cycle(NOW)
    fills = [o for o in db.recent_orders() if o["status"] == "FILLED"]
    assert any(o["pair"] == "BTC-EUR" and o["side"] == "BUY" for o in fills)
    assert any("on-chain" in (o["reason"] or "") for o in fills)
