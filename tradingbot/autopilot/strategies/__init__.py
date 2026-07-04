"""Pluggable strategie-interface.

Elke strategie implementeert generate_signals(candles, positions, now) en geeft
Signal-objecten terug. De risk engine zit er als aparte laag omheen en kan elk
signaal blokkeren of verkleinen — strategieën kunnen risk-limieten nooit omzeilen
(ze plaatsen zelf nooit orders; alleen de engine doet dat, ná risk.evaluate()).

State die een herstart moet overleven bewaren strategieën via load_state/save_state
(SQLite-tabel strategy_state).
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import datetime

from ..config import AppConfig
from ..database import Database
from ..models import Candle, Position, Signal


class Strategy(ABC):
    #: naam in config.yaml (strategy.name)
    name: str = ""
    #: welk candle-interval de strategie nodig heeft (None = geen candles nodig)
    candle_interval: str | None = "1h"
    #: hoeveel candles er per pair aangeleverd moeten worden
    candle_limit: int = 200

    def __init__(self, cfg: AppConfig, db: Database):
        self.cfg = cfg
        self.db = db
        self.params = cfg.strategy.params

    @abstractmethod
    def generate_signals(self, candles: dict[str, list[Candle]],
                         positions: list[Position], now: datetime) -> list[Signal]:
        """Puur beslissen; nooit zelf orders plaatsen."""

    # ── persistente strategie-state ───────────────────────────────────

    def load_state(self, pair: str) -> dict:
        return self.db.get_strategy_state(self.name, pair)

    def save_state(self, pair: str, state: dict) -> None:
        self.db.set_strategy_state(self.name, pair, state)


_REGISTRY: dict[str, type[Strategy]] = {}


def register(cls: type[Strategy]) -> type[Strategy]:
    _REGISTRY[cls.name] = cls
    return cls


def get_strategy(cfg: AppConfig, db: Database) -> Strategy:
    # Imports hier om circulaire imports te vermijden; registreert de implementaties.
    from . import dca, ma_cross, grid, cross_sectional, vol_target  # noqa: F401
    name = cfg.strategy.name
    if name not in _REGISTRY:
        raise ValueError(f"Onbekende strategie '{name}'. Beschikbaar: {sorted(_REGISTRY)}")
    return _REGISTRY[name](cfg, db)
