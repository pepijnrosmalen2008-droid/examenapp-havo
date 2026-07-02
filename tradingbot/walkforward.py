#!/usr/bin/env python3
"""Walk-forward validatie — rollend train/test-schema in plaats van één grote backtest.

Per venster: optimaliseer strategie-parameters op de trainperiode (klein grid, zie
autopilot/backtesting.PARAM_GRIDS), handel daarna out-of-sample op de testperiode met
die parameters, en schakel door naar het volgende venster. Het aaneengeschakelde
out-of-sample resultaat is de eerlijkste maatstaf: elke handelsdag is gehandeld met
parameters die op dat moment alléén op verleden data gekozen waren.

Gebruik:
    python walkforward.py --strategy momentum_ma_cross --from 2023-01-01 --to 2025-12-31
    (opties: --train-days 180 --test-days 60 --csv-dir DATA)
"""

from __future__ import annotations

import argparse
import logging
import math
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from autopilot.backtesting import (PARAM_GRIDS, WARMUP_CANDLES, buy_and_hold,
                                   max_drawdown, run_backtest, score, sharpe, slice_data)
from autopilot.config import load_config

DAY_MS = 86_400_000


def walk_forward(cfg, strategy: str, data, *, train_days: int, test_days: int) -> dict:
    timeline = sorted(set.intersection(*(set(c.ts for c in s) for s in data.values())))
    first_ts, last_ts = timeline[0] + WARMUP_CANDLES * 3_600_000, timeline[-1]
    grid = PARAM_GRIDS[strategy]

    windows = []
    cursor = first_ts
    while cursor + (train_days + test_days) * DAY_MS <= last_ts + DAY_MS:
        windows.append((cursor, cursor + train_days * DAY_MS,
                        cursor + (train_days + test_days) * DAY_MS))
        cursor += test_days * DAY_MS
    if not windows:
        sys.exit("FOUT: periode te kort voor dit train/test-schema")

    capital = cfg.capital_eur
    oos_curve: list[float] = []
    rows = []
    for i, (t0, t1, t2) in enumerate(windows, 1):
        train = slice_data(data, t0, t1)
        best, best_params = None, grid[0]
        for params in grid:
            res = run_backtest(cfg, strategy, train, params=params)
            if best is None or score(res) > score(best):
                best, best_params = res, params

        test = slice_data(data, t1, t2)
        oos = run_backtest(cfg, strategy, test, params=best_params, capital=capital)
        rows.append({"window": i,
                     "train": f"{_d(t0)}→{_d(t1)}", "test": f"{_d(t1)}→{_d(t2)}",
                     "params": best_params, "train_ret": best["return_pct"],
                     "oos_ret": oos["return_pct"], "oos_dd": oos["max_dd_pct"],
                     "trades": oos["trades"], "halted": bool(oos["halted_at"])})
        # kapitaal doorschuiven naar het volgende venster (aaneengeschakeld OOS-resultaat)
        oos_curve.extend(e for _, e in oos["equity_curve"])
        capital = oos["final_equity"]
        print(f"  venster {i}/{len(windows)}: params {best_params}  "
              f"train {best['return_pct']:+.1f}%  OOS {oos['return_pct']:+.1f}%"
              f"{'  ⛔' if oos['halted_at'] else ''}", flush=True)

    oos_start, oos_end = windows[0][1], windows[-1][2]
    bh = buy_and_hold(cfg, slice_data(data, oos_start, oos_end))
    return {"rows": rows, "final": capital,
            "oos_return_pct": (capital / cfg.capital_eur - 1) * 100,
            "oos_max_dd_pct": max_drawdown(oos_curve), "oos_sharpe": sharpe(oos_curve),
            "bh_return_pct": bh["return_pct"], "bh_max_dd_pct": bh["max_dd_pct"]}


def _d(ts: int) -> str:
    return datetime.fromtimestamp(ts / 1000, tz=timezone.utc).strftime("%Y-%m-%d")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--strategy", required=True, choices=list(PARAM_GRIDS))
    ap.add_argument("--from", dest="start", required=True)
    ap.add_argument("--to", dest="end", required=True)
    ap.add_argument("--train-days", type=int, default=180)
    ap.add_argument("--test-days", type=int, default=60)
    ap.add_argument("--csv-dir", type=Path)
    ap.add_argument("--config", default=str(ROOT / "config.yaml"))
    args = ap.parse_args()
    logging.basicConfig(level=logging.CRITICAL)

    from backtest import load_data  # hergebruik van dataloader + cache
    cfg = load_config(args.config)
    start_ms = int(datetime.fromisoformat(args.start).replace(tzinfo=timezone.utc).timestamp() * 1000)
    end_ms = int(datetime.fromisoformat(args.end).replace(tzinfo=timezone.utc).timestamp() * 1000)
    data = load_data(cfg, "1h", start_ms, end_ms, args.csv_dir)

    print(f"Walk-forward {args.strategy}: train {args.train_days}d → test {args.test_days}d, "
          f"grid {len(PARAM_GRIDS[args.strategy])} combinaties")
    t0 = time.monotonic()
    res = walk_forward(cfg, args.strategy, data,
                       train_days=args.train_days, test_days=args.test_days)
    print(f"\n{'venster':<8} {'test-periode':<24} {'params':<38} {'train':>7} {'OOS':>7}")
    print("─" * 90)
    for r in res["rows"]:
        print(f"{r['window']:<8} {r['test']:<24} {str(r['params']):<38} "
              f"{r['train_ret']:>+6.1f}% {r['oos_ret']:>+6.1f}%{' ⛔' if r['halted'] else ''}")

    consistent = sum(1 for r in res["rows"] if r["oos_ret"] > 0)
    sh = f"{res['oos_sharpe']:.2f}" if not math.isnan(res["oos_sharpe"]) else "—"
    print(f"\nOut-of-sample totaal: {res['oos_return_pct']:+.2f}% "
          f"(max DD {res['oos_max_dd_pct']:.2f}%, Sharpe {sh}, "
          f"{consistent}/{len(res['rows'])} vensters positief)")
    print(f"Buy-and-hold zelfde periode: {res['bh_return_pct']:+.2f}% "
          f"(max DD {res['bh_max_dd_pct']:.2f}%)")
    print(f"Klaar in {time.monotonic() - t0:.0f}s.")
    print("\nLees dit zo: presteert de strategie alleen in-sample goed (train ≫ OOS), "
          "dan is het grid aan het overfitten en heeft de strategie geen echte edge.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
