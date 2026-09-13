"""Databron-kwaliteit — gratis data is niet automatisch betrouwbare data.

De aandelenbot (en de bestaande crypto-probes) leunen op gratis bronnen: nieuws-RSS, on-chain feeds,
politici-datasets, prijs- en fundamentals-endpoints. Voordat zo'n bron een trade mag aandrijven,
moet hij zich bewijzen op latency, dekking, verse-heid en betrouwbaarheid. Anders besparen we wat
geld aan data en bouwen we een bot op rotzooi.

Deze module doet twee dingen, bewust klein en meetbaar:
  1. `measure(name, fetch_fn)` — meet één ophaal-poging (latency, succes, #records) en levert een
     `SourceProbe`; `record(db, probe)` schrijft hem weg.
  2. `is_trustworthy(stats, thresholds)` — een zuivere poort: mag deze bron trades aandrijven, of
     alleen informeren? Gebaseerd op gemeten ok-ratio, latency en versheid — niet op een belofte.

De poort is opzettelijk conservatief: bij twijfel → alleen informeren (factor-overlay), niet handelen.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass

log = logging.getLogger("autopilot.datasource")


@dataclass(frozen=True)
class Thresholds:
    min_ok_ratio: float = 0.8         # ≥80% van de pogingen moet slagen
    max_latency_ms: float = 4000.0    # trager dan dit = onbruikbaar voor tijdige signalen
    max_staleness_s: float = 3600.0   # langer dan dit geen verse data = niet vertrouwen
    min_samples: int = 10             # onder dit aantal metingen: nog geen oordeel


@dataclass(frozen=True)
class SourceProbe:
    source: str
    ok: bool
    latency_ms: float | None
    items: int
    note: str | None = None


def measure(name: str, fetch_fn) -> SourceProbe:
    """Voer fetch_fn() uit, meet latency en tel de records. Fouten → ok=False (breekt nooit)."""
    t0 = time.monotonic()
    try:
        result = fetch_fn()
        latency = (time.monotonic() - t0) * 1000
        items = len(result) if hasattr(result, "__len__") else (1 if result else 0)
        return SourceProbe(name, True, latency, items)
    except Exception as e:  # noqa: BLE001 — een dode bron is een meting, geen crash
        latency = (time.monotonic() - t0) * 1000
        return SourceProbe(name, False, latency, 0, note=str(e)[:200])


def record(db, probe: SourceProbe) -> None:
    db.log_datasource(source=probe.source, ok=probe.ok, latency_ms=probe.latency_ms,
                      items=probe.items, note=probe.note)


def is_trustworthy(stats: dict, thr: Thresholds = Thresholds()) -> tuple[bool, str]:
    """Mag een bron met deze gemeten statistiek trades aandrijven? (bool, reden).

    stats = één regel uit db.datasource_stats(): {n, ok_ratio, avg_latency_ms, avg_items, last_ok_age_s}.
    """
    n = stats.get("n", 0)
    if n < thr.min_samples:
        return False, f"te weinig metingen ({n} < {thr.min_samples}) — nog geen oordeel"
    ok_ratio = stats.get("ok_ratio") or 0.0
    if ok_ratio < thr.min_ok_ratio:
        return False, f"ok-ratio {ok_ratio:.0%} < {thr.min_ok_ratio:.0%}"
    lat = stats.get("avg_latency_ms")
    if lat is not None and lat > thr.max_latency_ms:
        return False, f"latency {lat:.0f}ms > {thr.max_latency_ms:.0f}ms"
    age = stats.get("last_ok_age_s")
    if age is not None and age > thr.max_staleness_s:
        return False, f"laatste verse data {age / 60:.0f} min geleden > {thr.max_staleness_s / 60:.0f} min"
    if (stats.get("avg_items") or 0) <= 0:
        return False, "levert geen bruikbare records"
    return True, "betrouwbaar (ok-ratio, latency en versheid binnen norm)"


def report(db, thr: Thresholds = Thresholds()) -> list[dict]:
    """Per bron een regel met de gemeten statistiek + het vertrouwen-oordeel (voor status.py)."""
    out = []
    for src, s in db.datasource_stats().items():
        trust, reason = is_trustworthy(s, thr)
        out.append({"source": src, **s, "trustworthy": trust, "reason": reason})
    out.sort(key=lambda r: (not r["trustworthy"], r["source"]))
    return out
