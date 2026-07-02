#!/usr/bin/env python3
"""Backtester — replayt historische candles door de ÉCHTE engine (incl. risk engine,
kill switches, fees en slippage), zodat backtest en live-gedrag niet uiteenlopen.

Gebruik:
    python backtest.py --strategy momentum_ma_cross --from 2023-01-01 --to 2025-12-31
    python backtest.py --all --from 2023-01-01 --to 2025-12-31     # alle 3 + buy-and-hold

Data komt van de publieke Bitvavo API (geen key nodig) met rate-limit respect en
lokale caching in data-cache/backtest_cache.db. Offline kan met --csv-dir:
CSV's heten {PAIR}-{interval}.csv met kolommen ts_ms,open,high,low,close,volume.
"""

from __future__ import annotations

import argparse
import csv
import logging
import math
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from autopilot.config import AppConfig, TradingMode, load_config
from autopilot.database import Database
from autopilot.engine import TradingEngine
from autopilot.exchange import INTERVAL_MS, MarketData, PaperExchange
from autopilot.models import Candle
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy

CACHE_DIR = ROOT / "data-cache"


# ══════════ data laden ══════════

def fetch_candles(pair: str, interval: str, start_ms: int, end_ms: int) -> list[Candle]:
    """Publieke Bitvavo API via ccxt, gepagineerd, met lokale cache."""
    CACHE_DIR.mkdir(exist_ok=True)
    cache = Database(CACHE_DIR / "backtest_cache.db")
    step = INTERVAL_MS[interval]
    expected = (end_ms - start_ms) // step
    cached = cache.cached_candles(pair, interval, start_ms, end_ms)
    if len(cached) >= expected * 0.99:  # cache is (vrijwel) compleet — kleine gaten zijn normaal
        cache.close()
        return [Candle(*c) for c in cached]

    print(f"  {pair}: candles ophalen van Bitvavo ({datetime.fromtimestamp(start_ms/1000, tz=timezone.utc):%Y-%m-%d} → "
          f"{datetime.fromtimestamp(end_ms/1000, tz=timezone.utc):%Y-%m-%d}) …")
    md = MarketData()
    cursor = start_ms
    fetched = 0
    while cursor < end_ms:
        batch = md.candles(pair, interval, limit=1000, since_ms=cursor)
        batch = [c for c in batch if c[0] < end_ms]
        if not batch:
            break
        cache.cache_candles(pair, interval, batch)
        fetched += len(batch)
        cursor = batch[-1][0] + step
        time.sleep(0.3)  # ruim binnen de Bitvavo rate limits (ccxt throttlet zelf ook)
    print(f"  {pair}: {fetched} candles opgehaald en gecachet")
    out = cache.cached_candles(pair, interval, start_ms, end_ms)
    cache.close()
    return [Candle(*c) for c in out]


def load_csv(path: Path) -> list[Candle]:
    with open(path, newline="") as f:
        rows = list(csv.reader(f))
    if rows and not rows[0][0].strip().isdigit():
        rows = rows[1:]  # header
    return [Candle(int(r[0]), float(r[1]), float(r[2]), float(r[3]), float(r[4]), float(r[5]))
            for r in rows]


def load_data(cfg: AppConfig, interval: str, start_ms: int, end_ms: int,
              csv_dir: Path | None) -> dict[str, list[Candle]]:
    data = {}
    for pair in cfg.pairs:
        if csv_dir:
            path = csv_dir / f"{pair}-{interval}.csv"
            if not path.exists():
                sys.exit(f"FOUT: {path} niet gevonden")
            candles = [c for c in load_csv(path) if start_ms <= c.ts < end_ms]
        else:
            candles = fetch_candles(pair, interval, start_ms, end_ms)
        if len(candles) < 24 * 35:
            sys.exit(f"FOUT: te weinig data voor {pair} ({len(candles)} candles); "
                     "minimaal ~35 dagen nodig (strategy warm-up)")
        data[pair] = candles
    return data


# ══════════ replay ══════════

class ReplayMarket:
    """Speelt candles af; 'ticker' = close van de huidige candle. Geen look-ahead."""

    def __init__(self, data: dict[str, list[Candle]]):
        self.data = data
        self.index: dict[str, int] = {p: 0 for p in data}

    def seek(self, ts: int) -> None:
        for pair, series in self.data.items():
            i = self.index[pair]
            while i + 1 < len(series) and series[i + 1].ts <= ts:
                i += 1
            self.index[pair] = i

    def ticker_price(self, pair: str) -> float:
        return self.data[pair][self.index[pair]].close

    def candles(self, pair: str, interval: str = "1h", limit: int = 200, since_ms=None):
        i = self.index[pair]
        return self.data[pair][max(0, i + 1 - limit): i + 1]


