"""Adversariële onderzoekslaag — de machine valt zijn eigen 'edge' aan.

De kern van een falsificatie-machine: niet proberen te bewijzen dat een voorsprong bestaat,
maar systematisch proberen aan te tonen dat hij NEP is. Een edge die alle onderstaande
toetsen overleeft is pas het overwegen waard; sneuvelt hij bij één, dan was het waarschijnlijk
ruis, timing-artefact, kosten-illusie of één toevallige coin.

Vier toetsen (draaien op historische candles via de bestaande backtester):

  • Cost-stress  — verdubbel/verviervoudig fees+spread+slippage. Verdampt de excess? → kosten-illusie.
  • Shuffle      — vernietig de tijdstructuur (permuteer returns). Doet de strategie het op
                   die ruis-werelden net zo goed? → geen echte structuur, gewoon toeval.
  • Delay        — laat de strategie op verouderde candles beslissen (uitvoeren op de actuele
                   prijs). Verdwijnt de edge? → de edge zat in de timing, niet in het signaal.
  • Universe (LOO) — laat telkens één coin weg. Kantelt de uitkomst? → de 'edge' leunt op één coin.

`excess` = strategie-rendement − buy-and-hold van dezelfde mand (beide na kosten). Dat is de
grootheid die we proberen kapot te maken.
"""

from __future__ import annotations

import random
import statistics

from .backtesting import WARMUP_CANDLES, ReplayMarket, buy_and_hold, run_backtest
from .config import AppConfig
from .models import Candle


def excess_vs_hold(cfg: AppConfig, strategy: str, data: dict[str, list[Candle]],
                   warmup: int = WARMUP_CANDLES) -> float:
    s = run_backtest(cfg, strategy, data, warmup)
    h = buy_and_hold(cfg, data, warmup)
    return s["return_pct"] - h["return_pct"]


# ── 1. cost-stress ─────────────────────────────────────────────────────────────

def cost_stress(cfg: AppConfig, strategy: str, data: dict[str, list[Candle]],
                mults=(1.0, 2.0, 4.0), warmup: int = WARMUP_CANDLES) -> list[tuple[float, float]]:
    out = []
    for m in mults:
        c = cfg.model_copy(deep=True)
        c.costs.taker_fee_pct *= m
        c.costs.slippage_pct *= m
        out.append((m, excess_vs_hold(c, strategy, data, warmup)))
    return out


# ── 2. shuffle (null-verdeling: is de edge te onderscheiden van toeval?) ────────

def _shuffle_returns(series: list[Candle], rng: random.Random) -> list[Candle]:
    closes = [c.close for c in series]
    rets = [closes[i] / closes[i - 1] - 1 for i in range(1, len(closes)) if closes[i - 1] > 0]
    rng.shuffle(rets)
    px = [closes[0]]
    for r in rets:
        px.append(px[-1] * (1 + r))
    return [Candle(series[i].ts, px[i], px[i], px[i], px[i], series[i].volume)
            for i in range(min(len(px), len(series)))]


def shuffle_test(cfg: AppConfig, strategy: str, data: dict[str, list[Candle]],
                 real_excess: float, n: int = 40, warmup: int = WARMUP_CANDLES,
                 seed: int = 1) -> dict:
    rng = random.Random(seed)
    vals = []
    for _ in range(n):
        shuf = {p: _shuffle_returns(s, rng) for p, s in data.items()}
        vals.append(excess_vs_hold(cfg, strategy, shuf, warmup))
    ge = sum(1 for v in vals if v >= real_excess)
    return {"n": n, "p_luck": (ge + 1) / (n + 1),          # hoog = niet van toeval te onderscheiden
            "shuffle_mean": statistics.fmean(vals),
            "shuffle_p95": sorted(vals)[max(0, int(0.95 * n) - 1)] if vals else 0.0}


# ── 3. delay (zat de edge in de timing?) ────────────────────────────────────────

