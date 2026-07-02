"""Gedeelde datatypes: Candle, Signal, Position, Order."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class Side(str, Enum):
    BUY = "BUY"
    SELL = "SELL"


class OrderStatus(str, Enum):
    PENDING = "PENDING"      # intent gejournald, nog niet naar de exchange gestuurd
    PLACED = "PLACED"        # bij de exchange geplaatst, nog niet (volledig) gevuld
    FILLED = "FILLED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"    # geblokkeerd door risk engine of geweigerd door exchange
    ABANDONED = "ABANDONED"  # PENDING intent die na een crash niet op de exchange bleek te staan


@dataclass(frozen=True)
class Candle:
    ts: int          # epoch ms van candle-open
    open: float
    high: float
    low: float
    close: float
    volume: float


@dataclass(frozen=True)
class Signal:
    """Wat een strategie wil doen. De risk engine beslist of (en hoeveel) er echt gebeurt."""
    pair: str
    side: Side
    amount_eur: float | None = None   # gewenste orderwaarde in EUR (BUY) — None = laat risk engine bepalen
    amount_asset: float | None = None # te verkopen hoeveelheid (SELL) — None = hele positie
    reason: str = ""
    strategy: str = ""


@dataclass
class Position:
    pair: str
    amount: float        # hoeveelheid asset (bv. BTC)
    avg_price: float     # gemiddelde instapprijs in EUR
    opened_at: str       # ISO timestamp
    id: int | None = None
    status: str = "OPEN"
    peak_price: float = 0.0  # hoogste prijs sinds opening (voor trailing take-profit)

    @property
    def cost_eur(self) -> float:
        return self.amount * self.avg_price

    def value_eur(self, price: float) -> float:
        return self.amount * price

    def pnl_pct(self, price: float) -> float:
        if self.avg_price <= 0:
            return 0.0
        return (price - self.avg_price) / self.avg_price * 100


@dataclass
class RiskDecision:
    allowed: bool
    reason: str
    approved_eur: float = 0.0
    approved_asset: float | None = None
    signal: Signal | None = None
