"""Nieuwsfeed — de bot zoekt zélf proactief naar nieuws dat rendement kan opleveren.

Haalt publieke crypto-nieuwskoppen op (RSS) en zet ze **deterministisch** om naar
gestructureerde events: welke coin, welke richting, hoe zeker. Bewust GEEN LLM en GEEN
social-media-scraping — alleen koppen van nieuwsbronnen, met een transparante
trefwoord/entiteit-mapping die je kunt inzien en controleren.

Cruciaal: de ruwheid van die kop→richting-vertaling is geen probleem, want elk event
gaat door dezelfde forward-only, kosten-nette, FDR- en regime-bewaakte leerlus. Blijkt de
nieuws-richting niets voorspellen, dan toont het track record dat vanzelf (status
'onbewezen', geen gewicht). De bot handelt dus proactief op nieuws, maar de machine
beslist of dat nieuws ooit iets waard was.

Elke gevonden kop wordt:
  1. gekoppeld aan een coin uit de whitelist (anders genegeerd);
  2. van een richting voorzien (bullish/bearish trefwoorden) — geen richting = geen event;
  3. één keer als trade-VOORSTEL afgevuurd (daarna blijft hij als factor meetellen);
  4. altijd langs de confidence-poort én de risk engine (kan nooit zelf een order plaatsen).
"""

from __future__ import annotations

import hashlib
import json
import logging
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

from .config import AppConfig
from .research import ResearchAgent, ResearchSignal

log = logging.getLogger("autopilot.newsfeed")

EVENT_TTL_HOURS = 48        # hoe lang een kop als factor blijft meetellen
MAX_STORED = 400            # cap op het lokale bestand

# coin-herkenning: term → base-ticker. Alleen coins in de bot-whitelist tellen mee.
COIN_TERMS: dict[str, str] = {
    "bitcoin": "BTC", "btc": "BTC",
    "ethereum": "ETH", "ether": "ETH", "eth": "ETH",
    "solana": "SOL", "sol": "SOL",
    "dogecoin": "DOGE", "doge": "DOGE",
    "moodeng": "MOODENG",
    "ripple": "XRP", "xrp": "XRP",
    "cardano": "ADA", "ada": "ADA",
    "bitcoin cash": "BCH", "bch": "BCH",
    "chainlink": "LINK", "link": "LINK",
    "avalanche": "AVAX", "avax": "AVAX",
    "polkadot": "DOT",
}

BULLISH = {"surge", "surges", "soar", "soars", "rally", "rallies", "approval", "approved",
           "adopts", "adoption", "bullish", "record", "all-time high", "ath", "partnership",
           "integrates", "integration", "upgrade", "inflow", "inflows", "buys", "accumulate",
           "accumulation", "green", "jumps", "spikes", "breakout", "launch", "listing"}
BEARISH = {"hack", "hacked", "exploit", "lawsuit", "sues", "sued", "ban", "banned", "crash",
           "plunge", "plunges", "sell-off", "selloff", "bearish", "outflow", "outflows",
           "liquidation", "liquidations", "dump", "fraud", "delist", "delisted", "halt",
           "halts", "warning", "probe", "charges", "scam", "collapse", "drops", "slump"}


# ── ophalen (injecteerbaar zodat tests niet het netwerk raken) ─────────────────

def fetch_headlines(sources: list[str], timeout: float = 5.0) -> list[tuple[str, str | None, str]]:
    """Haal (titel, gepubliceerd-op, bron) op uit RSS/Atom. Fouten → stil overslaan."""
    import requests
    out: list[tuple[str, str | None, str]] = []
    for url in sources:
        try:
            r = requests.get(url, timeout=timeout,
                             headers={"User-Agent": "Mozilla/5.0 (SlagioBot; nieuws-probe)"})
            r.raise_for_status()
            out.extend(_parse_feed(r.content, url))
        except Exception as e:  # noqa: BLE001 — een dode feed mag de cycle niet breken
            log.warning("newsfeed: bron %s niet bereikbaar: %s", url, e)
    return out


def _parse_feed(xml_bytes: bytes, source: str) -> list[tuple[str, str | None, str]]:
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return []
    host = re.sub(r"^https?://(www\.)?", "", source).split("/")[0]
    items: list[tuple[str, str | None, str]] = []
    for el in root.iter():
        tag = el.tag.split("}")[-1]
        if tag not in ("item", "entry"):
            continue
        title = pub = None
        for ch in el:
            t = ch.tag.split("}")[-1]
            if t == "title":
                title = (ch.text or "").strip()
            elif t in ("pubDate", "published", "updated") and pub is None:
                pub = (ch.text or "").strip()
        if title:
            items.append((title, pub, host))
    return items


# ── kop → event (deterministisch, inspecteerbaar) ──────────────────────────────

def _word(hay: str, term: str) -> bool:
    return re.search(r"\b" + re.escape(term) + r"\b", hay) is not None


