"""Politici-transactie-probe: gemelde trade → event-mapping, dedup/fire-once, en trades via de engine.

Geen enkele test raakt het netwerk (de fetcher wordt geïnjecteerd)."""

from datetime import datetime, timedelta, timezone

from autopilot import disclosures as dc
from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)
ALLOWED = {"BTC", "ETH"}


def _rec(**kw):
    base = {"representative": "Nancy Pelosi", "ticker": "IBIT", "type": "Purchase",
            "transaction_date": "2026-06-01", "disclosure_date": "2026-06-20",
            "amount": "$50,001 - $100,000"}
    base.update(kw)
    return base


def test_bitcoin_etf_purchase_maps_to_bullish_btc_event():
    ev = dc.disclosure_to_event(_rec(), ALLOWED, NOW)
    assert ev and ev["pair"] == "BTC-EUR" and ev["direction"] == 1
    assert ev["kind"] == "smart_money" and ev["entity"] == "Nancy Pelosi"
    assert ev["confidence"] >= 0.6


def test_eth_etf_sale_maps_to_bearish_eth_event():
    ev = dc.disclosure_to_event(_rec(ticker="ETHA", type="Sale (Full)"), ALLOWED, NOW)
    assert ev and ev["pair"] == "ETH-EUR" and ev["direction"] == -1


def test_proxy_equity_maps_to_btc():
    ev = dc.disclosure_to_event(_rec(ticker="COIN", type="Purchase"), ALLOWED, NOW)
    assert ev and ev["pair"] == "BTC-EUR" and ev["direction"] == 1


def test_non_crypto_ticker_is_ignored():
    # een gewoon aandeel kunnen we niet op Bitvavo verhandelen → geen event
    assert dc.disclosure_to_event(_rec(ticker="NVDA"), ALLOWED, NOW) is None
    assert dc.disclosure_to_event(_rec(ticker="TSLA", type="Purchase"), ALLOWED, NOW) is None


def test_exchange_type_is_ambiguous_and_ignored():
    assert dc.disclosure_to_event(_rec(type="Exchange"), ALLOWED, NOW) is None


def test_coin_outside_whitelist_ignored():
    # ETH-melding terwijl de bot alleen BTC volgt → genegeerd
    assert dc.disclosure_to_event(_rec(ticker="ETHA"), {"BTC"}, NOW) is None


def test_larger_amount_gives_more_confidence():
    small = dc.disclosure_to_event(_rec(amount="$1,001 - $15,000"), ALLOWED, NOW)
    big = dc.disclosure_to_event(_rec(amount="$1,000,001 - $5,000,000"), ALLOWED, NOW)
    assert big["confidence"] > small["confidence"]
    assert big["magnitude"] > small["magnitude"]


def _cfg(tmp_path):
    return make_config(
        bot_id="politici", strategy={"name": "hold", "params": {}},
        research={"enabled": True, "agent": "disclosures", "min_confidence": 0.6,
                  "max_position_eur": 20, "events_file": str(tmp_path / "manual.json"),
                  "sources": ["http://x"], "fetch_minutes": 720},
        risk={"max_position_pct": 25, "stop_loss_pct": 15, "take_profit_pct": 25,
              "max_daily_loss_pct": 15, "max_drawdown_pct": 40})


def _agent(cfg, records):
    return dc.DisclosureResearchAgent(cfg, fetcher=lambda sources, timeout=8.0: records)


def test_agent_fires_once_per_disclosure(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(dc, "auto_path", lambda cfg: tmp_path / f"disc_{cfg.bot_id}.json")
    cfg = _cfg(tmp_path)
    agent = _agent(cfg, [_rec()])
    first = agent.evaluate(["BTC-EUR", "ETH-EUR"], NOW)
    assert len(first) == 1 and first[0].pair == "BTC-EUR" and first[0].direction == 1
    # tweede evaluatie binnen fetch-venster: dezelfde melding vuurt NIET opnieuw
    again = agent.evaluate(["BTC-EUR", "ETH-EUR"], NOW + timedelta(minutes=1))
    assert again == []
    # maar hij telt nog wel als (nog geldig) event voor de gedachtegang
    assert any(e["pair"] == "BTC-EUR" for e in dc.load_auto_events(cfg, NOW + timedelta(minutes=1)))


def test_disclosure_agent_drives_trade_through_engine(monkeypatch, tmp_path):
    monkeypatch.setattr(dc, "auto_path", lambda cfg: tmp_path / f"disc_{cfg.bot_id}.json")
    cfg = _cfg(tmp_path)
    db = __import__("autopilot.database", fromlist=["Database"]).Database(":memory:")
    market = FakeMarket()
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur,
                          taker_fee_pct=cfg.costs.taker_fee_pct, slippage_pct=cfg.costs.slippage_pct)
    agent = _agent(cfg, [_rec(ticker="IBIT", type="Purchase")])
    eng = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                        TradingMode.PAPER, research_agent=agent)
    eng.startup()
    eng.cycle(NOW)
    fills = [o for o in db.recent_orders() if o["status"] == "FILLED"]
    assert any(o["pair"] == "BTC-EUR" and o["side"] == "BUY" for o in fills)
    assert any("politicus" in (o["reason"] or "") for o in fills)
