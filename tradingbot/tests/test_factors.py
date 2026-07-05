"""Multi-factor gedachtegang: prijsfactoren uit candles + externe event-overlay."""

from datetime import datetime, timezone

from autopilot.factors import compute_reads, market_summary
from autopilot.models import Candle

NOW = datetime(2026, 7, 1, tzinfo=timezone.utc)
D = 86_400_000


def ramp(start, step, n=70, start_ts=0):
    closes = [start + step * i for i in range(n)]
    return [Candle(start_ts + i * D, c, c, c, c, 1.0) for i, c in enumerate(closes)]


def test_uptrend_is_bullish_downtrend_bearish():
    candles = {"AAA-EUR": ramp(100, 1), "BBB-EUR": ramp(100, -1)}
    reads = compute_reads(candles, ["AAA-EUR", "BBB-EUR"], NOW)
    assert reads["AAA-EUR"].conviction > 0 and reads["AAA-EUR"].stance == "bullish"
    assert reads["BBB-EUR"].conviction < 0 and reads["BBB-EUR"].stance == "bearish"


def test_only_price_factors_without_events():
    reads = compute_reads({"AAA-EUR": ramp(100, 1)}, ["AAA-EUR"], NOW)
    kinds = {f.kind for f in reads["AAA-EUR"].factors}
    assert kinds == {"price"}  # geen externe factoren zonder events


def test_external_news_event_adds_factor_and_shifts_conviction():
    candles = {"AAA-EUR": ramp(100, 0)}  # vlak → prijsfactoren ~neutraal
    events = [{"pair": "AAA-EUR", "kind": "news", "direction": 1, "confidence": 0.9,
               "rationale": "grote listing aangekondigd"}]
    base = compute_reads(candles, ["AAA-EUR"], NOW)
    withnews = compute_reads(candles, ["AAA-EUR"], NOW, events=events)
    assert any(f.kind == "external" and f.key == "news" for f in withnews["AAA-EUR"].factors)
    assert withnews["AAA-EUR"].conviction > base["AAA-EUR"].conviction


def test_macro_wildcard_applies_to_all_coins():
    candles = {"AAA-EUR": ramp(100, 0), "BBB-EUR": ramp(100, 0)}
    events = [{"pair": "*", "kind": "macro", "direction": -1, "confidence": 0.8,
               "rationale": "renteverhoging"}]
    reads = compute_reads(candles, ["AAA-EUR", "BBB-EUR"], NOW, events=events)
    for pair in ("AAA-EUR", "BBB-EUR"):
        assert any(f.key == "macro" for f in reads[pair].factors)


def test_market_summary_counts_stances():
    candles = {"AAA-EUR": ramp(100, 1), "BBB-EUR": ramp(100, -1)}
    reads = compute_reads(candles, ["AAA-EUR", "BBB-EUR"], NOW)
    mk = market_summary(reads)
    assert mk["n_bullish"] == 1 and mk["n_bearish"] == 1 and mk["n"] == 2
