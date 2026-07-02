"""Bitvavo API-client wrapper op basis van ccxt.

Waarom ccxt en niet python-bitvavo-api: zie DECISIONS.md. Kort: actiever onderhouden,
ingebouwde rate-limiting, nette exception-hiërarchie (NetworkError vs ExchangeError)
en triviaal te mocken in tests via deze eigen wrapper-interface.

De wrapper logt NOOIT keys en heeft een strikte scheiding:
  - MarketData     : publieke endpoints, geen key nodig
  - BitvavoClient  : geauthenticeerd; place_order werkt alleen als 'allow_trading' expliciet aan staat
  - PaperExchange  : simulatie met echte marktdata maar interne balansen (SQLite)
"""

from __future__ import annotations

import logging
import os
from typing import Any

import ccxt

from .database import Database
from .models import Side

log = logging.getLogger("autopilot.exchange")

INTERVAL_MS = {"1m": 60_000, "5m": 300_000, "15m": 900_000, "1h": 3_600_000, "4h": 14_400_000, "1d": 86_400_000}


def _new_ccxt(api_key: str = "", api_secret: str = "") -> ccxt.bitvavo:
    return ccxt.bitvavo({
        "apiKey": api_key,
        "secret": api_secret,
        "enableRateLimit": True,   # ccxt respecteert Bitvavo's rate limits automatisch
        "options": {"adjustForTimeDifference": True},
    })


class MarketData:
    """Publieke marktdata (ticker, candles). Geen API-key nodig."""

    def __init__(self, client: Any | None = None):
        self._x = client or _new_ccxt()

    def ticker_price(self, pair: str) -> float:
        t = self._x.fetch_ticker(pair.replace("-", "/"))
        return float(t["last"])

    def candles(self, pair: str, interval: str = "1h", limit: int = 200,
                since_ms: int | None = None) -> list[tuple]:
        """Geeft [(ts, open, high, low, close, volume), ...] oplopend op tijd."""
        raw = self._x.fetch_ohlcv(pair.replace("-", "/"), timeframe=interval, since=since_ms, limit=limit)
        return [tuple(c) for c in raw]


class BitvavoClient(MarketData):
    """Geauthenticeerde client. Leest saldo; plaatst alleen orders als allow_trading=True."""

    def __init__(self, api_key: str | None = None, api_secret: str | None = None,
                 *, allow_trading: bool = False, client: Any | None = None):
        api_key = api_key if api_key is not None else os.environ.get("BITVAVO_API_KEY", "")
        api_secret = api_secret if api_secret is not None else os.environ.get("BITVAVO_API_SECRET", "")
        if not api_key or not api_secret:
            raise RuntimeError(
                "BITVAVO_API_KEY / BITVAVO_API_SECRET ontbreken. Zet ze in .env "
                "(view+trade rechten, NOOIT withdrawal)."
            )
        super().__init__(client=client or _new_ccxt(api_key, api_secret))
        self.allow_trading = allow_trading

    def balances(self) -> dict[str, float]:
        """{'EUR': 123.45, 'BTC': 0.001, ...} — alleen assets met saldo > 0."""
        bal = self._x.fetch_balance()
        totals = bal.get("total", {}) or {}
        return {k: float(v) for k, v in totals.items() if v and float(v) > 0}

    def open_orders(self, pair: str | None = None) -> list[dict]:
        sym = pair.replace("-", "/") if pair else None
        return self._x.fetch_open_orders(sym)

    def find_order_by_client_id(self, client_order_id: str, pair: str) -> dict | None:
        """Voor crash-recovery: zoek een order op onze idempotentiesleutel."""
        try:
            return self._x.fetch_order(None, pair.replace("-", "/"),
                                       params={"clientOrderId": client_order_id})
        except ccxt.OrderNotFound:
            return None

    def place_market_order(self, pair: str, side: Side, *, amount_asset: float | None = None,
                           amount_eur: float | None = None, client_order_id: str) -> dict:
        if not self.allow_trading:
            raise PermissionError(
                "place_market_order aangeroepen op een read-only client. "
                "Dit hoort onmogelijk te zijn buiten LIVE mode — bug."
            )
        sym = pair.replace("-", "/")
        params: dict[str, Any] = {"clientOrderId": client_order_id}
        if side == Side.BUY:
            if amount_eur is None:
                raise ValueError("BUY market order vereist amount_eur")
            # Bitvavo ondersteunt market-buy op quote-bedrag (amountQuote)
            params["cost"] = amount_eur
            return self._x.create_order(sym, "market", "buy", None, None, params)
        if amount_asset is None:
            raise ValueError("SELL market order vereist amount_asset")
        return self._x.create_order(sym, "market", "sell", amount_asset, None, params)


