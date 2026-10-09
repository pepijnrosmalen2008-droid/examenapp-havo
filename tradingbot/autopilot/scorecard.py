"""Dubbele scorekaart — twee onafhankelijke rapportcijfers voor de bot, bewust gescheiden zodat
een goede *onderzoeker* niet verward wordt met een goede *handelaar* (en omgekeerd).

  • trading_score   — hoe goed handelt het echte/paper-kapitaal NU? Rendement t.o.v. buy-and-hold,
                      gestraft voor drawdown, plus de netto P&L-realiteit (fees inbegrepen).
  • research_score  — hoe goed léért het systeem? Kalibratie van de arena (voorspelt ze welke
                      strategie wint?) en de overlevingsgraad van hypotheses (vindt de onderzoeker
                      echte edges, of verwerpt hij alles / accepteert hij ruis?).

Beide op 0–100. Expres apart: een bot kan cash aanhouden (trading_score laag want niets verdiend)
terwijl hij uitstekend leert (research_score hoog) — dat is precies het gewenste gedrag op een
markt zonder edge, en de scheiding maakt dat zichtbaar in plaats van het te verdoezelen.
"""

from __future__ import annotations

from .database import Database


def _clip(x: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, x))


def trading_score(db: Database, *, benchmark_pct: float | None = None) -> dict:
    """Handelscijfer uit de echte equity-curve + afgerekende posities."""
    eq = db.last_equity()
    equity = eq["equity_eur"] if eq else 0.0
    start = db.get_meta_float("start_equity_eur", equity) or equity
    ret_pct = (equity / start - 1) * 100 if start else 0.0

    # netto gerealiseerde P&L (fees zitten in realized_pnl_eur)
    row = db.conn.execute(
        "SELECT COALESCE(SUM(realized_pnl_eur),0) p, COUNT(*) n "
        "FROM positions WHERE realized_pnl_eur IS NOT NULL").fetchone()
    net_pnl = row["p"] if row else 0.0
    closed = row["n"] if row else 0

    # excess t.o.v. benchmark (buy-and-hold) als die is meegegeven
    excess = (ret_pct - benchmark_pct) if benchmark_pct is not None else ret_pct

    # drawdown-straf
    dd = db.get_meta_float("max_drawdown_pct", 0.0) or 0.0

    # 50 = neutraal; +excess beloont, drawdown straft. Ruwe, monotone afbeelding.
    score = _clip(50 + excess * 2.0 - dd * 0.5)
    return {
        "score": round(score, 1), "equity_eur": round(equity, 2), "return_pct": round(ret_pct, 2),
        "excess_pct": round(excess, 2) if benchmark_pct is not None else None,
        "net_pnl_eur": round(net_pnl, 2), "closed_positions": closed,
        "max_drawdown_pct": round(dd, 2),
    }


def research_score(db: Database) -> dict:
    """Leercijfer uit arena-kalibratie + hypothese-overleving."""
    # 1) arena-kalibratie: van de strategieën met genoeg observaties, welk deel heeft een positieve
    #    netto edge? Een lerende arena hoort dit scherp te krijgen (niet alles 50/50).
    stats = db.strategy_stats()
    graded = [s for s in stats.values() if (s.get("n") or 0) >= 10 and s.get("net_edge") is not None]
    if graded:
        pos = sum(1 for s in graded if s["net_edge"] > 0)
        # kalibratie = hoe ver van pure gok (0.5) de hit-rate gemiddeld af ligt
        hit = [s["hit_rate"] for s in graded if s.get("hit_rate") is not None]
        calib = (sum(abs(h - 0.5) for h in hit) / len(hit)) if hit else 0.0
        arena_component = 100 * (calib * 2)   # 0 (gok) → 100 (perfect scheidend)
        arena_n = len(graded)
    else:
        pos = 0
        arena_component = 0.0
        arena_n = 0

    # 2) hypothese-overleving: de onderzoeker hoort selectief te zijn. Zowel "alles verwerpen" als
    #    "alles accepteren" is slecht. Beloon een gezonde, lage-maar-niet-nul kandidaat-ratio.
    summ = db.research_summary()
    total = sum(summ.values())
    kandidaat = summ.get("kandidaat", 0)
    if total:
        ratio = kandidaat / total
        # piek rond ~10% kandidaten; straf zowel 0% (niets vindt) als >40% (te makkelijk ja)
        survival_component = _clip(100 * (1 - abs(ratio - 0.10) / 0.40))
    else:
        ratio = 0.0
        survival_component = 0.0

    score = _clip(0.5 * arena_component + 0.5 * survival_component)
    return {
        "score": round(score, 1),
        "arena_strategies_graded": arena_n, "arena_positive_edge": pos,
        "hypotheses_total": total, "hypotheses_kandidaat": kandidaat,
        "kandidaat_ratio": round(ratio, 3),
    }


def scorecard(db: Database, *, benchmark_pct: float | None = None) -> dict:
    return {"trading": trading_score(db, benchmark_pct=benchmark_pct),
            "research": research_score(db)}
