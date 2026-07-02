"""Regime-filter — dunne, deterministische laag tussen strategie en risk engine.

Klassieke trendregel: nieuwe LONG-exposure alleen wanneer de prijs boven de
lange-termijn EMA (default 200 dagen) staat. In een bear-regime worden BUY-signalen
gedropt (en gelogd); SELL-signalen en exits blijven altijd doorgaan. Strategieën in
`exempt` (default: dca, dat juist wil bijkopen in dalingen) worden niet gefilterd.

Dit is bewust géén voorspeller — het is een filter dat exposure verlaagt in
neerwaartse trends, met dezelfde eigenschappen als de rest van de bot:
deterministisch, backtestbaar en uitlegbaar.
"""

from __future__ import annotations

import logging
import math

from .config import AppConfig
from .database import Database
from .indicators import ema
from .models import Side, Signal

log = logging.getLogger("autopilot.regime")


class RegimeFilter:
    def __init__(self, cfg: AppConfig, db: Database):
        self.cfg = cfg
        self.db = db

    def apply(self, signals: list[Signal], market) -> list[Signal]:
        if not self.cfg.regime.enabled or not signals:
            return signals
        days = self.cfg.regime.ema_days
        exempt = set(self.cfg.regime.exempt)
        out: list[Signal] = []
        cache: dict[str, str] = {}  # pair -> 'bull' | 'bear' | 'unknown'

        for sig in signals:
            if sig.side != Side.BUY or sig.strategy in exempt:
                out.append(sig)
                continue
            regime = cache.get(sig.pair) or self._regime(sig.pair, days, market)
            cache[sig.pair] = regime
            if regime == "bear":
                reason = (f"regime-filter: {sig.pair} onder EMA{days}d (bear) — "
                          f"BUY van '{sig.strategy}' gedropt")
                log.info(reason)
                self.db.log_risk_decision(pair=sig.pair, side=sig.side.value, allowed=False,
                                          reason=reason, requested_eur=sig.amount_eur,
                                          approved_eur=None)
            else:
                out.append(sig)
        return out

    def _regime(self, pair: str, days: int, market) -> str:
        try:
            daily = market.candles(pair, "1d", days + 10)
        except Exception:  # noqa: BLE001 — datafout mag de cycle niet breken
            log.exception("regime: kon dagcandles %s niet ophalen; filter overgeslagen", pair)
            return "unknown"
        closes = [c.close if hasattr(c, "close") else float(c[4]) for c in daily]
        if len(closes) < days:
            log.warning("regime: maar %d/%d dagcandles voor %s; filter overgeslagen",
                        len(closes), days, pair)
            return "unknown"
        e = ema(closes, days)[-1]
        if math.isnan(e):
            return "unknown"
        price = market.ticker_price(pair)
        return "bear" if price < e else "bull"
