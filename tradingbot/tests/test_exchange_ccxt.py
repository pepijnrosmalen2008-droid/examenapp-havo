"""Bitvavo-client bevat de door de API vereiste operatorId (anders weigert elke live-order)."""

import os

from autopilot.exchange import _new_ccxt


def test_ccxt_client_has_operator_id():
    x = _new_ccxt()
    assert x.options.get("operatorId") == 1          # default


def test_operator_id_overridable_via_env(monkeypatch):
    monkeypatch.setenv("BITVAVO_OPERATOR_ID", "777")
    assert _new_ccxt().options.get("operatorId") == 777
