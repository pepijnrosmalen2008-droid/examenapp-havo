"""Autonome onderzoeker — genereert zelf hypotheses (strategie + parameters), toetst ze streng
offline en schrijft het oordeel naar `research_log`. Dit draait **náást** het live-pad: de
onderzoeker alloceert NOOIT zelf echt kapitaal. Een kandidaat die alle toetsen overleeft, wordt
alleen *gerapporteerd* — hij komt pas in de live-roster als een mens hem er bewust in zet. Zo blijft
de risk-governor onafhankelijk en de arena de enige router van echt geld.

Per hypothese:
  1. backtest (`run_backtest`) + buy-and-hold-benchmark (`buy_and_hold`) op dezelfde data;
  2. adversariële suite (`adversarial.run_all`): kosten-stress, shuffle/p_luck, vertraging, leave-one-out;
  3. oordeel:
       • "verworpen"    — adversariële vlaggen (geen robuuste edge na kosten/toeval/timing);
       • "kandidaat"    — positieve netto-excess én overleeft alle toetsen (zeldzaam → menselijke review);
       • "inconclusief" — te weinig trades of niet-berekenbaar (onvoldoende bewijs, geen conclusie).

Falsificatie-discipline: de default-uitkomst is *afwijzen*. Een hypothese moet zich bewijzen,
niet andersom.
"""

from __future__ import annotations

import hashlib
import itertools
import json
import logging

from . import adversarial, backtesting
from .config import AppConfig
from .database import Database
from .models import Candle

log = logging.getLogger("autopilot.researcher")

# ── hypothese-ruimte ─────────────────────────────────────────────────────────
# Per strategie een kleine, bewust grove parameter-grid. Grof gehouden zodat de multiple-testing-
# last (en daarmee de kans op toevalstreffers) beperkt blijft; de adversariële suite vangt de rest.
PARAM_GRID: dict[str, dict[str, list]] = {
    "momentum_ma_cross": {
        "fast": [8, 12, 20],
        "slow": [26, 50],
    },
    "adaptive": {
        "buy_threshold": [0.15, 0.25],
        "sell_threshold": [-0.10, -0.20],
        "min_confidence": [0.10, 0.20],
    },
    "cross_sectional": {
        "lookback_days": [14, 30],
        "top_n": [3, 5],
    },
}

MIN_TRADES = 5          # minder dan dit → inconclusief (geen zinnige statistiek)


def hypotheses(strategies: list[str] | None = None) -> list[tuple[str, dict]]:
    """Alle (strategie, params)-combinaties uit de grid. Deterministisch geordend."""
    out: list[tuple[str, dict]] = []
    names = strategies or list(PARAM_GRID)
    for name in names:
        grid = PARAM_GRID.get(name)
        if not grid:
            out.append((name, {}))
            continue
        keys = sorted(grid)
        for combo in itertools.product(*(grid[k] for k in keys)):
            out.append((name, {k: v for k, v in zip(keys, combo)}))
    return out


def hkey(strategy: str, params: dict) -> str:
    """Stabiele sleutel voor dedup: zelfde strategie+params → zelfde key (volgorde-onafhankelijk)."""
    blob = json.dumps({"s": strategy, "p": params}, sort_keys=True, separators=(",", ":"))
    return hashlib.sha1(blob.encode()).hexdigest()[:16]


def _verdict(bt: dict, hold: dict, adv: dict) -> tuple[str, float]:
    """Oordeel + netto-excess (strategie-rendement minus buy-and-hold)."""
    excess = bt["return_pct"] - hold["return_pct"]
    if bt["trades"] < MIN_TRADES:
        return "inconclusief", excess
    if adv["flags"]:                       # adversariële suite vond een lek → afwijzen
        return "verworpen", excess
    if excess > 0 and adv["real_excess"] > 0:
        return "kandidaat", excess
    return "verworpen", excess


def evaluate(cfg: AppConfig, strategy: str, params: dict, data: dict[str, list[Candle]],
             *, shuffles: int = 40, warmup: int | None = None) -> dict:
    """Toets één hypothese volledig. Geeft een dict met oordeel + kerncijfers terug."""
    kw = {} if warmup is None else {"warmup": warmup}
    bt = backtesting.run_backtest(cfg, strategy, data, params=params, **kw)
    hold = backtesting.buy_and_hold(cfg, data, **kw)
    # adversarial draait op cfg.strategy.params; daarom hier tijdelijk de params injecteren
    adv_cfg = cfg.model_copy(deep=True)
    adv_cfg.strategy.name = strategy  # type: ignore[assignment]
    adv_cfg.strategy.params = {**adv_cfg.strategy.params, **params}
    adv = adversarial.run_all(adv_cfg, strategy, data, shuffles=shuffles,
                              **({} if warmup is None else {"warmup": warmup}))
    verdict, excess = _verdict(bt, hold, adv)
    return {
        "strategy": strategy, "params": params, "hkey": hkey(strategy, params),
        "return_pct": bt["return_pct"], "hold_pct": hold["return_pct"], "excess_pct": excess,
        "trades": bt["trades"], "real_excess": adv["real_excess"], "flags": adv["flags"],
        "verdict": verdict,
    }


def research_once(cfg: AppConfig, db: Database, data: dict[str, list[Candle]],
                  *, strategies: list[str] | None = None, limit: int | None = None,
                  shuffles: int = 40, warmup: int | None = None, skip_seen: bool = True) -> list[dict]:
    """Loop over nog-niet-geziene hypotheses, toets ze, log het oordeel. Geeft de nieuwe resultaten."""
    results: list[dict] = []
    for strategy, params in hypotheses(strategies):
        key = hkey(strategy, params)
        if skip_seen and db.research_seen(key):
            continue
        try:
            res = evaluate(cfg, strategy, params, data, shuffles=shuffles, warmup=warmup)
        except Exception:  # noqa: BLE001 — één kapotte hypothese mag de onderzoeksronde niet stoppen
            log.exception("researcher: hypothese %s %s faalde", strategy, params)
            continue
        db.record_research(
            hkey=res["hkey"], strategy=strategy, params=json.dumps(params, sort_keys=True),
            return_pct=res["return_pct"], hold_pct=res["hold_pct"], excess_pct=res["excess_pct"],
            trades=res["trades"], verdict=res["verdict"], flags=json.dumps(res["flags"]))
        results.append(res)
        log.info("researcher: %s %s → %s (excess %.2f%%, trades %d)",
                 strategy, params, res["verdict"], res["excess_pct"], res["trades"])
        if limit is not None and len(results) >= limit:
            break
    return results


def promoted(db: Database) -> list[dict]:
    """Hypotheses met oordeel 'kandidaat' — klaar voor menselijke review, NIET auto-live."""
    return [r for r in db.recent_research(1000) if r["verdict"] == "kandidaat"]
