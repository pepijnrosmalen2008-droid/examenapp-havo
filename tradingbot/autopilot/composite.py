"""Composite research-agent — alle informatiebronnen tegelijk in één bot.

Eén bot die "alles weet": de nieuws-, politici- en on-chain-probes draaien naast elkaar en hun
voorstellen worden samengevoegd. Elke sub-agent houdt zijn eigen bronlijst en eigen auto-events-
bestand (news_auto_/disclosures_auto_/onchain_auto_<bot_id>.json), dus ze botsen niet; de factor-
overlay (research.load_events) voegt alle drie al samen voor de gedachtegang.

Een sub-agent wordt alleen aangemaakt als er bronnen voor zijn ingesteld (research.news_sources /
disclosure_sources / onchain_sources). Zo doet een lege bron niets — geen fouten, geen ruis.

Belangrijk: dit verandert niets aan de discipline. Elk voorstel gaat nog steeds door de
confidence-poort én de risk engine, en elke bron/entiteit wordt forward-only afgerekend. "Alles in
één bot" betekent meer informatie, niet minder toetsing.
"""

from __future__ import annotations

import logging
from datetime import datetime

from .config import AppConfig
from .research import ResearchAgent, ResearchSignal

log = logging.getLogger("autopilot.composite")


def _with_sources(cfg: AppConfig, sources: list[str]) -> AppConfig:
    """Kopie van de config met research.sources vervangen, voor één sub-agent."""
    return cfg.model_copy(update={"research": cfg.research.model_copy(update={"sources": sources})})


class CompositeResearchAgent(ResearchAgent):
    """Draait meerdere research-sub-agents en voegt hun voorstellen samen."""
    name = "allin"

    def __init__(self, cfg: AppConfig):
        super().__init__(cfg)
        self._agents: list[ResearchAgent] = []
        r = cfg.research
        if r.news_sources:
            from .newsfeed import NewsFeedResearchAgent
            self._agents.append(NewsFeedResearchAgent(_with_sources(cfg, r.news_sources)))
        if r.disclosure_sources:
            from .disclosures import DisclosureResearchAgent
            self._agents.append(DisclosureResearchAgent(_with_sources(cfg, r.disclosure_sources)))
        if r.onchain_sources:
            from .onchain import OnChainResearchAgent
            self._agents.append(OnChainResearchAgent(_with_sources(cfg, r.onchain_sources)))
        log.info("research-laag actief: all-in (%d bron-agents), min_confidence %.2f",
                 len(self._agents), cfg.research.min_confidence)

    def evaluate(self, pairs: list[str], now: datetime) -> list[ResearchSignal]:
        out: list[ResearchSignal] = []
        for agent in self._agents:
            try:
                out.extend(agent.evaluate(pairs, now))
            except Exception:  # noqa: BLE001 — één dode bron mag de rest niet breken
                log.exception("research sub-agent %s faalde; overgeslagen", getattr(agent, "name", "?"))
        return out
