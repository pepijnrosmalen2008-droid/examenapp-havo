"""Allocatie-engine — inverse-vol weging + volatiliteitsdoel + BTC-floor + correlatie-de-risk.

Beantwoordt niet "wat koop ik?" maar "hoeveel van elk?". Verwacht GEEN hoger eindkapitaal
dan vasthouden; het doel is een beter risicoprofiel (lagere drawdown, hogere Sortino).
Zo wordt hij ook beoordeeld — zie experiments/2026_vol_target_allocatie.md.

Elke rebalance (om de `rebalance_days` dagen):
  1. per coin de recente dag-volatiliteit → gewicht ∝ 1/volatiliteit (rustiger = groter);
  2. BTC krijgt minstens `btc_min` van de crypto-allocatie;
  3. totale crypto-exposure geschaald op een volatiliteitsdoel (vol targeting) en
     verlaagd als de gemiddelde onderlinge correlatie hoog is (dan beweegt alles samen);
  4. herbalanceer naar de doel-euro's, met een band om micro-handel/fees te vermijden.

De engine zet vóór aanroep `self.ctx` met o.a. de actuele equity; zonder ctx valt de
strategie terug op de waarde van de open posities.
"""

from __future__ import annotations

import math
from datetime import datetime, timezone

from ..models import Candle, Position, Side, Signal
from . import Strategy, register

STATE_KEY = "_global"


def _returns(closes: list[float]) -> list[float]:
    return [closes[i] / closes[i - 1] - 1 for i in range(1, len(closes)) if closes[i - 1] > 0]


def _std(xs: list[float]) -> float:
    if len(xs) < 2:
        return 0.0
    m = sum(xs) / len(xs)
    return math.sqrt(sum((x - m) ** 2 for x in xs) / (len(xs) - 1))


def _corr(a: list[float], b: list[float]) -> float | None:
    n = min(len(a), len(b))
    if n < 3:
        return None
    a, b = a[-n:], b[-n:]
    ma, mb = sum(a) / n, sum(b) / n
    cov = sum((a[i] - ma) * (b[i] - mb) for i in range(n))
    va = math.sqrt(sum((x - ma) ** 2 for x in a))
    vb = math.sqrt(sum((x - mb) ** 2 for x in b))
    return cov / (va * vb) if va > 0 and vb > 0 else None


@register
class VolTargetAllocationStrategy(Strategy):
    name = "vol_target"
    candle_interval = "1d"
    candle_limit = 90

    def generate_signals(self, candles: dict[str, list[Candle]],
                         positions: list[Position], now: datetime) -> list[Signal]:
        p = self.params
        lookback = int(p.get("lookback_days", 30))
        rebalance_days = float(p.get("rebalance_days", 7))
        btc_min = float(p.get("btc_min", 0.30))
        target_vol = float(p.get("target_vol", 0.03))        # gewenste dag-volatiliteit
        corr_threshold = float(p.get("corr_threshold", 0.8))
        derisk_cut = float(p.get("derisk_cut", 0.5))
        band_pct = float(p.get("band_pct", 0.03))

        # rebalance-gate
        state = self.db.get_strategy_state(self.name, STATE_KEY)
        last = state.get("last_rebalance_ts")
        if last is not None:
            if (now - datetime.fromtimestamp(last, tz=timezone.utc)).total_seconds() / 86400 < rebalance_days:
                return []

        # per coin: laatste prijs, returns en volatiliteit
        price, rets, vol = {}, {}, {}
        for pair in self.cfg.pairs:
            c = candles.get(pair) or []
            if len(c) < lookback + 2:
                continue
            closes = [x.close for x in c[-(lookback + 1):]]
            r = _returns(closes)
            v = _std(r)
            if closes[-1] > 0 and v > 0:
                price[pair] = closes[-1]
                rets[pair] = r
                vol[pair] = v
        if not price:
            return []

        # inverse-vol gewichten
        inv = {pair: 1.0 / vol[pair] for pair in price}
        tot = sum(inv.values())
        w = {pair: inv[pair] / tot for pair in inv}

        # BTC-floor
        btc = "BTC-EUR"
        if btc in w and w[btc] < btc_min:
            rest = {q: w[q] for q in w if q != btc}
            s = sum(rest.values())
            w = {btc: btc_min}
            for q, v in rest.items():
                w[q] = (v / s) * (1 - btc_min) if s > 0 else 0.0

        # portefeuille-volatiliteit (gewogen, conservatief) → exposure via vol targeting
        port_vol = sum(w[pair] * vol[pair] for pair in w)
        exposure = min(1.0, target_vol / port_vol) if port_vol > 0 else 0.0

        # de-risk bij hoge gemiddelde correlatie (alles beweegt samen)
        pairs = list(rets)
        cors = [c for i in range(len(pairs)) for j in range(i + 1, len(pairs))
                if (c := _corr(rets[pairs[i]], rets[pairs[j]])) is not None]
        avg_corr = sum(cors) / len(cors) if cors else 0.0
        if avg_corr > corr_threshold:
            exposure *= (1 - derisk_cut)

        # doel-euro's
        equity = self._equity(positions, price)
        if equity <= 0:
            return []
        target_eur = {pair: exposure * equity * w[pair] for pair in w}
        current_eur = {pos.pair: pos.amount * price.get(pos.pair, pos.avg_price)
                       for pos in positions if pos.amount > 0}

        band = band_pct * equity
        signals: list[Signal] = []
        for pair in set(target_eur) | set(current_eur):
            tgt = target_eur.get(pair, 0.0)
            cur = current_eur.get(pair, 0.0)
            diff = tgt - cur
            if abs(diff) < band:
                continue
            if diff < 0 and pair in price:          # afbouwen
                signals.append(Signal(pair=pair, side=Side.SELL, amount_asset=-diff / price[pair],
                                      reason=f"allocatie: naar {w.get(pair, 0)*exposure*100:.0f}%", strategy=self.name))
            elif diff > 0:                          # opbouwen
                signals.append(Signal(pair=pair, side=Side.BUY, amount_eur=diff,
                                      reason=f"allocatie: naar {w.get(pair, 0)*exposure*100:.0f}% "
                                             f"(exposure {exposure*100:.0f}%)", strategy=self.name))

        state["last_rebalance_ts"] = now.timestamp()
        self.db.set_strategy_state(self.name, STATE_KEY, state)
        # verkopen eerst, dan kopen (maakt EUR vrij vóór de aankopen)
        signals.sort(key=lambda s: 0 if s.side == Side.SELL else 1)
        return signals

    def _equity(self, positions: list[Position], price: dict[str, float]) -> float:
        ctx = getattr(self, "ctx", None)
        if ctx and ctx.get("equity"):
            return float(ctx["equity"])
        # fallback zonder engine-context: alleen positiewaarde (geen cash bekend)
        return sum(pos.amount * price.get(pos.pair, pos.avg_price) for pos in positions)
