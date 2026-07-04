"""Allocatie-engine (vol_target): inverse-vol weging, BTC-floor, correlatie-de-risk, herbalanceren."""

from datetime import datetime, timedelta, timezone

import pytest

from autopilot.models import Candle, Position, Side
from autopilot.strategies import get_strategy
from conftest import make_config

NOW = datetime(2026, 7, 1, tzinfo=timezone.utc)
D = 86_400_000


def series(vol, n=40, phase=0, start_ts=0):
    """Deterministische reeks met dag-returns die ±vol alterneren → std ≈ vol."""
    closes = [100.0]
    for i in range(n):
        r = vol if (i + phase) % 2 == 0 else -vol
        closes.append(closes[-1] * (1 + r))
    return [Candle(start_ts + i * D, c, c, c, c, 1.0) for i, c in enumerate(closes)]


def vt_cfg(pairs, **params):
    p = {"lookback_days": 20, "target_vol": 0.03, "btc_min": 0.30,
         "corr_threshold": 0.8, "derisk_cut": 0.5, "band_pct": 0.02, "rebalance_days": 7}
    p.update(params)
    return make_config(pairs=pairs, strategy={"name": "vol_target", "params": p})


def strat_with_equity(cfg, db, equity):
    s = get_strategy(cfg, db)
    s.ctx = {"equity": equity}
    return s


def buys(signals):
    return {s.pair: s.amount_eur for s in signals if s.side == Side.BUY}


def test_inverse_vol_lower_vol_gets_more_weight(db):
    cfg = vt_cfg(["AAA-EUR", "BBB-EUR"], btc_min=0.0)
    s = strat_with_equity(cfg, db, 1000)
    data = {"AAA-EUR": series(0.01), "BBB-EUR": series(0.05)}  # AAA rustiger
    b = buys(s.generate_signals(data, [], NOW))
    assert b["AAA-EUR"] > b["BBB-EUR"]  # rustiger = groter gewicht


def test_btc_floor_enforced(db):
    cfg = vt_cfg(["BTC-EUR", "ALT-EUR"], btc_min=0.40)
    s = strat_with_equity(cfg, db, 1000)
    # BTC volatieler → inverse-vol zou 'm klein maken, maar de floor tilt 'm op
    data = {"BTC-EUR": series(0.05), "ALT-EUR": series(0.01)}
    b = buys(s.generate_signals(data, [], NOW))
    total = sum(b.values())
    assert b["BTC-EUR"] / total == pytest.approx(0.40, abs=0.02)


def test_derisk_cuts_exposure_when_correlated(db):
    data_corr = {"AAA-EUR": series(0.02, phase=0), "BBB-EUR": series(0.02, phase=0)}   # corr ≈ 1
    data_anti = {"AAA-EUR": series(0.02, phase=0), "BBB-EUR": series(0.02, phase=1)}   # corr ≈ -1
    cfg = vt_cfg(["AAA-EUR", "BBB-EUR"], btc_min=0.0)
    tot_corr = sum(buys(strat_with_equity(cfg, db, 1000).generate_signals(data_corr, [], NOW)).values())
    # verse db zodat de rebalance-gate niet blokkeert
    from autopilot.database import Database
    db2 = Database(":memory:")
    tot_anti = sum(buys(strat_with_equity(cfg, db2, 1000).generate_signals(data_anti, [], NOW)).values())
    assert tot_corr < tot_anti  # hoge correlatie → minder totale exposure


def test_rebalance_gate(db):
    cfg = vt_cfg(["AAA-EUR", "BBB-EUR"], btc_min=0.0, rebalance_days=7)
    s = strat_with_equity(cfg, db, 1000)
    data = {"AAA-EUR": series(0.02), "BBB-EUR": series(0.03)}
    assert s.generate_signals(data, [], NOW)
    assert s.generate_signals(data, [], NOW + timedelta(days=3)) == []
    assert s.generate_signals(data, [], NOW + timedelta(days=8))


def test_sells_overweight_and_sells_before_buys(db):
    cfg = vt_cfg(["AAA-EUR", "BBB-EUR"], btc_min=0.0)
    s = strat_with_equity(cfg, db, 1000)
    data = {"AAA-EUR": series(0.02), "BBB-EUR": series(0.02)}
    # sterk overwogen in AAA → moet afbouwen
    price_aaa = data["AAA-EUR"][-1].close
    pos = [Position(pair="AAA-EUR", amount=900 / price_aaa, avg_price=price_aaa, opened_at="2026-01-01")]
    sigs = s.generate_signals(data, pos, NOW)
    assert any(x.pair == "AAA-EUR" and x.side == Side.SELL for x in sigs)
    sides = [x.side for x in sigs]
    assert sides == sorted(sides, key=lambda z: 0 if z == Side.SELL else 1)  # sells eerst