def headline_to_event(title: str, published: str | None, source: str,
                      allowed_bases: set[str], now: datetime) -> dict | None:
    low = title.lower()
    base = None
    for term, tick in COIN_TERMS.items():
        if tick in allowed_bases and _word(low, term):
            base = tick
            break
    if base is None:
        return None
    nb = sum(1 for w in BULLISH if _word(low, w))
    nbe = sum(1 for w in BEARISH if _word(low, w))
    if nb == nbe:
        return None                          # geen duidelijke richting → geen event
    direction = 1 if nb > nbe else -1
    strength = min(0.9, 0.45 + 0.15 * abs(nb - nbe))
    h = hashlib.sha256(f"{base}|{title}".encode()).hexdigest()[:16]
    return {
        "hash": h, "pair": f"{base}-EUR", "kind": "news", "direction": direction,
        "confidence": round(strength, 2), "magnitude": min(1.0, 0.4 + 0.2 * abs(nb - nbe)),
        "source": source, "n_sources": 1, "published": published,
        "rationale": title[:180],
        "expires": (now + timedelta(hours=EVENT_TTL_HOURS)).isoformat(timespec="seconds"),
        "fired": False,
    }


# ── persistente auto-events (gedeeld met de factor-overlay) ─────────────────────

def auto_path(cfg: AppConfig) -> Path:
    return Path(__file__).resolve().parent.parent / f"news_auto_{cfg.bot_id}.json"


def _load(cfg: AppConfig) -> dict:
    p = auto_path(cfg)
    if not p.exists():
        return {"fetched_at": None, "events": []}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {"fetched_at": None, "events": []}


def _save(cfg: AppConfig, data: dict) -> None:
    try:
        auto_path(cfg).write_text(json.dumps(data, indent=1), encoding="utf-8")
    except OSError as e:  # noqa: BLE001
        log.warning("newsfeed: kon auto-events niet opslaan: %s", e)


def _fresh(events: list[dict], now: datetime) -> list[dict]:
    out = []
    for ev in events:
        exp = ev.get("expires")
        try:
            if exp and now >= datetime.fromisoformat(exp):
                continue
        except (ValueError, TypeError):
            pass
        out.append(ev)
    return out


def load_auto_events(cfg: AppConfig, now: datetime) -> list[dict]:
    """Voor de factor-overlay (factors.py): de nog geldige auto-events als gewone events."""
    return _fresh(_load(cfg).get("events", []), now)


def refresh(cfg: AppConfig, allowed_bases: set[str], now: datetime,
            fetcher=fetch_headlines) -> dict:
    """Haal (gegate op fetch_minutes) nieuwe koppen op, map ze en bewaar; geef de state terug."""
    data = _load(cfg)
    last = data.get("fetched_at")
    due = True
    if last:
        try:
            due = (now - datetime.fromisoformat(last)).total_seconds() / 60 >= cfg.research.fetch_minutes
        except (ValueError, TypeError):
            due = True
    if not due:
        return data

    seen = {ev["hash"] for ev in data.get("events", [])}
    new = 0
    for title, pub, source in fetcher(cfg.research.sources):
        ev = headline_to_event(title, pub, source, allowed_bases, now)
        if ev and ev["hash"] not in seen:
            data["events"].append(ev)
            seen.add(ev["hash"])
            new += 1
    data["events"] = _fresh(data["events"], now)[-MAX_STORED:]
    data["fetched_at"] = now.isoformat(timespec="seconds")
    _save(cfg, data)
    if new:
        log.info("newsfeed: %d nieuwe relevante kop(pen) gevonden", new)
    return data


class NewsFeedResearchAgent(ResearchAgent):
    """Proactieve nieuws-agent: zoekt zelf, stelt trades voor, vuurt elke kop één keer af."""
    name = "newsfeed"

    def __init__(self, cfg: AppConfig, fetcher=fetch_headlines):
        super().__init__(cfg)
        self._fetcher = fetcher

    def evaluate(self, pairs: list[str], now: datetime) -> list[ResearchSignal]:
        allowed = {p.split("-")[0] for p in pairs}
        data = refresh(self.cfg, allowed, now, self._fetcher)
        out: list[ResearchSignal] = []
        changed = False
        for ev in data.get("events", []):
            if ev.get("fired") or ev["pair"] not in set(pairs):
                continue
            if float(ev.get("confidence", 0)) < self.cfg.research.min_confidence:
                continue
            out.append(ResearchSignal(
                pair=ev["pair"], direction=int(ev["direction"]),
                confidence=float(ev["confidence"]), horizon_hours=EVENT_TTL_HOURS,
                rationale=f"nieuws: {ev.get('rationale', '')}"[:180],
                sources=[ev.get("source", "")]))
            ev["fired"] = True                # één keer handelen; blijft als factor meetellen
            changed = True
        if changed:
            _save(self.cfg, data)
        return out
