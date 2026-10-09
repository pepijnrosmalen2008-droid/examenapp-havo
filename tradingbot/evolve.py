#!/usr/bin/env python3
"""Evolutie-laag — de bot schrijft zijn EIGEN strategie-code, toetst die offline en wiret de
overlevers (gated) in de live-arena. Mislukkelingen rollen vanzelf terug.

Draai dit periodiek/offline om nieuwe zelf-geschreven strategieën te laten ontstaan. De gegenereerde
modules komen in autopilot/strategies/generated/ te staan (echte .py-bestanden, versiebeheer). Ze
krijgen in de live-bot pas ECHT kapitaal als ze zich forward-only bewijzen — de risk-engine en de
arena blijven de enige poorten naar je saldo. Zelf-geschreven code raakt nooit de risk-/order-laag.

Gebruik:
    python evolve.py --from 2023-01-01 --to 2025-12-31 --n 20        # 20 varianten verzinnen/toetsen
    python evolve.py --from ... --to ... --db autopilot_allin.db      # schrijf naar die db
    python evolve.py --from ... --to ... --csv-dir ./data             # offline data
    python evolve.py --promote-research --db autopilot_allin.db       # onderzoeks-kandidaten → code
    python evolve.py --show --db autopilot_allin.db                   # toon de zelf-geschreven laag

Data laadt via dezelfde cache/CSV-weg als backtest.py (publieke Bitvavo API, geen key nodig).
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from autopilot import evolution
from autopilot.config import load_config
from autopilot.database import Database
from autopilot.exchange import INTERVAL_MS
from backtest import load_data

STATUS_ICON = {"actief": "✅", "kandidaat": "🧪", "retired": "✗"}


def print_generated(db: Database) -> None:
    rows = db.generated_all()
    summ = db.generated_summary()
    print(f"\nZelf-geschreven strategieën ({sum(summ.values())}): "
          + (", ".join(f"{v}× {k}" for k, v in sorted(summ.items())) or "nog geen") + "\n")
    if not rows:
        print("  (de bot heeft nog geen eigen code geschreven — draai met --from/--to)")
        return
    print(f"  {'':<2} {'naam':<22} {'excess':>8} {'bron':<10} {'module':<22} status/reden")
    print("  " + "─" * 86)
    for r in rows:
        icon = STATUS_ICON.get(r["status"], "?")
        ex = f"{r['excess_pct']:+.1f}%" if r["excess_pct"] is not None else "—"
        detail = r["status"] if r["status"] != "retired" else f"retired — {r['reason'] or ''}"
        print(f"  {icon:<2} {r['name']:<22} {ex:>8} {r['parent'] or '':<10} {r['module']:<22} {detail}")
    print("\nActieve + kandidaat-modules doen in de live-bot mee in de arena, maar krijgen pas echt "
          "kapitaal als ze zich forward-only bewijzen. De risk-engine blijft er onafhankelijk omheen.")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--from", dest="start", help="YYYY-MM-DD")
    ap.add_argument("--to", dest="end", help="YYYY-MM-DD")
    ap.add_argument("--n", type=int, default=12, help="aantal varianten om te verzinnen en te toetsen")
    ap.add_argument("--seed", type=int, default=1, help="random seed voor de variant-generator")
    ap.add_argument("--interval", default="1h", choices=list(INTERVAL_MS))
    ap.add_argument("--shuffles", type=int, default=40)
    ap.add_argument("--csv-dir", type=Path, help="offline data i.p.v. Bitvavo API")
    ap.add_argument("--config", default=str(ROOT / "config.yaml"))
    ap.add_argument("--db", default=str(ROOT / "autopilot.db"))
    ap.add_argument("--promote-research", action="store_true",
                    help="zet bestaande onderzoeks-kandidaten om in zelf-geschreven modules (geen data nodig)")
    ap.add_argument("--show", action="store_true", help="alleen de zelf-geschreven laag tonen")
    args = ap.parse_args()

    db = Database(args.db)
    if args.show:
        print_generated(db)
        db.close()
        return 0

    logging.basicConfig(level=logging.INFO, format="%(message)s")

    if args.promote_research:
        written = evolution.promote_from_research(db)
        print(f"{len(written)} onderzoeks-kandidaat(en) omgezet in zelf-geschreven code.")
        print_generated(db)
        db.close()
        return 0

    if not args.start or not args.end:
        ap.error("--from en --to zijn vereist (of gebruik --show / --promote-research)")

    cfg = load_config(args.config)
    start_ms = int(datetime.fromisoformat(args.start).replace(tzinfo=timezone.utc).timestamp() * 1000)
    end_ms = int(datetime.fromisoformat(args.end).replace(tzinfo=timezone.utc).timestamp() * 1000)

    print(f"Evolutie {args.start} → {args.end} | pairs: {', '.join(cfg.pairs)} | db: {args.db}")
    data = load_data(cfg, args.interval, start_ms, end_ms, args.csv_dir)
    cfg.pairs = list(data)

    print(f"{args.n} varianten verzinnen en streng toetsen (dit kan even duren) …\n")
    t0 = time.monotonic()
    survivors = evolution.evolve_once(cfg, db, data, n=args.n, seed=args.seed, shuffles=args.shuffles)
    print(f"\n{len(survivors)} variant(en) overleefden alle toetsen en zijn als code geschreven "
          f"({time.monotonic() - t0:.0f}s).")
    for s in survivors:
        print(f"   ✅ {s['name']}  (excess {s['excess_pct']:+.1f}%)  → {s['module']}")
    print_generated(db)
    db.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
