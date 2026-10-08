"""Self-learning strategie: handelt op de (geleerde) factor-overtuiging uit compute_reads."""

from datetime import datetime, timezone

from autopilot.models import Candle, Position, Side
from autopilot.strategies import get_strategy
from conftest import make_config

NOW = datetime(2026, 7, 1, 10, 0, tzinfo=timezone.utc)
D = 3_600_000


def up(n=200):
    return [Candle(i * D, (c := 100.0 * (1.01 ** i)), c, c, c, 1.0) for i in range(n)]


def down(n=200):
    return [Candle(i * D, (c := 300.0 * (0.99 ** i)), c, c, c, 1.0) for i in range(n)]


def _strat(db, pairs, **params):
    cfg = make_config(pairs=pairs, strategy={"name": "adaptive", "params": params})
    return get_strategy(cfg, db), cfg


def test_buys_strongest_uptrend_sells_nothing_when_flat(db):
    strat, _ = _strat(db, ["AAA-EUR", "BBB-EUR"])
    candles = {"AAA-EUR": up(), "BBB-EUR": down()}          # AAA bullish, BBB bearish
    sigs = strat.generate_signals(candles, [], NOW)
    buys = [s for s in sigs if s.side == Side.BUY]
    assert any(s.pair == "AAA-EUR" for s in buys)          # koopt de sterke uptrend
    assert all(s.pair != "BBB-EUR" or s.side != Side.BUY for s in sigs)  # koopt de downtrend niet
    assert all(s.strategy == "adaptive" for s in sigs)


def test_sells_held_position_when_conviction_flips_bearish(db):
    strat, _ = _strat(db, ["BBB-EUR"], sell_threshold=-0.05)
    candles = {"BBB-EUR": down()}                          # dalende trend → negatieve overtuiging
    pos = [Position(pair="BBB-EUR", amount=1.0, avg_price=100.0, opened_at=NOW.isoformat())]
    sigs = strat.generate_signals(candles, pos, NOW)
    assert any(s.pair == "BBB-EUR" and s.side == Side.SELL for s in sigs)


def test_respects_max_positions(db):
    pairs = [f"C{i}-EUR" for i in range(6)]
    strat, _ = _strat(db, pairs, max_positions=2, buy_threshold=0.05, min_confidence=0.0)
    candles = {p: up() for p in pairs}                     # allemaal bullish
    buys = [s for s in strat.generate_signals(candles, [], NOW) if s.side == Side.BUY]
    assert len(buys) == 2                                  # niet meer dan max_positions nieuwe kopen


def test_no_candles_no_signals(db):
    strat, _ = _strat(db, ["AAA-EUR"])
    assert strat.generate_signals({}, [], NOW) == []


def test_cost_gate_blocks_when_fees_exceed_expected_edge(db):
    # absurd hoge kosten → de kostenpoort laat zelfs een sterke uptrend niet door
    cfg = make_config(pairs=["AAA-EUR"], costs={"taker_fee_pct": 2.0, "slippage_pct": 1.0},
                      strategy={"name": "adaptive", "params": {"buy_threshold": 0.1,
                                "min_confidence": 0.0, "edge_scale": 0.08}})
    strat = get_strategy(cfg, db)
    buys = [s for s in strat.generate_signals({"AAA-EUR": up()}, [], NOW) if s.side == Side.BUY]
    assert buys == []


def test_cost_gate_allows_when_edge_beats_fees(db):
    # normale kosten → dezelfde sterke uptrend mag wél gekocht worden
    cfg = make_config(pairs=["AAA-EUR"], costs={"taker_fee_pct": 0.25, "slippage_pct": 0.1},
                      strategy={"name": "adaptive", "params": {"buy_threshold": 0.1,
                                "min_confidence": 0.0, "edge_scale": 0.08}})
    strat = get_strategy(cfg, db)
    buys = [s for s in strat.generate_signals({"AAA-EUR": up()}, [], NOW) if s.side == Side.BUY]
    assert buys


def test_rotation_sells_weakest_to_buy_better_when_no_cash(db):
    # geen cash (alles in munten): BBB is een zwakke/vlakke holding (niet gekanteld),
    # AAA een sterke kans → rotatie ruilt ze.
    flat = [Candle(i * D, 100.0, 100.0, 100.0, 100.0, 1.0) for i in range(200)]
    cfg = make_config(pairs=["AAA-EUR", "BBB-EUR"],
                      strategy={"name": "adaptive", "params": {"buy_threshold": 0.1,
                                "min_confidence": 0.0, "edge_scale": 0.08, "rotate_margin": 0.1}})
    strat = get_strategy(cfg, db)
    db.set_meta("bot_cash_eur", "0")                       # geen cash → alleen rotatie kan handelen
    pos = [Position(pair="BBB-EUR", amount=1.0, avg_price=100.0, opened_at=NOW.isoformat())]
    candles = {"AAA-EUR": up(), "BBB-EUR": flat}           # AAA sterk op, BBB vlak/zwak
    sigs = strat.generate_signals(candles, pos, NOW)
    assert any(s.pair == "BBB-EUR" and s.side == Side.SELL for s in sigs)   # zwakste eruit
    assert any(s.pair == "AAA-EUR" and s.side == Side.BUY for s in sigs)    # sterkste erin
    order = [s.pair for s in sigs]
    assert order.index("BBB-EUR") < order.index("AAA-EUR")  # eerst verkopen (cash vrij), dan kopen


def test_no_rotation_when_cash_is_available(db):
    cfg = make_config(pairs=["AAA-EUR", "BBB-EUR"],
                      strategy={"name": "adaptive", "params": {"buy_threshold": 0.1,
                                "min_confidence": 0.0, "edge_scale": 0.08}})
    strat = get_strategy(cfg, db)
    db.set_meta("bot_cash_eur", "1000")                    # genoeg cash → geen rotatie nodig
    pos = [Position(pair="BBB-EUR", amount=1.0, avg_price=100.0, opened_at=NOW.isoformat())]
    sigs = strat.generate_signals({"AAA-EUR": up(), "BBB-EUR": down()}, pos, NOW)
    # BBB wordt niet als rotatie-ruil verkocht (hooguit als de overtuiging kantelt via de normale regel)
    assert not any(s.strategy == "adaptive" and "rotatie" in s.reason for s in sigs)
