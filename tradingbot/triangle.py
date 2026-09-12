#!/usr/bin/env python3
"""Driehoeks-arbitrage OBSERVER — meet of er op Bitvavo een driehoek is met netto-edge ná kosten.

Handelt NIET. Haalt live de drie prijzen op (A-EUR, B-EUR, A-B) en berekent de beste netto-edge
ná drie legs fee. De drempel is hard: 3× taker 0,25% ≈ −0,75% vóór er iets verdiend is. Verwacht
resultaat: geen exploiteerbare driehoek. Die falsificatie zwart-op-wit hebben is het doel.

Gebruik:
    python triangle.py                      # ETH via BTC (ETH-EUR, BTC-EUR, ETH-BTC)
    python triangle.py --base SOL --bridge BTC --fee 0.25
    python triangle.py --watch 60           # elke 60s opnieuw meten (Ctrl-C stopt)
"""

from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from autopilot.exchange import MarketData
from autopilot.triangle import best_edge


def _measure(market: MarketData, base: str, bridge: str, fee: float) -> None:
    try:
        p_ae = market.ticker_price(f"{base}-EUR")
        p_be = market.ticker_price(f"{bridge}-EUR")
        p_ab = market.ticker_price(f"{base}-{bridge}")   # ccxt: BASE/BRIDGE
    except Exception as e:  # noqa: BLE001
        print(f"  ⚠️  kon prijzen niet ophalen (bestaat de kruismarkt {base}-{bridge} op Bitvavo?): {e}")
        return
    res = best_edge(p_ae, p_be, p_ab, fee, base, bridge)
    implied = p_ae / p_be
    disc = (p_ab / implied - 1) * 100
    print(f"  {base}-EUR €{p_ae:.2f} | {bridge}-EUR €{p_be:.2f} | "
          f"{base}-{bridge} {p_ab:.8f} (impliciet {implied:.8f}, afwijking {disc:+.3f}%)")
    print(f"  beste richting: {res.direction}")
    verdict = "✅ NETTO-POSITIEF" if res.net_edge > 0 else "geen edge"
    print(f"  netto-edge ná 3× {fee}% fee: {res.net_edge * 100:+.3f}%  → {verdict}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", default="ETH", help="valuta A (default ETH)")
    ap.add_argument("--bridge", default="BTC", help="brug-valuta B (default BTC)")
    ap.add_argument("--fee", type=float, default=0.25, help="fee %% per leg (default 0.25 taker)")
    ap.add_argument("--watch", type=int, default=0, help="elke N seconden herhalen (0 = één keer)")
    args = ap.parse_args()

    market = MarketData()
    print(f"\n══════ DRIEHOEKS-OBSERVER — {args.base} via {args.bridge} ══════")
    print("(observatie, geen orders)\n")
    while True:
        _measure(market, args.base.upper(), args.bridge.upper(), args.fee)
        if args.watch <= 0:
            break
        try:
            time.sleep(args.watch)
        except KeyboardInterrupt:
            break
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
