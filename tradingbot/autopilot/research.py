"""Research-laag — VOORSTELLEN, geen orders.

Dit is de plek waar later een AI-agent nieuws, macro en sentiment tot signalen
verwerkt. Cruciaal in het ontwerp:

  * Een research-agent geeft `ResearchSignal`s terug — gestructureerd, met een
    expliciete zekerheid (0..1), horizon en onderbouwing. Nooit een kale "BUY".
  * Die voorstellen worden gefilterd op `min_confidence` en pas dán omgezet naar
    handels-`Signal`s, die verplicht door de risk engine gaan. De research-laag
    kan dus NOOIT zelf een order plaatsen, limieten omzeilen of code wijzigen.
  * De referentie-implementatie hieronder is bewust deterministisch (leest een
    lokaal JSON-bestand), zodat de hele pijplijn testbaar is zonder externe API's
    of een LLM. Een echte LLM-agent implementeert dezelfde interface en levert
    dezelfde gestructureerde output — de gating eromheen blijft identiek.

Waarom niet "nieuws → LLM → BUY": zie RESEARCH_AGENT.md. Kort: één LLM-call die
direct een order bepaalt is niet toetsbaar, niet reproduceerbaar en reageert op
ruis. De meerlaagse structuur (feit → asset → impact → zekerheid → horizon →
gating → risk engine) is dat wél, laag voor laag.
"""

from __future__ import annotations

import json
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

from .config import AppConfig
from .models import Side, Signal

log = logging.getLogger("autopilot.research")


@dataclass(frozen=True)
class ResearchSignal:
    """Een voorstel van de research-laag. Geen order — een onderbouwde suggestie."""
    pair: str
    direction: int              # +1 bullish, -1 bearish, 0 neutraal
    confidence: float           # 0..1
    horizon_hours: float        # over welke termijn het voorstel speelt
    rationale: str              # waarom (in mensentaal, voor de logs)
    sources: list[str] = field(default_factory=list)

    def __post_init__(self):
        if self.direction not in (-1, 0, 1):
            raise ValueError("direction moet -1, 0 of 1 zijn")
        if not 0 <= self.confidence <= 1:
            raise ValueError("confidence moet tussen 0 en 1 liggen")


class ResearchAgent(ABC):
    name: str = ""

    def __init__(self, cfg: AppConfig):
        self.cfg = cfg

    @abstractmethod
    def evaluate(self, pairs: list[str], now: datetime) -> list[ResearchSignal]:
        """Lever voorstellen voor (een deel van) de gegeven pairs. Nooit orders."""


class RuleBasedResearchAgent(ResearchAgent):
    """Deterministische referentie: leest gestructureerde events uit een lokaal
    JSON-bestand en zet ze om naar ResearchSignals. Dient als testbare stand-in
    voor de latere AI-agent én als handmatige manier om zelf events in te voeren.

    events_file formaat (lijst objecten):
      [{"pair":"BTC-EUR","direction":1,"confidence":0.75,"horizon_hours":24,
        "rationale":"ETF-instroom versnelt","sources":["reuters.com/..."],
        "expires":"2026-07-10T00:00:00+00:00"}]
    """
    name = "rulebased"

    def evaluate(self, pairs: list[str], now: datetime) -> list[ResearchSignal]:
        path = Path(self.cfg.research.events_file)
        if not path.is_absolute():
            path = Path(__file__).resolve().parent.parent / path
        if not path.exists():
            return []
        try:
            raw = json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError) as e:
            log.warning("research: kon %s niet lezen: %s", path, e)
            return []

        out: list[ResearchSignal] = []
        allowed = set(pairs)
        for ev in raw if isinstance(raw, list) else []:
            try:
                if ev["pair"] not in allowed:
                    continue
                expires = ev.get("expires")
                if expires and now >= datetime.fromisoformat(expires):
                    continue
                out.append(ResearchSignal(
                    pair=ev["pair"], direction=int(ev["direction"]),
                    confidence=float(ev["confidence"]),
                    horizon_hours=float(ev.get("horizon_hours", 24)),
                    rationale=str(ev.get("rationale", "")),
                    sources=list(ev.get("sources", []))))
            except (KeyError, ValueError, TypeError) as e:
                log.warning("research: event overgeslagen (%s): %r", e, ev)
        return out


def load_events(cfg: AppConfig, now: datetime) -> list[dict]:
    """Ruwe, niet-verlopen events uit het events-bestand — voor de factor-overlay
    (factors.py). Tolerant t.o.v. het extra `kind`-veld (news|macro|smart_money).
    Anders dan RuleBasedResearchAgent, die er handels-VOORSTELLEN van maakt, levert
    dit alleen de gestructureerde feiten om de gedachtegang mee te kleuren."""
    path = Path(cfg.research.events_file)
    if not path.is_absolute():
        path = Path(__file__).resolve().parent.parent / path
    if not path.exists():
        return []
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        log.warning("research: kon %s niet lezen: %s", path, e)
        return []
    out = []
    for ev in raw if isinstance(raw, list) else []:
        expires = ev.get("expires") if isinstance(ev, dict) else None
        try:
            if expires and now >= datetime.fromisoformat(expires):
                continue
        except (ValueError, TypeError):
            pass
        if isinstance(ev, dict):
            out.append(ev)
    # proactief opgehaalde nieuws-events meenemen in de gedachtegang (factor-overlay)
    try:
        from .newsfeed import load_auto_events
        out += load_auto_events(cfg, now)
    except Exception:  # noqa: BLE001 — overlay mag nooit de cycle breken
        pass
    return out


_AGENTS: dict[str, type[ResearchAgent]] = {"rulebased": RuleBasedResearchAgent}


def get_research_agent(cfg: AppConfig) -> ResearchAgent | None:
    if not cfg.research.enabled:
        return None
    if cfg.research.agent == "newsfeed":
        from .newsfeed import NewsFeedResearchAgent   # lazy: vermijdt circulaire import
        log.info("research-laag actief: nieuwsfeed (proactief), min_confidence %.2f",
                 cfg.research.min_confidence)
        return NewsFeedResearchAgent(cfg)
    cls = _AGENTS.get(cfg.research.agent)
    if cls is None:
        raise ValueError(f"Onbekende research-agent '{cfg.research.agent}'")
    log.info("research-laag actief: agent '%s', min_confidence %.2f",
             cfg.research.agent, cfg.research.min_confidence)
    return cls(cfg)


def to_trade_signals(proposals: list[ResearchSignal], cfg: AppConfig) -> list[Signal]:
    """Gate op zekerheid en zet voorstellen om naar handels-Signals.

    Alleen voorstellen met confidence >= min_confidence tellen. BUY bij een
    bullish voorstel; bearish → SELL (de risk engine verkoopt alleen wat er is).
    Neutraal (direction 0) doet niets. De EUR-grootte is geplafonneerd op
    research.max_position_eur; de risk engine kan verder verkleinen of blokkeren.
    """
    r = cfg.research
    signals: list[Signal] = []
    for p in proposals:
        if p.confidence < r.min_confidence or p.direction == 0:
            continue
        reason = f"research({p.confidence:.0%}, {p.horizon_hours:g}u): {p.rationale}"[:200]
        if p.direction > 0:
            signals.append(Signal(pair=p.pair, side=Side.BUY,
                                  amount_eur=r.max_position_eur, reason=reason, strategy="research"))
        else:
            signals.append(Signal(pair=p.pair, side=Side.SELL, reason=reason, strategy="research"))
    return signals