class LaggedReplayMarket(ReplayMarket):
    """Strategie ziet candles tot t−lag (óók de dagelijkse view); uitvoering op de prijs van t.

    Let op: een strategie die op DAG-candles beslist, merkt een vertraging pas als `lag`
    een dag-grens overschrijdt. Voor zo'n strategie is een lag < 24u per definitie een no-op
    — gebruik dan `--delay-hours 24` of meer, anders toetst delay niets."""

    def __init__(self, data: dict[str, list[Candle]], lag: int):
        super().__init__(data)
        self.lag = lag

    def candles(self, pair: str, interval: str = "1h", limit: int = 200, since_ms=None):
        j = max(0, self.index[pair] - self.lag)             # gelaagde index
        if interval == "1d":
            cur_day = self.data[pair][j].ts // 86_400_000   # dag-view óók laten meelopen met de lag
            closed = [c for c in self._daily[pair] if c.ts // 86_400_000 < cur_day]
            return closed[-limit:]
        return self.data[pair][max(0, j + 1 - limit): j + 1]


def delay_test(cfg: AppConfig, strategy: str, data: dict[str, list[Candle]],
               lag: int = 6, warmup: int = WARMUP_CANDLES) -> float:
    s = run_backtest(cfg, strategy, data, warmup, market=LaggedReplayMarket(data, lag))
    h = buy_and_hold(cfg, data, warmup)
    return s["return_pct"] - h["return_pct"]


# ── 4. universe / leave-one-out (leunt de edge op één coin?) ────────────────────

def universe_test(cfg: AppConfig, strategy: str, data: dict[str, list[Candle]],
                  warmup: int = WARMUP_CANDLES) -> list[tuple[str, float]]:
    out = []
    pairs = list(data)
    if len(pairs) < 2:
        return out
    for drop in pairs:
        sub = {p: s for p, s in data.items() if p != drop}
        if len(sub) < 2 and strategy in ("cross_sectional", "vol_target"):
            continue
        c = cfg.model_copy(deep=True)
        c.pairs = list(sub)
        out.append((drop, excess_vs_hold(c, strategy, sub, warmup)))
    return out


# ── samenvattend oordeel ────────────────────────────────────────────────────────

def run_all(cfg: AppConfig, strategy: str, data: dict[str, list[Candle]],
            shuffles: int = 40, lag: int = 6, warmup: int = WARMUP_CANDLES,
            seed: int = 1) -> dict:
    real = excess_vs_hold(cfg, strategy, data, warmup)
    costs = cost_stress(cfg, strategy, data, warmup=warmup)
    shuf = shuffle_test(cfg, strategy, data, real, n=shuffles, warmup=warmup, seed=seed)
    delayed = delay_test(cfg, strategy, data, lag=lag, warmup=warmup)
    loo = universe_test(cfg, strategy, data, warmup=warmup)

    # oordeel: overleeft de edge alle toetsen?
    flags = []
    if real <= 0:
        flags.append("geen positieve excess om te beginnen")
    if shuf["p_luck"] > 0.10:
        flags.append(f"niet te onderscheiden van toeval (p_luck {shuf['p_luck']:.2f})")
    cost4 = next((e for m, e in costs if m == 4.0), None)
    if cost4 is not None and real > 0 and cost4 <= 0:
        flags.append("verdampt bij hogere kosten")
    if real > 0 and delayed <= 0:
        flags.append("verdwijnt met vertraging (timing-artefact)")
    if loo:
        spread = max(e for _, e in loo) - min(e for _, e in loo)
        if real > 0 and spread > abs(real):
            flags.append("leunt sterk op één coin")

    verdict = "GEEN robuuste edge" if flags else "overleeft alle toetsen (zeldzaam — nader onderzoeken)"
    return {"strategy": strategy, "real_excess": real, "cost_stress": costs,
            "shuffle": shuf, "delay_excess": delayed, "universe_loo": loo,
            "flags": flags, "verdict": verdict}
