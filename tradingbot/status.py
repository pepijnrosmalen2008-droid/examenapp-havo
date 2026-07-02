#!/usr/bin/env python3
"""CLI: toon de huidige bot-state uit SQLite (en optioneel je echte Bitvavo-saldo).

Gebruik:
    python status.py                  # state uit de lokale database
    python status.py --balance       # + echt saldo via view-only API key (.env)
    python status.py --clear-halt    # hef de permanente drawdown-stop op (handmatige herstart)
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv

from autopilot.config import load_config
from autopilot.database import Database

DB_PATH = Path(__file__).parent / "autopilot.db"


def eur(x: float | None) -> str:
    return f"€{x:,.2f}" if x is not None else "—"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--balance", action="store_true", help="haal echt saldo op via Bitvavo API (view-only key volstaat)")
    ap.add_argument("--clear-halt", action="store_true", help="hef de permanente drawdown-stop op")
    ap.add_argument("--db", default=str(DB_PATH))
    args = ap.parse_args()

    load_dotenv(Path(__file__).parent / ".env")
    cfg = load_config()
    db = Database(args.db)

    if args.clear_halt:
        if db.get_meta("halted") != "1":
            print("Bot is niet gestopt door de drawdown-kill-switch; niets te doen.")
        else:
            db.del_meta("halted")
            db.del_meta("halt_reason")
            print("Drawdown-stop opgeheven. De bot mag weer starten (handmatige herstart vereist).")
        return 0

    print("═" * 62)
    print(" AUTOPILOT STATUS")
    print("═" * 62)
    mode = db.get_meta("mode", cfg.mode.value)
    print(f" Mode:            {mode}")
    print(f" Strategie:       {cfg.strategy.name}")
    print(f" Pairs:           {', '.join(cfg.pairs)}")
    print(f" Startkapitaal:   {eur(db.get_meta_float('starting_capital', cfg.capital_eur))}")

    halted = db.get_meta("halted") == "1"
    paused_until = db.get_meta("paused_until")
    if halted:
        print(f" ⛔ GESTOPT (max drawdown): {db.get_meta('halt_reason', '')}")
        print("    Herstart handmatig met: python status.py --clear-halt")
    if paused_until:
        print(f" ⏸  Dag-kill-switch actief tot {paused_until} (UTC)")

    snap = db.last_equity()
    if snap:
        start = db.get_meta_float("starting_capital", cfg.capital_eur)
        pnl = snap["equity_eur"] - start
        print(f"\n Laatste equity:  {eur(snap['equity_eur'])}  (cash {eur(snap['cash_eur'])})  "
              f"P&L: {eur(pnl)} ({pnl / start * 100:+.2f}%)  @ {snap['ts']}")
    else:
        print("\n Nog geen equity-snapshots (bot heeft nog niet gedraaid).")

    positions = db.open_positions()
    print(f"\n Open posities ({len(positions)}):")
    for p in positions:
        print(f"   {p.pair:<10} {p.amount:.8f} @ gem. {eur(p.avg_price)}  (sinds {p.opened_at})")
    if not positions:
        print("   (geen)")

    orders = db.recent_orders(10)
    print(f"\n Laatste orders ({len(orders)}):")
    for o in orders:
        print(f"   {o['created_at']}  {o['side']:<4} {o['pair']:<10} "
              f"{eur(o['amount_eur'])}  {o['status']:<9} {o['reason'] or ''}")
    if not orders:
        print("   (geen)")

    if mode == "PAPER":
        balances = db.paper_balances()
        if balances:
            print("\n Paper-balansen:")
            for asset, amount in sorted(balances.items()):
                if amount > 0:
                    print(f"   {asset:<6} {amount:.8f}")

    if args.balance:
        print("\n Echt Bitvavo-saldo (view-only):")
        try:
            from autopilot.exchange import BitvavoClient
            client = BitvavoClient(allow_trading=False)
            for asset, amount in sorted(client.balances().items()):
                print(f"   {asset:<6} {amount:.8f}")
        except Exception as e:  # noqa: BLE001 — CLI: toon fout, geen traceback
            print(f"   Kon saldo niet ophalen: {e}")

    print("═" * 62)
    db.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
