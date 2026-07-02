"""Grid trading — koop/verkoop op level-crossings binnen een prijsband die
dagelijks wordt herberekend op basis van 30-dagen volatiliteit.

Band: mid = SMA(24u closes); halfbreedte = band_k × σ(30d log-returns, geannualiseerd
naar de bandperiode) × mid. Levels: `levels` gelijk verdeelde niveaus in de band.

Elke cycle: is de prijs één of meer levels omlaag gekruist sinds de vorige cycle
→ BUY order_eur per gekruist level. Omhoog gekruist → SELL het equivalent per level
(alleen wat we hebben). Market orders i.p.v. rustende limit orders: zie DECISIONS.md D12.

params (defaults): levels=6, order_eur=25, band_k=2.0
"""

from __future__ import annotations

from datetime import datetime

from ..indicators import volatility
from ..models import Candle, Position, Side, Signal
from . import Strategy, register

BAND_TTL_MS = 24 * 3600 * 1000  # band 1× per dag herberekenen


@register
class GridStrategy(Strategy):
    name = "grid"
    candle_interval = "1h"
    candle_limit = 24 * 30  # 30 dagen aan 1h candles voor de volatiliteit

    def generate_signals(self, candles: dict[str, list[Candle]],
                         positions: list[Position], now: datetime) -> list[Signal]:
        levels = int(self.params.get("levels", 6))
        order_eur = float(self.params.get("order_eur", 25))
        band_k = float(self.params.get("band_k", 2.0))
        signals: list[Signal] = []

        for pair in self.cfg.pairs:
            series = candles.get(pair) or []
            if len(series) < 24 * 7:  # minstens een week data voor een zinnige band
                continue
            price = series[-1].close
            state = self.load_state(pair)

            band = state.get("band")
            if not band or series[-1].ts - band["ts"] >= BAND_TTL_MS:
                closes = [c.close for c in series]
                sigma = volatility(closes[-24 * 30:])          # per-uur σ van log-returns
                sigma_day = sigma * (24 ** 0.5)                # naar dag-schaal
                mid = sum(closes[-24:]) / len(closes[-24:])    # SMA 24u
                half = band_k * sigma_day * mid
                if half <= 0:
                    continue
                band = {"low": mid - half, "high": mid + half, "ts": series[-1].ts}
                state["band"] = band
                state["last_level"] = self._level(price, band, levels)
                self.save_state(pair, state)
                continue  # eerste cycle na (her)berekening: alleen kalibreren

            cur = self._level(price, band, levels)
            last = state.get("last_level", cur)
            if cur == last:
                continue
            crossed = cur - last
            state["last_level"] = cur
            self.save_state(pair, state)

            if crossed < 0:  # prijs zakte door |crossed| levels → kopen
                signals.append(Signal(
                    pair=pair, side=Side.BUY, amount_eur=order_eur * -crossed,
                    reason=f"grid: {-crossed} level(s) omlaag naar level {cur} "
                           f"(band €{band['low']:.0f}–€{band['high']:.0f})",
                    strategy=self.name))
            else:  # prijs steeg → per level een plukje verkopen
                held = sum(p.amount for p in positions if p.pair == pair)
                sell_amount = min(held, (order_eur * crossed) / price)
                if sell_amount * price >= 5:  # Bitvavo minimum
                    signals.append(Signal(
                        pair=pair, side=Side.SELL, amount_asset=sell_amount,
                        reason=f"grid: {crossed} level(s) omhoog naar level {cur}",
                        strategy=self.name))
        return signals

    @staticmethod
    def _level(price: float, band: dict, levels: int) -> int:
        """Level-index 0..levels; onder de band <0, erboven >levels (geclamped ±1 erbuiten)."""
        step = (band["high"] - band["low"]) / levels
        if step <= 0:
            return 0
        idx = int((price - band["low"]) // step)
        return max(-1, min(levels + 1, idx))