def run_backtest(cfg: AppConfig, strategy_name: str, data: dict[str, list[Candle]],
                 warmup: int) -> dict:
    cfg = cfg.model_copy(deep=True)
    cfg.strategy.name = strategy_name  # type: ignore[assignment]

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

    # metrics
    orders = [dict(o) for o in db.recent_orders(100000) if o["status"] == "FILLED"]
    closed = db.conn.execute(
        "SELECT realized_pnl_eur FROM positions WHERE realized_pnl_eur IS NOT NULL").fetchall()
    wins = sum(1 for r in closed if r["realized_pnl_eur"] > 0)
    final = equity_curve[-1][1] if equity_curve else cfg.capital_eur
    db.close()
    return {
        "strategy": strategy_name,
        "final_equity": final,
        "return_pct": (final / cfg.capital_eur - 1) * 100,
        "max_dd_pct": max_drawdown([e for _, e in equity_curve]),
        "trades": len(orders),
        "win_rate": (wins / len(closed) * 100) if closed else float("nan"),
        "sharpe": sharpe([e for _, e in equity_curve]),
        "halted_at": halted_at,
    }


def buy_and_hold(cfg: AppConfig, data: dict[str, list[Candle]], warmup: int) -> dict:
    """Gelijk verdeeld over de pairs kopen op de eerste candle, aanhouden tot de laatste."""
    fee = cfg.costs.taker_fee_pct / 100
    slip = cfg.costs.slippage_pct / 100
    per_pair = cfg.capital_eur / len(data)
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
        "final_equity": final,
        "return_pct": (final / cfg.capital_eur - 1) * 100,
        "max_dd_pct": max_drawdown(curve),
        "trades": len(data),
        "win_rate": float("nan"),
        "sharpe": sharpe(curve),
        "halted_at": None,
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


# ══════════ CLI ══════════

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--strategy", choices=["dca", "momentum_ma_cross", "grid"])
    ap.add_argument("--all", action="store_true", help="alle drie de strategieën + buy-and-hold")
    ap.add_argument("--from", dest="start", required=True, help="YYYY-MM-DD")
    ap.add_argument("--to", dest="end", required=True, help="YYYY-MM-DD")
    ap.add_argument("--interval", default="1h", choices=list(INTERVAL_MS))
    ap.add_argument("--csv-dir", type=Path, help="offline data i.p.v. Bitvavo API")
    ap.add_argument("--config", default=str(ROOT / "config.yaml"))
    args = ap.parse_args()
    if not args.all and not args.strategy:
        ap.error("kies --strategy of --all")
    logging.basicConfig(level=logging.CRITICAL)  # geen per-order lognoise tijdens een backtest

    cfg = load_config(args.config)
    start_ms = int(datetime.fromisoformat(args.start).replace(tzinfo=timezone.utc).timestamp() * 1000)
    end_ms = int(datetime.fromisoformat(args.end).replace(tzinfo=timezone.utc).timestamp() * 1000)

    print(f"Backtest {args.start} → {args.end} | pairs: {', '.join(cfg.pairs)} | "
          f"kapitaal €{cfg.capital_eur:.0f} | taker {cfg.costs.taker_fee_pct}% + "
          f"slippage {cfg.costs.slippage_pct}%")
    data = load_data(cfg, args.interval, start_ms, end_ms, args.csv_dir)
    warmup = 24 * 30  # 30 dagen warm-up zodat elke strategie dezelfde startdatum handelt

    names = ["dca", "momentum_ma_cross", "grid"] if args.all else [args.strategy]
    results = []
    for name in names:
        t0 = time.monotonic()
        print(f"\n▶ {name} …", flush=True)
        res = run_backtest(cfg, name, data, warmup)
        print(f"  klaar in {time.monotonic() - t0:.1f}s")
        results.append(res)
    results.append(buy_and_hold(cfg, data, warmup))

    print(f"\n{'strategie':<20} {'eind':>10} {'rendement':>10} {'max DD':>8} "
          f"{'trades':>7} {'win%':>6} {'Sharpe':>7}")
    print("─" * 74)
    for r in results:
        wr = f"{r['win_rate']:.0f}" if not math.isnan(r["win_rate"]) else "—"
        sh = f"{r['sharpe']:.2f}" if not math.isnan(r["sharpe"]) else "—"
        halt = "  ⛔ gestopt" if r["halted_at"] else ""
        print(f"{r['strategy']:<20} €{r['final_equity']:>9.2f} {r['return_pct']:>9.2f}% "
              f"{r['max_dd_pct']:>7.2f}% {r['trades']:>7} {wr:>6} {sh:>7}{halt}")
    print("\nLet op: resultaten uit het verleden zeggen niets over de toekomst. "
          "De bot belooft geen rendement.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
