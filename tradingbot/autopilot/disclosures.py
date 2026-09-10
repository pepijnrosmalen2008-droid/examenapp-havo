"""Politici-transacties — de bot volgt wat volksvertegenwoordigers écht *verhandelen*,
niet wat ze aankondigen.

Waarom dit legaal én zinvol is: Amerikaanse politici zijn onder de STOCK Act verplicht
hun beurstransacties **openbaar** te melden (Periodic Transaction Reports). Die meldingen
zijn publiek en worden door gratis datasets bijgehouden (House/Senate Stock Watcher). Handelen
op openbaar gemaakte transacties is dus géén voorkennis/front-running — het is publieke data.
De prijs die je ervoor betaalt: er zit een meld-vertraging (tot ~45 dagen) op, dus of er ná die
vertraging nog een voorsprong overblijft, is precies wat gemeten moet worden.

De harde beperking, eerlijk: dit platform handelt op **Bitvavo = alleen crypto (EUR-paren)**.
Een gemelde aankoop van een willekeurig aandeel (NVDA, TSLA) kunnen we hier niet verhandelen en
wordt overgeslagen. Wat we wél kunnen: crypto-relevante posities (spot-BTC/ETH-ETF's en
crypto-aandelen als proxy) vertalen naar een crypto-signaal. Een politicus die IBIT (spot-BTC-ETF)
koopt → bullish BTC; die COIN/MSTR verkoopt → bearish. Zo blijft het op Bitvavo verhandelbaar.

Elke gemelde transactie:
  1. wordt gekoppeld aan een crypto-base via een transparante ticker→coin-tabel (anders genegeerd);
  2. krijgt een richting (Purchase → +1, Sale → −1; Exchange = dubbelzinnig → genegeerd);
  3. vuurt één keer als trade-VOORSTEL af (daarna telt hij als factor mee);
  4. gaat altijd langs de confidence-poort én de risk engine — kan nooit zelf een order plaatsen.

Cruciaal: elke politicus krijgt zijn **eigen factor-sleutel** (`smart_money:<naam>`), zodat de
forward-only, kosten-nette, FDR- en regime-bewaakte leerlus per politicus meet of hun gemelde
trades iets voorspellen. Blijkt van niet, dan blijft de status 'onbewezen' en krijgt het geen
gewicht. De bot volgt dus proactief politici, maar de machine beslist of dat ooit iets waard was.
Dit is bewust een Conditie-B-informatiebron: hij komt binnen als PROBE (observeren), zonder
kapitaalgewicht, tot het track record significantie aantoont. Zie experiments/2026_politician_disclosures.md.
"""

from __future__ import annotations

import hashlib
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path

from .config import AppConfig
from .research import ResearchAgent, ResearchSignal

log = logging.getLogger("autopilot.disclosures")

DISCLOSURE_TTL_HOURS = 24 * 7      # hoe lang een gemelde trade als factor blijft meetellen
MAX_STORED = 600                   # cap op het lokale bestand

# ── ticker → crypto-base (transparant, inspecteerbaar) ─────────────────────────
# Alleen crypto-verhandelbare posities. Een gemelde trade in een ticker die hier niet
# in staat, kunnen we op Bitvavo niet naspelen en wordt overgeslagen.
TICKER_TO_BASE: dict[str, str] = {
    # spot-Bitcoin-ETF's → BTC
    "IBIT": "BTC", "FBTC": "BTC", "GBTC": "BTC", "BITB": "BTC", "ARKB": "BTC",
    "BTCO": "BTC", "HODL": "BTC", "BRRR": "BTC", "EZBC": "BTC", "BTC": "BTC",
    # Bitcoin-proxy-aandelen (mijnbouw / treasury) → BTC
    "MSTR": "BTC", "MSTU": "BTC", "MARA": "BTC", "RIOT": "BTC", "CLSK": "BTC",
    "HUT": "BTC", "COIN": "BTC",
    # spot-Ether-ETF's → ETH
    "ETHA": "ETH", "ETHE": "ETH", "FETH": "ETH", "ETHW": "ETH", "ETHV": "ETH",
    "ETH": "ETH",
}

# gemelde transactie-typen → richting
BUY_TYPES = {"purchase", "buy", "p", "partial purchase"}
SELL_TYPES = {"sale", "sale (full)", "sale (partial)", "sell", "s", "partial sale"}

# gemelde bedragsklassen (House/Senate melden ranges) → magnitude-boost. Groter = zwaarder.
_AMOUNT_WEIGHT = [
    ("1,000,001", 0.45), ("500,001", 0.40), ("250,001", 0.35), ("100,001", 0.30),
    ("50,001", 0.22), ("15,001", 0.15), ("1,001", 0.08),
]


def _amount_boost(amount: str | None) -> float:
    if not amount:
        return 0.10
    a = amount.replace("$", "").replace(" ", "")
    for needle, w in _AMOUNT_WEIGHT:
        if needle.replace(",", "") in a.replace(",", ""):
            return w
    return 0.10


# ── ophalen (injecteerbaar zodat tests niet het netwerk raken) ─────────────────