class PaperExchange:
    """Simuleert order-uitvoering tegen echte marktprijzen, met fee + slippage.

    Balansen leven in SQLite (tabel paper_balances) zodat paper-runs crash-safe zijn.
    """

    def __init__(self, db: Database, market: MarketData, *, capital_eur: float,
                 taker_fee_pct: float = 0.25, slippage_pct: float = 0.1):
        self.db = db
        self.market = market
        self.taker_fee = taker_fee_pct / 100
        self.slippage = slippage_pct / 100
        if not self.db.paper_balances():  # eerste start: kapitaal storten
            self.db.set_paper_balance("EUR", capital_eur)

    def balances(self) -> dict[str, float]:
        return {k: v for k, v in self.db.paper_balances().items() if v > 0}

    def ticker_price(self, pair: str) -> float:
        return self.market.ticker_price(pair)

    def candles(self, pair: str, interval: str = "1h", limit: int = 200,
                since_ms: int | None = None) -> list[tuple]:
        return self.market.candles(pair, interval, limit, since_ms)

    def place_market_order(self, pair: str, side: Side, *, amount_asset: float | None = None,
                           amount_eur: float | None = None, client_order_id: str) -> dict:
        base = pair.split("-")[0]
        price = self.market.ticker_price(pair)
        eur = self.db.paper_balance("EUR")

        if side == Side.BUY:
            if amount_eur is None:
                raise ValueError("BUY vereist amount_eur")
            if amount_eur > eur + 1e-9:
                raise RuntimeError(f"Paper: onvoldoende EUR ({eur:.2f} < {amount_eur:.2f})")
            fill_price = price * (1 + self.slippage)
            fee = amount_eur * self.taker_fee
            asset_amount = (amount_eur - fee) / fill_price
            self.db.set_paper_balance("EUR", eur - amount_eur)
            self.db.set_paper_balance(base, self.db.paper_balance(base) + asset_amount)
            return {"id": f"paper-{client_order_id[:12]}", "price": fill_price,
                    "amount": asset_amount, "cost": amount_eur, "fee_eur": fee, "status": "closed"}

        if amount_asset is None:
            raise ValueError("SELL vereist amount_asset")
        held = self.db.paper_balance(base)
        amount_asset = min(amount_asset, held)
        if amount_asset <= 0:
            raise RuntimeError(f"Paper: geen {base} om te verkopen")
        fill_price = price * (1 - self.slippage)
        gross = amount_asset * fill_price
        fee = gross * self.taker_fee
        self.db.set_paper_balance(base, held - amount_asset)
        self.db.set_paper_balance("EUR", eur + gross - fee)
        return {"id": f"paper-{client_order_id[:12]}", "price": fill_price,
                "amount": amount_asset, "cost": gross - fee, "fee_eur": fee, "status": "closed"}


class ShadowExchange(PaperExchange):
    """Shadow mode: draait het volledige live-pad — geauthenticeerde client, echt
    EUR-saldo als harde limiet — maar de order zelf wordt NOOIT verstuurd. In plaats
    daarvan wordt hij luid gelogd en intern gesimuleerd (zelfde fill-model als paper),
    zodat je na weken kunt vergelijken wat de bot gedaan zóu hebben.

    real_client is een BitvavoClient met allow_trading=False: zelfs een bug die
    place_market_order op de echte client zou aanroepen, wordt daar geweigerd.
    """

    def __init__(self, db: Database, market: MarketData, *, capital_eur: float,
                 real_client=None, taker_fee_pct: float = 0.25, slippage_pct: float = 0.1):
        super().__init__(db, market, capital_eur=capital_eur,
                         taker_fee_pct=taker_fee_pct, slippage_pct=slippage_pct)
        self._real = real_client

    def real_eur(self) -> float | None:
        """Echt EUR-saldo (view-only), of None als er geen key is geconfigureerd."""
        if self._real is None:
            return None
        try:
            return self._real.balances().get("EUR", 0.0)
        except Exception:  # noqa: BLE001 — saldo-check mag de cycle niet breken
            log.exception("shadow: kon echt saldo niet ophalen; limiet-check overgeslagen")
            return None

    def place_market_order(self, pair: str, side: Side, *, amount_asset: float | None = None,
                           amount_eur: float | None = None, client_order_id: str) -> dict:
        fill = super().place_market_order(pair, side, amount_asset=amount_asset,
                                          amount_eur=amount_eur, client_order_id=client_order_id)
        log.warning("SHADOW: order NIET verstuurd, alleen gesimuleerd — %s %s "
                    "(≈€%.2f @ €%.2f)", side.value, pair, fill["cost"], fill["price"])
        fill["id"] = f"shadow-{client_order_id[:12]}"
        return fill
