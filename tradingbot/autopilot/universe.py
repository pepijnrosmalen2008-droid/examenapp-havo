"""Coin-universe selectie — welke Bitvavo-EUR-markten zijn liquide genoeg om te
verhandelen. Volledig deterministisch en testbaar (zelfde filosofie als de rest).

Antwoord op de wens "handel alle Bitvavo-coins", maar verantwoord: van de ~180
EUR-markten blijven alleen de markten over met genoeg omzet, een acceptabele
spread en een actieve status. Illiquide of in-onderhoud zijnde munten leiden tot
slechte fills en worden dus bewust overgeslagen.

De selectie vervangt NIET de risk engine of de pair-whitelist-veiligheid; hij
levert alleen een dagelijkse, gefilterde lijst kandidaat-pairs. De risk engine
blijft elke order daarna nog steeds beoordelen.
"""

from __future__ import annotations

import logging

from .config import AppConfig

log = logging.getLogger("autopilot.universe")


def select_universe(cfg: AppConfig, eur_markets: list[dict],
                    stats: dict[str, dict]) -> list[str]:
    """Bepaal de verhandelbare pairs.

    eur_markets: [{'pair','active'}, ...]  (van exchange.eur_markets())
    stats:       {'PAIR': {'volume_eur','spread_pct'}, ...}  (van exchange.market_stats())
    """
    u = cfg.universe
    if not u.enabled:
        return list(cfg.pairs)

    active = {m["pair"] for m in eur_markets if m.get("active", True)}
    candidates: list[tuple[str, float]] = []
    for pair in active:
        s = stats.get(pair)
        if s is None:
            continue
        vol = s.get("volume_eur") or 0
        spread = s.get("spread_pct")
        if vol < u.min_daily_volume_eur:
            continue
        if spread is not None and spread > u.max_spread_pct:
            continue
        candidates.append((pair, vol))

    # hoogste omzet eerst, cap op max_markets
    candidates.sort(key=lambda x: x[1], reverse=True)
    selected = [p for p, _ in candidates[: u.max_markets]]

    # altijd-meenemen (mits actief), zonder de cap te overschrijden met dubbelen
    for pair in u.always_include:
        if pair in active and pair not in selected:
            selected.append(pair)

    log.info("universe: %d van %d actieve EUR-markten geselecteerd "
             "(min omzet €%.0f, max spread %.2f%%)",
             len(selected), len(active), u.min_daily_volume_eur, u.max_spread_pct)
    return selected
