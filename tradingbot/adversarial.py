#!/usr/bin/env python3
"""Adversariële toets — probeert de 'edge' van een strategie kapot te maken.

Draait vier aanvallen op een strategie via de bestaande backtester (historische candles):
cost-stress, shuffle (null-verdeling), delay (timing), en universe/leave-one-out. Een edge
die alle vier overleeft is pas het overwegen waard.

Gebruik:
    python adversarial.py --strategy cross_sectional --config config.basket.yaml \
        --from 2021-01-01 --to 2025-12-31
    (opties: --shuffles 40 --delay-hours 6 --seed 1 --csv-dir DATA)

Let op: dit draait tientallen backtests achter elkaar en kan enkele minuten duren.
"""

from __future__ import annotations

import argparse
import logging
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from autopilot.adversarial import run_all
from autopilot.backtesting import WARMUP_CANDLES
from autopilot.config import load_config
from autopilot.exchange import INTERVAL_MS
from backtest import load_data


def _fmt(results: dict) -> None:
    r = results
    print(f"\n══════ ADVERSARIËLE TOETS — {r['strategy']} ══════")
    print(f"Basis-excess vs. buy-and-hold: {r['real_excess']:+.2f}%\n")

    print("1· Cost-stress (fees+spread+slippage ×):")
    for m, e in r["cost_stress"]:
        print(f"     ×{m:<3g}  excess {e:+.2f}%")
    print()

    s = r["shuffle"]
    print(f"2· Shuffle ({s['n']} ruis-werelden): gemiddelde excess {s['shuffle_mean']:+.2f}%, "
          f"p95 {s['shuffle_p95']:+.2f}%")
    print(f"     → p_luck = {s['p_luck']:.2f}  "
          f"({'niet te onderscheiden van toeval' if s['p_luck'] > 0.10 else 'boven de ruis'})\n")

    d_delta = r["delay_excess"] - r["real_excess"]
    print(f"3· Delay (verouderde candles): excess {r['delay_excess']:+.2f}% (Δ {d_delta:+.2f}pp)")
    if abs(d_delta) < 0.01:
        print("     → geen effect: waarschijnlijk een dag-strategie; probeer --delay-hours 24")
    print()

    if r["universe_loo"]:
        print("4· Universe / leave-one-out (laat telkens één coin weg):")
        for drop, e in r["universe_loo"]:
            print(f"     zonder {drop:<12} excess {e:+.2f}%")
        print()

    print("─" * 56)
    if r["flags"]:
        print(f"VERDICT: {r['verdict']}")
        for f in r["flags"]:
            print(f"   ✗ {f}")
    else:
        print(f"VERDICT: {r['verdict']}")
    print("\nEen falsificatie-machine probeert edges te breken, niet te bevestigen. "
          "Dit zegt niets over toekomstig rendement.")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--strategy", required=True,
                    choices=["dca", "momentum_ma_cross", "grid", "cross_sectional", "vol_target"])
    ap.add_argument("--from", dest="start", required=True, help="YYYY-MM-DD")
    ap.add_argument("--to", dest="end", required=True, help="YYYY-MM-DD")
    ap.add_argument("--interval", default="1h", choices=list(INTERVAL_MS))
    ap.add_argument("--shuffles", type=int, default=40)
    ap.add_argument("--delay-hours", type=int, default=6)
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--csv-dir", type=Path)
    ap.add_argument("--config", default=str(ROOT / "config.yaml"))
    args = ap.parse_args()
    logging.basicConfig(level=logging.CRITICAL)

    cfg = load_config(args.config)
    start_ms = int(datetime.fromisoformat(args.start).replace(tzinfo=timezone.utc).timestamp() * 1000)
    end_ms = int(datetime.fromisoformat(args.end).replace(tzinfo=timezone.utc).timestamp() * 1000)

    print(f"Adversariële toets {args.start} → {args.end} | {args.strategy} | "
          f"pairs: {', '.join(cfg.pairs)}")
    data = load_data(cfg, args.interval, start_ms, end_ms, args.csv_dir)
    cfg.pairs = list(data)

    t0 = time.monotonic()
    results = run_all(cfg, args.strategy, data, shuffles=args.shuffles,
                      lag=args.delay_hours, warmup=WARMUP_CANDLES, seed=args.seed)
    _fmt(results)
    print(f"\n(klaar in {time.monotonic() - t0:.0f}s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
