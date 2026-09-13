"""Broker-abstractie: bestaande exchanges voldoen aan het contract; IBKR-skelet weigert netjes."""

import pytest

from autopilot.broker import REQUIRED_METHODS, Broker
from autopilot.exchange import PaperExchange
from autopilot.ibkr import IBKRBroker
from autopilot.models import Side
from conftest import FakeMarket


def test_paper_exchange_satisfies_broker_protocol(db):
    px = PaperExchange(db, FakeMarket(), capital_eur=100.0)
    assert isinstance(px, Broker)                      # structurele conformance
    for m in REQUIRED_METHODS:
        assert callable(getattr(px, m)), m


def test_ibkr_skeleton_conforms_structurally():
    # het skelet heeft dezelfde methoden (vorm klopt), ook al doet het nog niets
    b = IBKRBroker(paper=True)
    assert isinstance(b, Broker)
    for m in REQUIRED_METHODS:
        assert callable(getattr(b, m)), m


def test_ibkr_refuses_loudly_until_wired():
    b = IBKRBroker(paper=True)
    # elke live-actie weigert met een informatieve fout — er wordt niets verstuurd
    with pytest.raises(NotImplementedError):
        b.ticker_price("AAPL@NASDAQ:USD")
    with pytest.raises(NotImplementedError):
        b.place_market_order("AAPL@NASDAQ:USD", Side.BUY, amount_eur=100.0, client_order_id="x")
    with pytest.raises(NotImplementedError):
        b.connect()
