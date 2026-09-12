"""On-chain geldstromen — de bot bespiedt grote wallets en exchange-flows.

Publieke, on-chain zichtbare bewegingen bevatten mogelijk informatie vóór de koers reageert:
  * grote wallet → exchange (deposit)  = potentiële verkoopdruk  → bearish;
  * exchange → cold wallet (withdrawal) = aanbod van de markt af  → bullish;
  * stablecoin mint/burn, bridge- en treasury-bewegingen (kleur de context).

Cruciaal, en consistent met de nieuws- en politici-probe: dit is een niet-prijs informatiebron
die als PROBE binnenkomt (observeren, geen kapitaalgewicht) tot het bewijs er is. Elke herkende
wallet krijgt een **eigen factor-sleutel** (`smart_money:<label>`), zodat de forward-only,
kosten-nette, FDR- en regime-bewaakte leerlus **per wallet** meet of díé wallet iets voorspelt.
Zo ontstaat de "wallet-reputatie" vanzelf uit de meting — niet uit een verzonnen score.

De ruwheid van de flow→richting-vertaling is bewust: de leerlus rekent haar af. Blijkt een wallet
niets te voorspellen → status 'onbewezen', geen gewicht.

Data: werkt met een **gratis publieke bron zonder sleutel** (beperkter) én, als `ONCHAIN_API_KEY`
in de omgeving staat, met een rijkere bron. De fetcher is injecteerbaar zodat tests het netwerk
nooit raken. Een dode/gewijzigde bron degradeert stil (geen events) en breekt de cycle nooit.
Deze probe is latency-ongevoelig (minuten-tot-uren), precies waar een thuis-pc kán meedoen —
anders dan microstructuur/executie, waar we de traagste deelnemer zijn. Zie BITVAVO_ALPHA_ENGINE.md.
"""

from __future__ import annotations

import hashlib
import json
import logging
import os
from datetime import datetime, timedelta
from pathlib import Path

from .config import AppConfig
from .research import ResearchAgent, ResearchSignal

log = logging.getLogger("autopilot.onchain")

FLOW_TTL_HOURS = 12          # on-chain signaal is snel bederfelijk → korte factor-houdbaarheid
MAX_STORED = 600

# symbool-herkenning (asset in het flow-record) → base-ticker; alleen whitelist telt.
ASSET_TO_BASE: dict[str, str] = {
    "BTC": "BTC", "WBTC": "BTC", "ETH": "ETH", "WETH": "ETH", "STETH": "ETH",
    "SOL": "SOL", "USDT": "USDT", "USDC": "USDC",
}

# richting van de flow → koers-implicatie
TO_EXCHANGE = {"to_exchange", "deposit", "exchange_inflow", "in"}      # verkoopdruk → bearish
FROM_EXCHANGE = {"from_exchange", "withdrawal", "exchange_outflow", "out"}  # aanbod weg → bullish

# bedrag (USD) → magnitude/vertrouwen-boost
_USD_WEIGHT = [
    (100_000_000, 0.45), (50_000_000, 0.40), (10_000_000, 0.32),
    (5_000_000, 0.25), (1_000_000, 0.15), (100_000, 0.08),
]


def _usd_boost(amount_usd: float) -> float:
    for threshold, w in _USD_WEIGHT:
        if amount_usd >= threshold:
            return w
    return 0.05


# ── ophalen (injecteerbaar; optionele sleutel via ONCHAIN_API_KEY) ─────────────

def fetch_flows(sources: list[str], timeout: float = 8.0) -> list[dict]:
    """Haal grote on-chain transacties op uit publieke JSON-bronnen. Tolerant t.o.v. veldnamen.
    Een sleutel in ONCHAIN_API_KEY wordt (indien aanwezig) als query-param meegestuurd."""
    import requests
    key = os.getenv("ONCHAIN_API_KEY", "").strip()
    out: list[dict] = []
    for url in sources:
        try:
            params = {"api_key": key} if key else {}
            r = requests.get(url, timeout=timeout, params=params,
                             headers={"User-Agent": "Mozilla/5.0 (SlagioBot; onchain-probe)"})
            r.raise_for_status()
            raw = r.json()
            items = raw.get("transactions", raw) if isinstance(raw, dict) else raw
            if isinstance(items, list):
                for rec in items:
                    if isinstance(rec, dict):
                        rec.setdefault("_source", url)
                        out.append(rec)
        except Exception as e:  # noqa: BLE001 — een dode feed mag de cycle niet breken
            log.warning("onchain: bron %s niet bruikbaar: %s", url, e)
    return out


