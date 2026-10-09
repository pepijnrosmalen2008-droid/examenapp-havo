"""Autonome strategie — draait een roster kandidaat-strategieën, meet ze LIVE forward-only via de
arena, en laat ELKE cyclus alleen de best-bewezen strategie het echte handelen doen. Is geen enkele
strategie bewezen (actief), dan: **cash** (geen nieuwe trades). Zo kiest de bot zelf welke aanpak
bij de huidige markt past, en stopt hij zichzelf als niets werkt — in plaats van fees te verbranden.

Zelf-geschreven strategieën (evolutie-laag, zie `autopilot/evolution.py`) draaien hier als extra
roster-leden mee: de bot schrijft zijn eigen code, die wordt gated in de arena meegemeten en krijgt
pas echt kapitaal als ze zich forward-only bewijst. Een gegenereerde strategie met bewezen-negatieve
live-edge wordt automatisch uit de roster getrokken (terugval). De onafhankelijke risk-engine zit er
altijd omheen; niets in deze laag kan risk-limieten omzeilen of zelf geld alloceren.

Config (params):
  roster: lijst van {name, params} — de vaste kandidaat-strategieën (bv. adaptive-scalp, momentum, …).
  min_observations: hoeveel afgerekende observaties een strategie nodig heeft vóór ze kapitaal mag.
  self_evolve: bool (default True) — laat zelf-geschreven strategieën uit de evolutie-laag meedoen.
"""

from __future__ import annotations

import dataclasses
import logging
from datetime import datetime

from .. import arena, evolution
from ..config import StrategyConfig
from ..models import Candle, Position, Signal
from . import Strategy, register, _REGISTRY

log = logging.getLogger("autopilot.strategy.autonomous")

DEFAULT_ROSTER = [
    {"name": "adaptive", "params": {"candle_interval": "5m", "buy_threshold": 0.08,
                                    "sell_threshold": -0.08, "min_confidence": 0.06,
                                    "max_positions": 6}},
    {"name": "adaptive", "params": {"candle_interval": "15m", "buy_threshold": 0.20,
                                    "sell_threshold": -0.10, "min_confidence": 0.15,
                                    "max_positions": 4}},
    {"name": "momentum_ma_cross", "params": {}},
    {"name": "cross_sectional", "params": {}},
]


def _reg():
    """Zorg dat alle strategie-implementaties geregistreerd zijn vóór we het register gebruiken."""
    from . import dca, ma_cross, grid, cross_sectional, vol_target, hold, adaptive  # noqa: F401


@register
class AutonomousStrategy(Strategy):
    name = "autonomous"
    candle_interval = "5m"
    candle_limit = 200

    def __init__(self, cfg, db):
        super().__init__(cfg, db)
        _reg()
        self.candle_interval = str(self.params.get("candle_interval", self.candle_interval))
        self.candle_limit = int(self.params.get("candle_limit", self.candle_limit))
        self.min_obs = int(self.params.get("min_observations", arena.MIN_N))
        self.self_evolve = bool(self.params.get("self_evolve", True))
        self._roster = self.params.get("roster") or DEFAULT_ROSTER
        self._static_subs: list[tuple[str, Strategy]] = [
            s for s in (self._build_sub(spec) for spec in self._roster) if s is not None]
        self._gen_subs: list[tuple[str, Strategy]] = []
        self._gen_names: set[str] = set()
        if self.self_evolve:
            self._load_generated()
        log.info("autonomous: %d vaste + %d zelf-geschreven kandidaten in de arena",
                 len(self._static_subs), len(self._gen_subs))

    # ── roster-opbouw ────────────────────────────────────────────────

    def _build_sub(self, spec: dict) -> tuple[str, Strategy] | None:
        sub_cfg = self.cfg.model_copy(update={
            "strategy": StrategyConfig(name=spec["name"], params=spec.get("params", {}))})
        try:
            sub = _REGISTRY[spec["name"]](sub_cfg, self.db)
        except KeyError:
            log.warning("autonomous: onbekende strategie '%s' overgeslagen", spec["name"])
            return None
        label = spec.get("label") or f"{spec['name']}:{spec.get('params', {}).get('candle_interval', '')}"
        return (label, sub)

    def _load_generated(self) -> None:
        """(Her)bouw de zelf-geschreven roster-leden uit de evolutie-laag (gated via de arena)."""
        try:
            specs = evolution.load_generated(self.db)
        except Exception:  # noqa: BLE001 — evolutie mag beslissen nooit breken
            log.exception("autonomous: kon zelf-geschreven strategieën niet laden")
            specs = []
        self._gen_subs = [s for s in (self._build_sub(spec) for spec in specs) if s is not None]
        self._gen_names = {label for label, _ in self._gen_subs}

    @property
    def _subs(self) -> list[tuple[str, Strategy]]:
        return self._static_subs + self._gen_subs

    # ── beslissing ───────────────────────────────────────────────────

    def generate_signals(self, candles: dict[str, list[Candle]],
                         positions: list[Position], now: datetime) -> list[Signal]:
        if not candles:
            return []
        prices = {p: c[-1].close for p, c in candles.items() if c}

        # 1) elke kandidaat draait mee en levert voorstellen; die worden LIVE gescoord
        proposals: dict[str, list[Signal]] = {}
        for label, sub in self._subs:
            try:
                sigs = sub.generate_signals(candles, positions, now)
            except Exception:  # noqa: BLE001 — één kapotte kandidaat mag de rest niet breken
                log.exception("autonomous: kandidaat %s faalde", label)
                sigs = []
            proposals[label] = sigs
            arena.record(self.db, label, sigs, prices, now, self.cfg)

        # 2) afrekenen wat verstreken is → bewijs groeit
        arena.grade(self.db, prices, now, self.cfg)

        # 3) automatische terugval: zelf-geschreven strategie met bewezen-negatieve edge → uit de roster
        if self.self_evolve:
            try:
                retired = evolution.auto_retire(self.db, self.min_obs)
            except Exception:  # noqa: BLE001
                retired = []
            if retired:
                self._load_generated()          # herbouw zonder de geretireerde

        # 4) laat de best-bewezen strategie echt handelen; niemand bewezen → cash
        winner = arena.best_strategy(self.db, self.min_obs)
        if winner is None:
            return []
        return [dataclasses.replace(s, strategy=f"autonomous[{winner}]")
                for s in proposals.get(winner, [])]
