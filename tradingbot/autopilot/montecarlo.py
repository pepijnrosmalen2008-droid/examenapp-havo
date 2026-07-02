"""Monte Carlo stress-test — hoe robuust is een strategie als de geschiedenis nét
anders was gelopen?

Methode: block-bootstrap op de log-returns (blokken van 24 uur, met dezelfde
blokvolgorde voor alle pairs zodat de BTC/ETH-correlatie intact blijft), plus
jitter op fees en slippage. Elke gebootstrapte markt wordt door de échte engine
gedraaid. Het resultaat is een verdeling in plaats van één getal: percentielen
van rendement en max drawdown, en hoe vaak de kill switch viel.
"""

from __future__ import annotations

import math
import random
import time

from .backtesting import WARMUP_CANDLES, run_backtest
from .config import AppConfig
from .models import Candle

BLOCK_HOURS = 24
FEE_JITTER_PP = 0.05      # ± procentpunt op de taker fee per run
SLIP_JITTER_PP = 0.05     # ± procentpunt op de slippage per run


def bootstrap_data(data: dict[str, list[Candle]], rnd: random.Random) -> dict[str, list[Candle]]:
    """Nieuwe prijspaden met dezelfde tijdstempels; blokindices gedeeld over pairs."""
    n = min(len(s) for s in data.values())
    n_blocks = math.ceil((n - 1) / BLOCK_HOURS)
    starts = [rnd.randint(0, n - 1 - BLOCK_HOURS) for _ in range(n_blocks)]
    indices = [s + k for s in starts for k in range(BLOCK_HOURS)][: n - 1]

    out: dict[str, list[Candle]] = {}
    for pair, series in data.items():
        closes = [c.close for c in series]
        rets = [closes[i + 1] / closes[i] for i in range(len(closes) - 1)]
        path = [series[0]]
        prev_close = series[0].close
        for pos, j in enumerate(indices):
            src = series[j + 1]
            new_close = max(prev_close * rets[j], 0.01)
            base = max(src.open, src.close) or 1.0
            hi_ratio = src.high / base
            lo_ratio = src.low / (min(src.open, src.close) or 1.0)
            o = prev_close
            path.append(Candle(ts=series[pos + 1].ts, open=o,
                               high=max(o, new_close) * hi_ratio,
                               low=min(o, new_close) * lo_ratio,
                               close=new_close, volume=src.volume))
            prev_close = new_close
        out[pair] = path
    return out


def percentile(values: list[float], p: float) -> float:
    xs = sorted(values)
    k = (len(xs) - 1) * p / 100
    lo, hi = int(math.floor(k)), int(math.ceil(k))
    return xs[lo] if lo == hi else xs[lo] + (xs[hi] - xs[lo]) * (k - lo)


def run_monte_carlo(cfg: AppConfig, strategy: str, data: dict[str, list[Candle]],
                    n: int, seed: int = 1) -> dict:
    rnd = random.Random(seed)
    print(f"\nMonte Carlo: {n} gebootstrapte scenario's voor '{strategy}' "
          f"(blokken van {BLOCK_HOURS}u, fee/slippage-jitter ±{FEE_JITTER_PP}pp)")

    hist = run_backtest(cfg, strategy, data, WARMUP_CANDLES)
    results = []
    t0 = time.monotonic()
    for i in range(n):
        run_cfg = cfg.model_copy(deep=True)
        run_cfg.costs.taker_fee_pct = max(0.0, cfg.costs.taker_fee_pct + rnd.uniform(-FEE_JITTER_PP, FEE_JITTER_PP))
        run_cfg.costs.slippage_pct = max(0.0, cfg.costs.slippage_pct + rnd.uniform(-SLIP_JITTER_PP, SLIP_JITTER_PP))
        results.append(run_backtest(run_cfg, strategy, bootstrap_data(data, rnd), WARMUP_CANDLES))
        print(f"  run {i + 1}/{n}: {results[-1]['return_pct']:+.1f}%"
              f"{' ⛔' if results[-1]['halted_at'] else ''}", flush=True)

    rets = [r["return_pct"] for r in results]
    dds = [r["max_dd_pct"] for r in results]
    halted = sum(1 for r in results if r["halted_at"])
    summary = {
        "historical_return_pct": hist["return_pct"],
        "ret_p5": percentile(rets, 5), "ret_p50": percentile(rets, 50), "ret_p95": percentile(rets, 95),
        "dd_p50": percentile(dds, 50), "dd_p95": percentile(dds, 95),
        "halted_pct": halted / n * 100,
        "runs": results,
    }

    print(f"\n  klaar in {time.monotonic() - t0:.0f}s")
    print(f"\n{'':<26}{'p5':>9} {'mediaan':>9} {'p95':>9}")
    print("─" * 56)
    print(f"{'rendement':<26}{summary['ret_p5']:>8.1f}% {summary['ret_p50']:>8.1f}% {summary['ret_p95']:>8.1f}%")
    print(f"{'max drawdown':<26}{'':>9} {summary['dd_p50']:>8.1f}% {summary['dd_p95']:>8.1f}%")
    print(f"\nHistorische run: {hist['return_pct']:+.1f}% | kill switch viel in "
          f"{summary['halted_pct']:.0f}% van de scenario's")
    print("Lees dit zo: ligt de historische run ver boven de mediaan, dan was dat pad "
          "waarschijnlijk geluk, geen edge. De p5 is je realistische slechte scenario.")
    return summary
