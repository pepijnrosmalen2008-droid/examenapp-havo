"""Execution-laag: maker/taker-keuze + maker-fill-model (fee-besparing, geen slippage).

Kern: passief posten (maker) is geen alpha maar kostenreductie. Urgente exits blijven taker.
"""

from datetime import datetime, timedelta, timezone

import pytest

from autopilot import execution as ex
from autopilot.config import TradingMode
from autopilot.engine import TradingEngine
from autopilot.exchange import PaperExchange
from autopilot.models import Side
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy
from conftest import FakeMarket, make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)


# ── keuze-logica ───────────────────────────────────────────────────

def test_default_mode_is_always_taker():
    cfg = make_config()  # execution.mode default 'taker'
    assert ex.choose_style("dca-koop", cfg) == "taker"
    assert ex.choose_style("stop-loss geraakt", cfg) == "taker"


def test_maker_first_posts_passively_for_non_urgent():
    cfg = make_config(execution={"mode": "maker_first"})
    assert ex.choose_style("dca-koop", cfg) == "maker"
    assert ex.choose_style("rotatie: SOL sterker", cfg) == "maker"


def test_urgent_exits_stay_taker_even_in_maker_first():
    cfg = make_config(execution={"mode": "maker_first"})
    for reason in ["stop-loss 5%", "take-profit bereikt", "kill-switch liquidatie: max drawdown",
                   "circuit breaker: spread te wijd", "NOODSTOP", "halt"]:
        assert ex.choose_style(reason, cfg) == "taker", reason


def test_fee_saving_is_taker_minus_maker():
    cfg = make_config(costs={"taker_fee_pct": 0.25, "maker_fee_pct": 0.15})
    assert ex.fee_saving_pct(cfg) == pytest.approx(0.10)


# ── PaperExchange maker-fill ───────────────────────────────────────

def test_maker_buy_pays_less_fee_and_no_slippage(db):
    market = FakeMarket({"BTC-EUR": 50_000.0})
    px = PaperExchange(db, market, capital_eur=100.0, taker_fee_pct=0.25,
                       maker_fee_pct=0.15, slippage_pct=0.1)
    taker = px.place_market_order("BTC-EUR", Side.BUY, amount_eur=50.0,
                                  client_order_id="t1", style="taker")
    db.set_paper_balance("EUR", 100.0)  # reset saldo voor een eerlijke vergelijking
    maker = px.place_market_order("BTC-EUR", Side.BUY, amount_eur=50.0,
                                  client_order_id="m1", style="maker")
    # maker: lagere fee én betere fill-prijs (geen slippage) → meer asset voor dezelfde €50
    assert maker["fee_eur"] < taker["fee_eur"]
    assert maker["price"] < taker["price"]        # taker betaalt +slippage
    assert maker["amount"] > taker["amount"]
    assert maker["style"] == "maker"


def test_maker_sell_receives_more(db):
    market = FakeMarket({"BTC-EUR": 50_000.0})
    px = PaperExchange(db, market, capital_eur=0.0, taker_fee_pct=0.25,
                       maker_fee_pct=0.15, slippage_pct=0.1)
    db.set_paper_balance("BTC", 0.01)
    maker = px.place_market_order("BTC-EUR", Side.SELL, amount_asset=0.005,
                                  client_order_id="m1", style="maker")
    taker = px.place_market_order("BTC-EUR", Side.SELL, amount_asset=0.005,
                                  client_order_id="t1", style="taker")
    # maker verkoopt op een hogere (niet-gekruiste) prijs met lagere fee → meer EUR per stuk
    assert maker["cost"] > taker["cost"]


# ── end-to-end via de engine ───────────────────────────────────────

def _engine(db, market, cfg):
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur,
                          taker_fee_pct=cfg.costs.taker_fee_pct,
                          maker_fee_pct=cfg.costs.maker_fee_pct,
                          slippage_pct=cfg.costs.slippage_pct)
    eng = TradingEngine(cfg, db, paper, RiskEngine(cfg, db), get_strategy(cfg, db),
                        TradingMode.PAPER)
    eng.startup()
    return eng


def test_engine_maker_first_records_maker_style_on_entries(db, market):
    cfg = make_config(execution={"mode": "maker_first"})
    _engine(db, market, cfg).cycle(NOW)
    fills = [o for o in db.recent_orders() if o["status"] == "FILLED"]
    assert fills and all(o["side"] == "BUY" for o in fills)
    # de DCA-koop is niet urgent → maker; fee is de maker-fee (0.15%), niet taker (0.25%)
    btc = next(o for o in fills if o["pair"] == "BTC-EUR")
    assert btc["fee_eur"] == pytest.approx((btc["amount_eur"] or 0) * 0.0015, rel=1e-3)


def test_engine_default_taker_unchanged(db, market):
    cfg = make_config()  # taker
    _engine(db, market, cfg).cycle(NOW)
    fills = [o for o in db.recent_orders() if o["status"] == "FILLED"]
    btc = next(o for o in fills if o["pair"] == "BTC-EUR")
    assert btc["fee_eur"] == pytest.approx((btc["amount_eur"] or 0) * 0.0025, rel=1e-3)
