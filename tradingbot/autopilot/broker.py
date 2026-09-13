"""Broker-abstractie — het contract waarop de execution-engine leunt.

Vandaag draait alles op Bitvavo (crypto, spot, EUR-paren). Om later wereldwijde aandelen te kunnen
verhandelen via Interactive Brokers (IBKR) zónder de engine te herschrijven, formaliseren we hier de
interface die de engine feitelijk al gebruikt. `PaperExchange`, `ShadowExchange` en `BitvavoClient`
voldoen er al aan; een `IBKRBroker` hoeft alleen ditzelfde contract te implementeren.

    Strategy → Execution Engine → Broker → (Bitvavo | IBKR | …)

Deze Protocol is bewust een *structurele* typecheck (runtime_checkable): bestaande klassen hoeven
er niet expliciet van te erven. Hij documenteert en test wat de engine nodig heeft — niet meer.

── Waarschuwing: aandelen zijn NIET crypto ──────────────────────────────────────────────────────
Het contract is gelijk, maar de semantiek erachter verschilt wezenlijk. Een IBKR-adapter moet deze
verschillen intern afhandelen (zie EQUITIES_IBKR.md):
  * orders zijn in AANTAL AANDELEN, niet in quote-notional — `amount_eur` moet naar shares vertaald
    worden via een actuele prijs (en afgerond op hele/toegestane stukken);
  * MARKTUREN: aandelenbeurzen zijn niet 24/7 — buiten sessie geen fills; de engine moet weten of
    een markt open is;
  * MEERDERE VALUTA'S: US in USD, UK in GBP, JP in JPY — 'eur'-velden zijn dan een abstractie die
    FX vereist;
  * SETTLEMENT (T+1/T+2), PDT-regels, short-borrow/shortability — bestaan niet in crypto-spot;
  * MARKTDATA-abonnementen per beurs (kosten/permissions) — 170+ markten ≠ 170+ gratis realtime feeds.
Kortom: dit contract maakt de *koppeling* herbruikbaar, niet de hele domeinlogica. De aandelenkant
krijgt daarom vanaf dag één dezelfde discipline: data-kwaliteit → signaal → execution-sim → shadow → live.
"""

from __future__ import annotations

from typing import Protocol, runtime_checkable

from .models import Side


@runtime_checkable
class Broker(Protocol):
    """Het minimale contract dat elke broker-adapter moet bieden (data + uitvoering).

    Mode-specifieke uitbreidingen die de engine met `hasattr` bevraagt en dus optioneel zijn:
      * `real_eur()`          — echt saldo (SHADOW/LIVE limiet-check);
      * `find_order_by_client_id(coid, pair)` — crash-recovery (LIVE);
      * `eur_markets()` / `market_stats()`    — universe-selectie (Bitvavo-specifiek).
    """

    def ticker_price(self, pair: str) -> float: ...

    def spread_pct(self, pair: str) -> float | None: ...

    def order_book(self, pair: str, depth: int = 25) -> dict: ...

    def candles(self, pair: str, interval: str = "1h", limit: int = 200,
                since_ms: int | None = None) -> list[tuple]: ...

    def balances(self) -> dict[str, float]: ...

    def place_market_order(self, pair: str, side: Side, *, amount_asset: float | None = None,
                           amount_eur: float | None = None, client_order_id: str,
                           style: str = "taker") -> dict: ...


# Methodenamen die de engine aanroept — gebruikt door de conformance-test zodat een gewijzigde
# engine-afhankelijkheid niet stilzwijgend het contract breekt.
REQUIRED_METHODS = (
    "ticker_price", "spread_pct", "order_book", "candles", "balances", "place_market_order",
)
