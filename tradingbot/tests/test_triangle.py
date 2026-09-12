"""Driehoeks-observer: de kosten-drempel maakt de meeste 'arbitrage' dood."""

import pytest

from autopilot.triangle import best_edge


def test_perfect_alignment_loses_three_fees():
    # p_ab precies = p_ae / p_be → geen ruwe discrepantie → puur de 3× fee als verlies
    p_ae, p_be = 3000.0, 60000.0        # ETH €3000, BTC €60000
    p_ab = p_ae / p_be                  # 1 ETH = 0.05 BTC (exact)
    res = best_edge(p_ae, p_be, p_ab, fee_pct=0.25, base="ETH", bridge="BTC")
    assert res.net_edge == pytest.approx((1 - 0.0025) ** 3 - 1, rel=1e-9)
    assert res.net_edge < 0                      # ~-0,75%: geen gratis geld


def test_small_discrepancy_still_negative_after_fees():
    # 0,3% scheefstand < 0,75% drempel → nog steeds verlieslatend
    p_ae, p_be = 3000.0, 60000.0
    p_ab = (p_ae / p_be) * 1.003
    res = best_edge(p_ae, p_be, p_ab, fee_pct=0.25)
    assert res.net_edge < 0


def test_large_discrepancy_finally_positive():
    # pas een grove scheefstand (>0,75%) levert netto iets op — zeldzaam en vluchtig in de praktijk
    p_ae, p_be = 3000.0, 60000.0
    p_ab = (p_ae / p_be) * 1.02          # 2% te duur in de kruismarkt
    res = best_edge(p_ae, p_be, p_ab, fee_pct=0.25)
    assert res.net_edge > 0
    assert res.direction.startswith("EUR->")


def test_direction_flips_with_sign_of_discrepancy():
    p_ae, p_be = 3000.0, 60000.0
    hi = best_edge(p_ae, p_be, (p_ae / p_be) * 1.02, 0.25, "ETH", "BTC")
    lo = best_edge(p_ae, p_be, (p_ae / p_be) * 0.98, 0.25, "ETH", "BTC")
    assert hi.direction != lo.direction          # tegengestelde scheefstand → andere looprichting


def test_maker_fees_lower_the_hurdle():
    p_ae, p_be = 3000.0, 60000.0
    p_ab = (p_ae / p_be) * 1.006
    taker = best_edge(p_ae, p_be, p_ab, 0.25)
    maker = best_edge(p_ae, p_be, p_ab, 0.15)
    assert maker.net_edge > taker.net_edge       # lagere fee per leg → minder streng


def test_rejects_nonpositive_prices():
    with pytest.raises(ValueError):
        best_edge(0.0, 60000.0, 0.05, 0.25)


# ── orderboek-diepte (statistiek voor de observer) ─────────────────

def test_book_spread_pct():
    from autopilot.triangle import book_spread_pct
    assert book_spread_pct([[99.0, 1]], [[101.0, 1]]) == pytest.approx(2.0)
    assert book_spread_pct([], [[101.0, 1]]) is None


def test_executable_eur_walks_the_book():
    from autopilot.triangle import executable_eur
    book = [[100.0, 2], [101.0, 3]]     # 200 EUR op level 1, +303 op level 2
    assert executable_eur(book, 150) == pytest.approx(150)      # ruim binnen level 1
    assert executable_eur(book, 1000) == pytest.approx(503)     # boek op → minder dan budget
