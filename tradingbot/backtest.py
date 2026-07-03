#!/usr/bin/env python3
"""Backtester — replayt historische candles door de ÉCHTE engine (incl. risk engine,
kill switches, fees en slippage), zodat backtest en live-gedrag niet uiteenlopen.

Gebruik:
    python backtest.py --strategy momentum_ma_cross --from 2023-01-01 --to 2025-12-31
    python backtest.py --all --from 2023-01-01 --to 2025-12-31       # alle 3 + buy-and-hold
    python backtest.py --strategy grid --monte-carlo 50 --from ... --to ...

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

from autopilot.backtesting import (WARMUP_CANDLES, buy_and_hold, run_backtest)
from autopilot.config import AppConfig, load_config
from autopilot.database import Database
from autopilot.exchange import INTERVAL_MS, MarketData
from autopilot.models import Candle

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
    many = len(cfg.pairs) > 3  # bij een mand: één ontbrekende/delistte coin niet fataal
    for pair in cfg.pairs:
        if csv_dir:
            path = csv_dir / f"{pair}-{interval}.csv"
            if not path.exists():
                if many:
                    print(f"  overslaan {pair}: {path} niet gevonden")
                    continue
                sys.exit(f"FOUT: {path} niet gevonden")
            candles = [c for c in load_csv(path) if start_ms <= c.ts < end_ms]
        else:
            candles = fetch_candles(pair, interval, start_ms, end_ms)
        if len(candles) < 24 * 35:
            if many:
                print(f"  overslaan {pair}: te weinig data ({len(candles)} candles)")
                continue
            sys.exit(f"FOUT: te weinig data voor {pair} ({len(candles)} candles); "
                     "minimaal ~35 dagen nodig (strategy warm-up)")
        data[pair] = candles
    if len(data) < 2:
        sys.exit(f"FOUT: te weinig bruikbare markten ({len(data)}); een cross-sectional "
                 "test heeft er meerdere nodig")
    return data


def print_results(results: list[dict]) -> None:
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


# ══════════ CLI ══════════

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--strategy", choices=["dca", "momentum_ma_cross", "grid", "cross_sectional"])
    ap.add_argument("--all", action="store_true", help="alle drie de strategieën + buy-and-hold")
    ap.add_argument("--monte-carlo", type=int, metavar="N",
                    help="N gebootstrapte marktscenario's i.p.v. één historische run")
    ap.add_argument("--from", dest="start", required=True, help="YYYY-MM-DD")
    ap.add_argument("--to", dest="end", required=True, help="YYYY-MM-DD")
    ap.add_argument("--interval", default="1h", choices=list(INTERVAL_MS))
    ap.add_argument("--csv-dir", type=Path, help="offline data i.p.v. Bitvavo API")
    ap.add_argument("--config", default=str(ROOT / "config.yaml"))
    ap.add_argument("--seed", type=int, default=1, help="random seed voor Monte Carlo")
    args = ap.parse_args()
    if not args.all and not args.strategy:
        ap.error("kies --strategy of --all")
    if args.monte_carlo and not args.strategy:
        ap.error("--monte-carlo vereist --strategy")
    logging.basicConfig(level=logging.CRITICAL)  # geen per-order lognoise tijdens een backtest

    cfg = load_config(args.config)
    start_ms = int(datetime.fromisoformat(args.start).replace(tzinfo=timezone.utc).timestamp() * 1000)
    end_ms = int(datetime.fromisoformat(args.end).replace(tzinfo=timezone.utc).timestamp() * 1000)

    print(f"Backtest {args.start} → {args.end} | pairs: {', '.join(cfg.pairs)} | "
          f"kapitaal €{cfg.capital_eur:.0f} | taker {cfg.costs.taker_fee_pct}% + "
          f"slippage {cfg.costs.slippage_pct}%")
    data = load_data(cfg, args.interval, start_ms, end_ms, args.csv_dir)

    if args.monte_carlo:
        from autopilot.montecarlo import run_monte_carlo
        run_monte_carlo(cfg, args.strategy, data, n=args.monte_carlo, seed=args.seed)
        return 0

    names = ["dca", "momentum_ma_cross", "grid"] if args.all else [args.strategy]
    results = []
    for name in names:
        t0 = time.monotonic()
        print(f"\n▶ {name} …", flush=True)
        res = run_backtest(cfg, name, data, WARMUP_CANDLES)
        print(f"  klaar in {time.monotonic() - t0:.1f}s")
        results.append(res)
    results.append(buy_and_hold(cfg, data, WARMUP_CANDLES))
    print_results(results)
    return 0


if __name__ == "__main__":
    sys.exit(main())
