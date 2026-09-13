"""IBKR-adapter (skelet) — Interactive Brokers als broker voor wereldwijde aandelen.

Status: **skelet / integratiepunt**, nog GEEN werkende verbinding. Bewust zo: een IBKR-koppeling
vereist een draaiende IB Gateway/TWS-sessie (met login + 2FA), de `ib_insync`/`ibapi`-client, en
per-beurs marktdata-abonnementen — geen simpele REST-key zoals Bitvavo. Die kan hier (cloud, geen
account/gateway) niet getest worden, dus dit bestand definieert de vorm en de exacte plekken die
ingevuld moeten worden, en weigert luid zolang er niets gewired is. Zo blijft de belofte eerlijk:
er wordt geen enkele order verstuurd en niets doet alsof het werkt.

Ontwerp (zie EQUITIES_IBKR.md):
  * conform aan `broker.Broker` — dezelfde interface als de Bitvavo-exchanges;
  * `place_market_order` krijgt `amount_eur` (quote-notional) maar IBKR handelt in AANDELEN, dus de
    adapter vertaalt notional → shares via de actuele prijs en rondt af op toegestane stukken;
  * eerst tegen een IBKR **paper trading**-account (aparte poort), daarna SHADOW (echt saldo als
    limiet, order niet verstuurd), pas veel later LIVE achter dezelfde drie-slot-guardrail als crypto.

Poorten (conventie IB Gateway): 4002 paper / 4001 live (of TWS 7497/7496).
"""

from __future__ import annotations

import logging

from .models import Side

log = logging.getLogger("autopilot.ibkr")

_NOT_WIRED = (
    "IBKR-adapter is nog niet gekoppeld: er is een draaiende IB Gateway/TWS + ib_insync nodig, "
    "plus marktdata-permissions. Zie EQUITIES_IBKR.md. Er wordt bewust niets verstuurd."
)


class IBKRBroker:
    """Conform aan broker.Broker. Skelet: elke live-methode weigert tot de Gateway is gewired."""

    def __init__(self, *, host: str = "127.0.0.1", port: int = 4002, client_id: int = 1,
                 paper: bool = True):
        self.host = host
        self.port = port
        self.client_id = client_id
        self.paper = paper
        self._ib = None  # wordt een ib_insync.IB() zodra connect() is geïmplementeerd

    # ── verbinding ────────────────────────────────────────────────
    def connect(self):
        """Verbind met IB Gateway/TWS. Vereist `ib_insync` (lazy geïmporteerd)."""
        try:
            import ib_insync  # noqa: F401 — alleen aanwezig als de gebruiker het installeert
        except ImportError as e:  # noqa: BLE001
            raise NotImplementedError(
                "ib_insync is niet geïnstalleerd (`pip install ib_insync`). " + _NOT_WIRED) from e
        # TODO: ib = ib_insync.IB(); ib.connect(self.host, self.port, clientId=self.client_id)
        raise NotImplementedError(_NOT_WIRED)

    # ── marktdata ─────────────────────────────────────────────────
    def ticker_price(self, pair: str) -> float:
        raise NotImplementedError(_NOT_WIRED)

    def spread_pct(self, pair: str) -> float | None:
        raise NotImplementedError(_NOT_WIRED)

    def order_book(self, pair: str, depth: int = 25) -> dict:
        raise NotImplementedError(_NOT_WIRED)

    def candles(self, pair: str, interval: str = "1h", limit: int = 200,
                since_ms: int | None = None) -> list[tuple]:
        raise NotImplementedError(_NOT_WIRED)

    # ── account ───────────────────────────────────────────────────
    def balances(self) -> dict[str, float]:
        raise NotImplementedError(_NOT_WIRED)

    # ── uitvoering ────────────────────────────────────────────────
    def place_market_order(self, pair: str, side: Side, *, amount_asset: float | None = None,
                           amount_eur: float | None = None, client_order_id: str,
                           style: str = "taker") -> dict:
        # TODO: amount_eur (notional) → shares via ticker_price; Contract(symbol, exchange, currency);
        #       MarketOrder/LimitOrder; markturen-check; multi-valuta/FX; settlement-bewustzijn.
        raise NotImplementedError(_NOT_WIRED)
