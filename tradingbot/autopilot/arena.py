"""Strategie-arena — de autonome kern: meerdere strategieën tegelijk LIVE meten, en echt kapitaal
alleen naar een strategie sturen die zich forward-only bewijst (anders cash).

Het idee (consistent met de factor-leerlus, maar op STRATEGIE-niveau):
  * elke kandidaat-strategie draait elke cyclus "op papier" mee: haar BUY-voorstellen worden
    vastgelegd als observatie met de instapprijs en een horizon;
  * na de horizon wordt elke observatie beoordeeld op de WERKELIJKE koersbeweging, ná round-trip-
    kosten (fee + slippage). Positief = de strategie had edge op dat moment, negatief = niet;
  * per strategie groeien zo n, hit-rate en netto edge. Een strategie is pas `actief` (verdient
    echt kapitaal) als ze genoeg observaties heeft én een positieve netto edge;
  * de autonome laag laat elke cyclus de BESTE actieve strategie het echte handelen doen. Is er
    geen enkele actief → **cash** (geen nieuwe trades). Zo stopt de bot zichzelf als niets werkt.

Dit is bewust geen volledige per-strategie-portefeuille-simulatie (met eigen stops): het is dezelfde
bewezen, zuinige forward-only meting als de factor-lus, toegepast op strategie-voorstellen. Genoeg
om eerlijk te poorten welke strategie kapitaal verdient, zonder een tweede engine na te bouwen.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta

from . import factor_learning as fl
from .models import Side

log = logging.getLogger("autopilot.arena")

HORIZON_MIN = 60        # na hoeveel minuten een voorstel wordt afgerekend
MIN_N = 40              # minimaal aantal afgerekende observaties voor een oordeel
DEDUP_MIN = 60          # niet vaker dan 1 observatie per (strategie,pair) per zoveel minuten


def record(db, strategy: str, signals, prices: dict, now: datetime, cfg) -> None:
    """Leg de BUY-voorstellen van een kandidaat vast als forward-only observaties."""
    recent = db.pending_strategy_obs_pairs(strategy, (now - timedelta(minutes=DEDUP_MIN)).isoformat())
    due = (now + timedelta(minutes=HORIZON_MIN)).isoformat(timespec="seconds")
    for sig in signals:
        if sig.side != Side.BUY:
            continue
        price = prices.get(sig.pair)
        if not price or sig.pair in recent:
            continue
        db.record_strategy_obs(ts=now.isoformat(timespec="seconds"), due_ts=due,
                               strategy=strategy, pair=sig.pair, entry_price=float(price))
        recent.add(sig.pair)


def grade(db, prices: dict, now: datetime, cfg) -> int:
    """Reken alle observaties af waarvan de horizon verstreken is (netto na kosten)."""
    roundtrip = fl.roundtrip_cost(cfg)
    graded = 0
    for row in db.due_strategy_obs(now.isoformat(timespec="seconds")):
        price = prices.get(row["pair"])
        if not price:
            continue
        gross = price / row["entry_price"] - 1.0
        edge = gross - roundtrip                      # netto na round-trip-kosten
        db.resolve_strategy_obs(row["id"], row["strategy"], hit=edge > 0, edge=edge)
        graded += 1
    return graded


def scores(db, min_n: int = MIN_N) -> dict:
    """Per strategie {n, hit_rate, net_edge, status}. status 'actief' bij genoeg bewijs + edge>0."""
    out = {}
    for name, s in db.strategy_stats().items():
        n, net = s["n"], s["net_edge"]
        if n < min_n:
            status = "observeren"
        elif net is not None and net > 0:
            status = "actief"
        else:
            status = "onbewezen"
        out[name] = {**s, "status": status}
    return out


def best_strategy(db, min_n: int = MIN_N) -> str | None:
    """Naam van de actieve strategie met de hoogste netto edge, of None (→ cash)."""
    actief = {k: v for k, v in scores(db, min_n).items() if v["status"] == "actief"}
    if not actief:
        return None
    return max(actief, key=lambda k: actief[k]["net_edge"])
