"""Autonome strategie — draait een roster kandidaat-strategieën, meet ze LIVE forward-only via de
arena, en laat ELKE cyclus alleen de best-bewezen strategie het echte handelen doen. Is geen enkele
strategie bewezen (actief), dan: **cash** (geen nieuwe trades). Zo kiest de bot zelf welke aanpak
bij de huidige markt past, en stopt hij zichzelf als niets werkt — in plaats van fees te verbranden.

Config (params):
  roster: lijst van {name, params} — de kandidaat-strategieën (bv. adaptive-scalp, momentum, ...).
  min_observations: hoeveel afgerekende observaties een strategie nodig heeft vóór ze kapitaal mag.
"""

from __future__ import annotations

import logging
from datetime import datetime

from .. import arena
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
        roster = self.params.get("roster") or DEFAULT_ROSTER
        self._subs: list[tuple[str, Strategy]] = []
        for spec in roster:
            sub_cfg = cfg.model_copy(update={
                "strategy": StrategyConfig(name=spec["name"], params=spec.get("params", {}))})
            try:
                sub = _REGISTRY[spec["name"]](sub_cfg, db)
            except KeyError:
                log.warning("autonomous: onbekende strategie '%s' overgeslagen", spec["name"])
                continue
            # unieke label zodat twee varianten van dezelfde strategie apart gescoord worden
            label = spec.get("label") or f"{spec['name']}:{spec.get('params', {}).get('candle_interval', '')}"
            self._subs.append((label, sub))
        log.info("autonomous: %d kandidaat-strategieën in de arena", len(self._subs))

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

        # 3) laat de best-bewezen strategie echt handelen; niemand bewezen → cash
        winner = arena.best_strategy(self.db, self.min_obs)
        if winner is None:
            return []
        import dataclasses
        return [dataclasses.replace(s, strategy=f"autonomous[{winner}]")
                for s in proposals.get(winner, [])]