def fetch_disclosures(sources: list[str], timeout: float = 8.0) -> list[dict]:
    """Haal gemelde transacties op uit publieke JSON-datasets (House/Senate Stock Watcher).

    Verwacht per bron een JSON-lijst van objecten. Veldnamen verschillen per dataset, dus
    we lezen tolerant: naam uit representative|senator|name, ticker, type/transaction_type,
    transaction_date, disclosure_date, amount. Een dode/gewijzigde bron → stil overslaan
    (mag de cycle nooit breken)."""
    import requests
    out: list[dict] = []
    for url in sources:
        try:
            r = requests.get(url, timeout=timeout,
                             headers={"User-Agent": "Mozilla/5.0 (SlagioBot; disclosure-probe)"})
            r.raise_for_status()
            raw = r.json()
            if isinstance(raw, list):
                for rec in raw:
                    if isinstance(rec, dict):
                        rec.setdefault("_source", url)
                        out.append(rec)
        except Exception as e:  # noqa: BLE001 — een dode feed mag de cycle niet breken
            log.warning("disclosures: bron %s niet bruikbaar: %s", url, e)
    return out


def _field(rec: dict, *names: str) -> str | None:
    for n in names:
        v = rec.get(n)
        if v not in (None, ""):
            return str(v)
    return None


# ── gemelde transactie → event (deterministisch) ───────────────────────────────

def disclosure_to_event(rec: dict, allowed_bases: set[str], now: datetime) -> dict | None:
    ticker = _field(rec, "ticker", "asset_ticker", "symbol")
    if not ticker:
        return None
    base = TICKER_TO_BASE.get(ticker.strip().upper())
    if base is None or base not in allowed_bases:
        return None                              # niet crypto-verhandelbaar op Bitvavo → skip
    ttype = (_field(rec, "type", "transaction_type", "txn_type") or "").strip().lower()
    if ttype in BUY_TYPES:
        direction = 1
    elif ttype in SELL_TYPES:
        direction = -1
    else:
        return None                              # exchange/onbekend → dubbelzinnig, geen event
    who = _field(rec, "representative", "senator", "name", "member") or "onbekend"
    tx_date = _field(rec, "transaction_date", "tx_date", "traded") or ""
    disc_date = _field(rec, "disclosure_date", "filed", "report_date") or ""
    amount = _field(rec, "amount", "range", "value")
    boost = _amount_boost(amount)
    confidence = round(min(0.9, 0.45 + boost), 2)
    verb = "kocht" if direction == 1 else "verkocht"
    h = hashlib.sha256(f"{who}|{ticker}|{tx_date}|{ttype}".encode()).hexdigest()[:16]
    return {
        "hash": h, "pair": f"{base}-EUR", "kind": "smart_money", "entity": who,
        "direction": direction, "confidence": confidence,
        "magnitude": round(min(1.0, 0.4 + boost), 2),
        "source": rec.get("_source", "disclosure"), "n_sources": 1,
        "published": disc_date or tx_date or None,
        "rationale": f"{who} {verb} {ticker} ({amount or 'onbekend bedrag'}; "
                     f"gemeld {disc_date or '?'}, verhandeld {tx_date or '?'})"[:180],
        "expires": (now + timedelta(hours=DISCLOSURE_TTL_HOURS)).isoformat(timespec="seconds"),
        "fired": False,
    }


# ── persistente auto-events (gedeeld met de factor-overlay) ─────────────────────

def auto_path(cfg: AppConfig) -> Path:
    return Path(__file__).resolve().parent.parent / f"disclosures_auto_{cfg.bot_id}.json"


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
        log.warning("disclosures: kon auto-events niet opslaan: %s", e)


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
    """Voor de factor-overlay (factors.py): de nog geldige gemelde trades als events."""
    return _fresh(_load(cfg).get("events", []), now)


def refresh(cfg: AppConfig, allowed_bases: set[str], now: datetime,
            fetcher=fetch_disclosures) -> dict:
    """Haal (gegate op fetch_minutes) nieuwe meldingen op, map ze en bewaar; geef de state terug."""
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
    for rec in fetcher(cfg.research.sources):
        ev = disclosure_to_event(rec, allowed_bases, now)
        if ev and ev["hash"] not in seen:
            data["events"].append(ev)
            seen.add(ev["hash"])
            new += 1
    data["events"] = _fresh(data["events"], now)[-MAX_STORED:]
    data["fetched_at"] = now.isoformat(timespec="seconds")
    _save(cfg, data)
    if new:
        log.info("disclosures: %d nieuwe crypto-relevante melding(en) gevonden", new)
    return data


class DisclosureResearchAgent(ResearchAgent):
    """Volgt gemelde politici-transacties, stelt trades voor, vuurt elke melding één keer af."""
    name = "disclosures"

    def __init__(self, cfg: AppConfig, fetcher=fetch_disclosures):
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
                confidence=float(ev["confidence"]), horizon_hours=DISCLOSURE_TTL_HOURS,
                rationale=f"politicus: {ev.get('rationale', '')}"[:180],
                sources=[ev.get("source", "")]))
            ev["fired"] = True                # één keer handelen; blijft als factor meetellen
            changed = True
        if changed:
            _save(self.cfg, data)
        return out
