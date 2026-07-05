"""Beslissingsjournaal: netto-stance uit cycle-uitkomst + persistentie."""

from datetime import datetime, timezone

from autopilot.decisions import ActionRecord, build_record
from autopilot.factors import compute_reads
from autopilot.models import Candle

NOW = datetime(2026, 7, 1, tzinfo=timezone.utc)
D = 86_400_000


def ramp(start, step, n=70):
    closes = [start + step * i for i in range(n)]
    return [Candle(i * D, c, c, c, c, 1.0) for i, c in enumerate(closes)]


def reads():
    return compute_reads({"AAA-EUR": ramp(100, 1)}, ["AAA-EUR"], NOW)


def test_buy_action_yields_kopen_stance():
    acts = [ActionRecord("AAA-EUR", "BUY", "uitgevoerd", "momentum", eur=20)]
    rec = build_record(reads=reads(), actions=acts, held={"AAA-EUR"}, cash=80, equity=100,
                       halted=False, halt_reason="", paused=False, strategy_ran=True)
    assert rec.stance == "kopen"


def test_no_action_high_cash_yields_cash_stance():
    rec = build_record(reads=reads(), actions=[], held=set(), cash=95, equity=100,
                       halted=False, halt_reason="", paused=False, strategy_ran=True)
    assert rec.stance == "cash"
    assert "considered" in rec.to_dict() and rec.to_dict()["considered"]


def test_blocked_action_yields_wachten():
    acts = [ActionRecord("AAA-EUR", "BUY", "geblokkeerd", "portfolio heat te hoog")]
    rec = build_record(reads=reads(), actions=acts, held=set(), cash=50, equity=100,
                       halted=False, halt_reason="", paused=False, strategy_ran=True)
    assert rec.stance == "wachten"


def test_halted_overrides_everything():
    rec = build_record(reads=reads(), actions=[], held=set(), cash=100, equity=100,
                       halted=True, halt_reason="max drawdown 15%", paused=False, strategy_ran=False)
    assert rec.stance == "gestopt" and "drawdown" in rec.detail


def test_persist_and_read_back(db):
    rec = build_record(reads=reads(), actions=[], held=set(), cash=95, equity=100,
                       halted=False, halt_reason="", paused=False, strategy_ran=True)
    db.log_decision(stance=rec.stance, headline=rec.headline, record=rec.to_dict())
    got = db.recent_decisions(5)
    assert got and got[0]["stance"] == "cash" and got[0]["headline"]
