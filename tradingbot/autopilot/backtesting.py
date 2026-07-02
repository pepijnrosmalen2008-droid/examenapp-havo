"""Gedeelde backtest-machinerie: replay van candles door de échte engine.

Gebruikt door backtest.py (enkele run + Monte Carlo) en walkforward.py.
"""

from __future__ import annotations

import math
from datetime import datetime, timezone

from .config import AppConfig, TradingMode
from .database import Database
from .engine import TradingEngine
from .exchange import PaperExchange
from .models import Candle
from .risk import RiskEngine
from .strategies import get_strategy

WARMUP_CANDLES = 24 * 30  # 30 dagen 1h-warmup vóór de eerste handelsdag


class ReplayMarket:
    """Speelt candles af; 'ticker' = close van de huidige candle. Geen look-ahead."""

    def __init__(self, data: dict[str, list[Candle]]):
        self.data = data
        self.index: dict[str, int] = {p: 0 for p in data}
        # 1d-aggregatie voorbereiden (voor het regime-filter): alleen afgesloten dagen
        self._daily: dict[str, list[Candle]] = {p: self._aggregate_daily(s) for p, s in data.items()}

    @staticmethod
    def _aggregate_daily(series: list[Candle]) -> list[Candle]:
        out: list[Candle] = []
        bucket: list[Candle] = []
        day = None
        for c in series:
            d = c.ts // 86_400_000
            if day is not None and d != day:
                out.append(Candle(ts=day * 86_400_000, open=bucket[0].open,
                                  high=max(b.high for b in bucket), low=min(b.low for b in bucket),
                                  close=bucket[-1].close, volume=sum(b.volume for b in bucket)))
                bucket = []
            day = d
            bucket.append(c)
        return out

    def seek(self, ts: int) -> None:
        for pair, series in self.data.items():
            i = self.index[pair]
            while i + 1 < len(series) and series[i + 1].ts <= ts:
                i += 1
            self.index[pair] = i

    def ticker_price(self, pair: str) -> float:
        return self.data[pair][self.index[pair]].close

    def spread_pct(self, pair: str) -> float | None:
        return None  # candles bevatten geen bid/ask; circuit breaker slaat dit dan over

    def candles(self, pair: str, interval: str = "1h", limit: int = 200, since_ms=None):
        i = self.index[pair]
        if interval == "1d":
            cur_day = self.data[pair][i].ts // 86_400_000
            closed = [c for c in self._daily[pair] if c.ts // 86_400_000 < cur_day]
            return closed[-limit:]
        return self.data[pair][max(0, i + 1 - limit): i + 1]


def slice_data(data: dict[str, list[Candle]], start_ms: int, end_ms: int,
               warmup: int = WARMUP_CANDLES) -> dict[str, list[Candle]]:
    """Candles voor [start, end) plus `warmup` candles vóór start."""
    out = {}
    for pair, series in data.items():
        first = next((i for i, c in enumerate(series) if c.ts >= start_ms), len(series))
        out[pair] = series[max(0, first - warmup): next(
            (i for i, c in enumerate(series) if c.ts >= end_ms), len(series))]
    return out


def run_backtest(cfg: AppConfig, strategy_name: str, data: dict[str, list[Candle]],
                 warmup: int = WARMUP_CANDLES, params: dict | None = None,
                 capital: float | None = None) -> dict:
    cfg = cfg.model_copy(deep=True)
    cfg.strategy.name = strategy_name  # type: ignore[assignment]
    if params is not None:
        cfg.strategy.params = {**cfg.strategy.params, **params}
    if capital is not None:
        cfg.capital_eur = capital

    db = Database(":memory:")
    market = ReplayMarket(data)
    paper = PaperExchange(db, market, capital_eur=cfg.capital_eur,
                          taker_fee_pct=cfg.costs.taker_fee_pct,
                          slippage_pct=cfg.costs.slippage_pct)
    engine = TradingEngine(cfg, db, paper, RiskEngine(cfg, db),
                           get_strategy(cfg, db), TradingMode.PAPER)
    engine.startup()

    timeline = sorted(set.intersection(*(set(c.ts for c in series) for series in data.values())))
    equity_curve: list[tuple[int, float]] = []
    halted_at = None

    for ts in timeline[warmup:]:
        market.seek(ts)
        now = datetime.fromtimestamp(ts / 1000, tz=timezone.utc)
        engine.cycle(now)
        snap = db.last_equity()
        equity_curve.append((ts, snap["equity_eur"]))
        if engine.risk.is_halted():
            halted_at = now
            break

    orders = [dict(o) for o in db.recent_orders(1_000_000) if o["status"] == "FILLED"]
    closed = db.conn.execute(
        "SELECT realized_pnl_eur FROM positions WHERE realized_pnl_eur IS NOT NULL").fetchall()
    wins = sum(1 for r in closed if r["realized_pnl_eur"] > 0)
    final = equity_curve[-1][1] if equity_curve else cfg.capital_eur
    db.close()
    return {
        "strategy": strategy_name,
        "params": params or {},
        "final_equity": final,
        "return_pct": (final / cfg.capital_eur - 1) * 100,
        "max_dd_pct": max_drawdown([e for _, e in equity_curve]),
        "trades": len(orders),
        "win_rate": (wins / len(closed) * 100) if closed else float("nan"),
        "sharpe": sharpe([e for _, e in equity_curve]),
        "halted_at": halted_at,
        "equity_curve": equity_curve,
    }


def buy_and_hold(cfg: AppConfig, data: dict[str, list[Candle]],
                 warmup: int = WARMUP_CANDLES, capital: float | None = None) -> dict:
    """Gelijk verdeeld over de pairs kopen op de eerste candle, aanhouden tot de laatste."""
    capital = capital if capital is not None else cfg.capital_eur
    fee = cfg.costs.taker_fee_pct / 100
    slip = cfg.costs.slippage_pct / 100
    per_pair = capital / len(data)
    curve: list[float] = []
    timeline = sorted(set.intersection(*(set(c.ts for c in series) for series in data.values())))
    closes = {p: {c.ts: c.close for c in series} for p, series in data.items()}
    entry = {p: closes[p][timeline[warmup]] * (1 + slip) for p in data}
    units = {p: per_pair * (1 - fee) / entry[p] for p in data}
    for ts in timeline[warmup:]:
        curve.append(sum(units[p] * closes[p][ts] for p in data))
    final = curve[-1] * (1 - fee - slip)  # exit-kosten
    return {
        "strategy": "buy-and-hold",
        "params": {},
        "final_equity": final,
        "return_pct": (final / capital - 1) * 100,
        "max_dd_pct": max_drawdown(curve),
        "trades": len(data),
        "win_rate": float("nan"),
        "sharpe": sharpe(curve),
        "halted_at": None,
        "equity_curve": [(timeline[warmup + i], v) for i, v in enumerate(curve)],
    }


def max_drawdown(curve: list[float]) -> float:
    peak, dd = -math.inf, 0.0
    for v in curve:
        peak = max(peak, v)
        if peak > 0:
            dd = max(dd, (peak - v) / peak)
    return dd * 100


def sharpe(curve: list[float], periods_per_year: int = 8760) -> float:
    """Geannualiseerde Sharpe op basis van per-candle returns (risicovrije voet 0)."""
    if len(curve) < 3:
        return float("nan")
    rets = [(curve[i] / curve[i - 1] - 1) for i in range(1, len(curve)) if curve[i - 1] > 0]
    mean = sum(rets) / len(rets)
    var = sum((r - mean) ** 2 for r in rets) / (len(rets) - 1)
    sd = math.sqrt(var)
    if sd == 0:
        return float("nan")
    return mean / sd * math.sqrt(periods_per_year)


# ── parameter-grids voor walk-forward (bewust klein: minder overfitting) ──

PARAM_GRIDS: dict[str, list[dict]] = {
    "dca": [{"every_hours": h} for h in (12, 24, 48)],
    "momentum_ma_cross": [{"fast": f, "slow": s, "rsi_max": r}
                          for f, s in ((9, 21), (12, 26), (20, 50)) for r in (65, 75)],
    "grid": [{"levels": lv, "band_k": k} for lv in (4, 6, 8) for k in (1.5, 2.0, 2.5)],
}


def score(result: dict) -> float:
    """Selectiecriterium voor walk-forward: Sharpe, met rendement als tiebreaker."""
    sh = result["sharpe"]
    return (sh if not math.isnan(sh) else -99) + result["return_pct"] / 10_000
