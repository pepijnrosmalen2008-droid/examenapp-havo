#!/usr/bin/env python3
"""Autonome onderzoeker — draait de hypothese-generator offline over historische data, toetst elke
hypothese streng (backtest + buy-and-hold + adversariële suite) en schrijft het oordeel naar de
`research_log`-tabel van de opgegeven database.

Dit raakt het live-pad NIET aan: de onderzoeker alloceert nooit echt geld. Hij rapporteert alleen
welke (strategie, parameters) zich als 'kandidaat' bewijzen — die zet je daarna *handmatig* in de
live-roster als je ze vertrouwt. Zo blijft de arena de enige router van echt kapitaal.

Gebruik:
    python research.py --from 2023-01-01 --to 2025-12-31                 # alle strategieën
    python research.py --from ... --to ... --strategy adaptive           # één strategie
    python research.py --from ... --to ... --db autopilot_allin.db       # schrijf naar die db
    python research.py --from ... --to ... --csv-dir ./data              # offline
    python research.py --show --db autopilot_allin.db                    # alleen het register tonen

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

from autopilot import researcher
from autopilot.config import load_config
from autopilot.database import Database
from autopilot.exchange import INTERVAL_MS
from backtest import load_data   # hergebruik exact dezelfde data-laadweg (cache/CSV/skip-logica)

VERDICT_ICON = {"kandidaat": "✅", "verworpen": "✗", "inconclusief": "·"}


def print_register(db: Database, limit: int = 50) -> None:
    rows = db.recent_research(limit)
    summ = db.research_summary()
    print(f"\nRegister ({sum(summ.values())} hypotheses getoetst): "
          + ", ".join(f"{v}× {k}" for k, v in sorted(summ.items())) + "\n")
    if not rows:
        print("  (nog niets getoetst)")
        return
    print(f"  {'':<2} {'strategie':<18} {'rend.':>8} {'hold':>8} {'excess':>8} {'trades':>7}  params / vlaggen")
    print("  " + "─" * 88)
    for r in rows:
        icon = VERDICT_ICON.get(r["verdict"], "?")
        flags = ", ".join(json.loads(r["flags"] or "[]"))
        detail = flags if flags else (r["params"] or "")
        rp = f"{r['return_pct']:.1f}%" if r["return_pct"] is not None else "—"
        hp = f"{r['hold_pct']:.1f}%" if r["hold_pct"] is not None else "—"
        ep = f"{r['excess_pct']:+.1f}%" if r["excess_pct"] is not None else "—"
        print(f"  {icon:<2} {r['strategy']:<18} {rp:>8} {hp:>8} {ep:>8} {r['trades'] or 0:>7}  {detail}")
    kand = researcher.promoted(db)
    if kand:
        print(f"\n  {len(kand)} kandidaat/kandidaten overleven alle toetsen — review ze vóór je ze "
              "handmatig in de live-roster zet. De onderzoeker zet ze NOOIT automatisch live.")
    print("\nLet op: resultaten uit het verleden zeggen niets over de toekomst.")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--from", dest="start", help="YYYY-MM-DD")
    ap.add_argument("--to", dest="end", help="YYYY-MM-DD")
    ap.add_argument("--strategy", action="append", choices=sorted(researcher.PARAM_GRID),
                    help="beperk tot deze strategie(ën); herhaalbaar. Default: alle.")
    ap.add_argument("--interval", default="1h", choices=list(INTERVAL_MS))
    ap.add_argument("--csv-dir", type=Path, help="offline data i.p.v. Bitvavo API")
    ap.add_argument("--config", default=str(ROOT / "config.yaml"))
    ap.add_argument("--db", default=str(ROOT / "autopilot.db"), help="database om naar te schrijven")
    ap.add_argument("--limit", type=int, help="stop na zoveel nieuwe hypotheses")
    ap.add_argument("--shuffles", type=int, default=40, help="aantal shuffle-runs in de p_luck-toets")
    ap.add_argument("--rerun", action="store_true", help="toets ook al eerder geziene hypotheses opnieuw")
    ap.add_argument("--show", action="store_true", help="alleen het register tonen, niets toetsen")
    args = ap.parse_args()

    db = Database(args.db)
    if args.show:
        print_register(db)
        db.close()
        return 0

    if not args.start or not args.end:
        ap.error("--from en --to zijn vereist (of gebruik --show)")
    logging.basicConfig(level=logging.INFO, format="%(message)s")

    cfg = load_config(args.config)
    start_ms = int(datetime.fromisoformat(args.start).replace(tzinfo=timezone.utc).timestamp() * 1000)
    end_ms = int(datetime.fromisoformat(args.end).replace(tzinfo=timezone.utc).timestamp() * 1000)

    print(f"Onderzoek {args.start} → {args.end} | pairs: {', '.join(cfg.pairs)} | "
          f"db: {args.db}")
    data = load_data(cfg, args.interval, start_ms, end_ms, args.csv_dir)
    cfg.pairs = list(data)

    todo = researcher.hypotheses(args.strategy)
    print(f"{len(todo)} hypotheses in de ruimte; toetsen (dit kan even duren) …\n")
    t0 = time.monotonic()
    results = researcher.research_once(
        cfg, db, data, strategies=args.strategy, limit=args.limit,
        shuffles=args.shuffles, skip_seen=not args.rerun)
    print(f"\n{len(results)} nieuwe hypotheses getoetst in {time.monotonic() - t0:.0f}s")
    print_register(db)
    db.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
