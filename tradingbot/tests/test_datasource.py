"""Databron-kwaliteit: meten van gratis bronnen + de vertrouwen-poort (trades of alleen informeren)."""

from autopilot import datasource as ds


def test_measure_counts_items_and_latency():
    p = ds.measure("feed-a", lambda: [1, 2, 3])
    assert p.ok and p.items == 3 and p.latency_ms is not None and p.latency_ms >= 0


def test_measure_catches_a_dead_source():
    def boom():
        raise ConnectionError("timeout")
    p = ds.measure("dode-feed", boom)
    assert p.ok is False and p.items == 0 and "timeout" in (p.note or "")


def test_record_and_stats_roundtrip(db):
    ds.record(db, ds.measure("feed-a", lambda: [1, 2]))
    ds.record(db, ds.measure("feed-a", lambda: [1, 2, 3]))
    stats = db.datasource_stats()
    assert stats["feed-a"]["n"] == 2 and stats["feed-a"]["ok_ratio"] == 1.0
    assert stats["feed-a"]["avg_items"] >= 2


def test_gate_needs_enough_samples():
    thr = ds.Thresholds(min_samples=10)
    ok, reason = ds.is_trustworthy({"n": 3, "ok_ratio": 1.0, "avg_latency_ms": 100,
                                    "avg_items": 5, "last_ok_age_s": 10}, thr)
    assert ok is False and "te weinig" in reason


def test_gate_rejects_flaky_slow_or_stale_sources():
    base = {"n": 50, "ok_ratio": 1.0, "avg_latency_ms": 100, "avg_items": 5, "last_ok_age_s": 10}
    assert ds.is_trustworthy({**base, "ok_ratio": 0.5})[0] is False        # te vaak stuk
    assert ds.is_trustworthy({**base, "avg_latency_ms": 9999})[0] is False  # te traag
    assert ds.is_trustworthy({**base, "last_ok_age_s": 99999})[0] is False  # te oud
    assert ds.is_trustworthy({**base, "avg_items": 0})[0] is False          # geen records


def test_gate_accepts_a_healthy_source():
    ok, reason = ds.is_trustworthy({"n": 50, "ok_ratio": 0.95, "avg_latency_ms": 300,
                                    "avg_items": 8, "last_ok_age_s": 120})
    assert ok is True


def test_report_sorts_trustworthy_first(db):
    for _ in range(12):
        ds.record(db, ds.measure("goede-feed", lambda: [1, 2, 3]))
    ds.record(db, ds.measure("nieuwe-feed", lambda: [1]))   # te weinig metingen → onbetrouwbaar
    rep = ds.report(db)
    assert rep[0]["source"] == "goede-feed" and rep[0]["trustworthy"] is True
    assert any(not r["trustworthy"] for r in rep)