def _field(rec: dict, *names: str):
    for n in names:
        v = rec.get(n)
        if v not in (None, ""):
            return v
    return None


def _flow_direction(rec: dict) -> int | None:
    """+1 bullish (withdrawal), -1 bearish (deposit), of None als onduidelijk."""
    raw = str(_field(rec, "flow", "direction", "type", "transaction_type") or "").strip().lower()
    if raw in FROM_EXCHANGE:
        return 1
    if raw in TO_EXCHANGE:
        return -1
    # afleiden uit from/to-owner-types (bv. Whale Alert-achtig schema)
    frm = str(_field(rec, "from_owner_type", "from_type") or "").lower()
    to = str(_field(rec, "to_owner_type", "to_type") or "").lower()
    if to == "exchange" and frm != "exchange":
        return -1
    if frm == "exchange" and to != "exchange":
        return 1
    return None


# ── flow → event (deterministisch) ─────────────────────────────────────────────

def flow_to_event(rec: dict, allowed_bases: set[str], now: datetime) -> dict | None:
    asset = str(_field(rec, "symbol", "asset", "token") or "").strip().upper()
    base = ASSET_TO_BASE.get(asset)
    if base is None or base not in allowed_bases:
        return None                              # niet verhandelbaar/whitelist → skip
    direction = _flow_direction(rec)
    if direction is None:
        return None
    try:
        amount_usd = float(_field(rec, "amount_usd", "value_usd", "usd") or 0)
    except (TypeError, ValueError):
        amount_usd = 0.0
    if amount_usd < 100_000:                     # ruis onder de €100k negeren
        return None
    label = str(_field(rec, "label", "owner", "wallet", "from_owner", "hash") or "onbekend")[:40]
    boost = _usd_boost(amount_usd)
    confidence = round(min(0.9, 0.45 + boost), 2)
    verb = "haalde van de beurs" if direction == 1 else "stortte op de beurs"
    ts = _field(rec, "timestamp", "block_time", "ts")
    h = hashlib.sha256(f"{label}|{asset}|{direction}|{ts}|{amount_usd:.0f}".encode()).hexdigest()[:16]
    return {
        "hash": h, "pair": f"{base}-EUR", "kind": "smart_money", "entity": label,
        "direction": direction, "confidence": confidence,
        "magnitude": round(min(1.0, 0.4 + boost), 2),
        "source": rec.get("_source", "onchain"), "n_sources": 1,
        "published": str(ts) if ts else None,
        "rationale": f"on-chain: {label} {verb} ~${amount_usd:,.0f} {asset}"[:180],
        "expires": (now + timedelta(hours=FLOW_TTL_HOURS)).isoformat(timespec="seconds"),
        "fired": False,
    }


# ── persistente auto-events (gedeeld met de factor-overlay) ─────────────────────

def auto_path(cfg: AppConfig) -> Path:
    return Path(__file__).resolve().parent.parent / f"onchain_auto_{cfg.bot_id}.json"


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
        log.warning("onchain: kon auto-events niet opslaan: %s", e)


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
    """Voor de factor-overlay (factors.py): de nog geldige flows als events."""
    return _fresh(_load(cfg).get("events", []), now)


def refresh(cfg: AppConfig, allowed_bases: set[str], now: datetime,
            fetcher=fetch_flows) -> dict:
    """Haal (gegate op fetch_minutes) nieuwe flows op, map ze en bewaar; geef de state terug."""
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
        ev = flow_to_event(rec, allowed_bases, now)
        if ev and ev["hash"] not in seen:
            data["events"].append(ev)
            seen.add(ev["hash"])
            new += 1
    data["events"] = _fresh(data["events"], now)[-MAX_STORED:]
    data["fetched_at"] = now.isoformat(timespec="seconds")
    _save(cfg, data)
    if new:
        log.info("onchain: %d nieuwe grote flow(s) gevonden", new)
    return data


class OnChainResearchAgent(ResearchAgent):
    """Volgt grote on-chain flows, stelt trades voor, vuurt elke flow één keer af."""
    name = "onchain"

    def __init__(self, cfg: AppConfig, fetcher=fetch_flows):
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
                confidence=float(ev["confidence"]), horizon_hours=FLOW_TTL_HOURS,
                rationale=f"on-chain: {ev.get('rationale', '')}"[:180],
                sources=[ev.get("source", "")]))
            ev["fired"] = True
            changed = True
        if changed:
            _save(self.cfg, data)
        return out
