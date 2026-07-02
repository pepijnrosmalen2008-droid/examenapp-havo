"""Technische indicatoren — puur, zonder dependencies (geen numpy nodig voor deze schaal)."""

from __future__ import annotations

import math


def ema(values: list[float], period: int) -> list[float]:
    """Exponential moving average; eerste `period-1` posities zijn NaN."""
    if len(values) < period:
        return [math.nan] * len(values)
    out = [math.nan] * (period - 1)
    seed = sum(values[:period]) / period
    out.append(seed)
    k = 2 / (period + 1)
    prev = seed
    for v in values[period:]:
        prev = v * k + prev * (1 - k)
        out.append(prev)
    return out


def rsi(values: list[float], period: int = 14) -> list[float]:
    """RSI volgens Wilder; eerste `period` posities zijn NaN."""
    n = len(values)
    if n <= period:
        return [math.nan] * n
    out = [math.nan] * period
    gains = losses = 0.0
    for i in range(1, period + 1):
        d = values[i] - values[i - 1]
        gains += max(d, 0.0)
        losses += max(-d, 0.0)
    avg_gain, avg_loss = gains / period, losses / period
    out.append(100.0 if avg_loss == 0 else 100 - 100 / (1 + avg_gain / avg_loss))
    for i in range(period + 1, n):
        d = values[i] - values[i - 1]
        avg_gain = (avg_gain * (period - 1) + max(d, 0.0)) / period
        avg_loss = (avg_loss * (period - 1) + max(-d, 0.0)) / period
        out.append(100.0 if avg_loss == 0 else 100 - 100 / (1 + avg_gain / avg_loss))
    return out


def volatility(values: list[float]) -> float:
    """Standaarddeviatie van log-returns over de gegeven reeks (per periode, niet geannualiseerd)."""
    if len(values) < 3:
        return 0.0
    rets = [math.log(values[i] / values[i - 1]) for i in range(1, len(values)) if values[i - 1] > 0]
    if len(rets) < 2:
        return 0.0
    mean = sum(rets) / len(rets)
    var = sum((r - mean) ** 2 for r in rets) / (len(rets) - 1)
    return math.sqrt(var)
