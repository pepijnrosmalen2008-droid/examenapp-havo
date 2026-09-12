"""Driehoeks-arbitrage — OBSERVER, geen handelaar.

Op één venue kun je een driehoek proberen: EUR → A → B → EUR (en de omgekeerde weg). Als de
directe en de synthetische prijs uiteenlopen, is er in theorie risicovrije winst. In de praktijk
staat daar een harde muur: drie legs betekent drie keer fee. Bij taker 0,25% is dat (1−0,0025)³ ≈
0,9925, dus **−0,75% vóórdat er ook maar iets verdiend is**. De ruwe discrepantie moet die drempel
overtreffen én blijven bestaan tot onze thuis-pc drie sequentiële orders heeft verstuurd.

Daarom handelt deze module niet. Hij *meet* alleen: bestaat er op Bitvavo een driehoek met een
netto-positieve edge ná kosten? De eerlijke verwachting is "vrijwel nooit, en als het gebeurt is
het weg vóór we kunnen handelen". Die falsificatie zwart-op-wit hebben is het doel — geen orders.

Een driehoek vereist een crypto-crypto-kruismarkt (A-B). Bitvavo is EUR-georiënteerd; bestaat de
kruismarkt niet, dan is er simpelweg geen driehoek — ook dat is een geldige uitkomst.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class TriangleResult:
    base: str            # A
    bridge: str          # B
    direction: str       # 'EUR->A->B->EUR' of 'EUR->B->A->EUR'
    gross_mult: float    # productmultiplier vóór kosten (1.0 = geen discrepantie)
    net_edge: float      # fractie ná 3× fee (bv. -0.0075 = -0,75%)


def _net(mult: float, fee_pct: float) -> float:
    """Netto-edge als fractie ná drie legs fee."""
    return mult * (1 - fee_pct / 100) ** 3 - 1


def best_edge(p_ae: float, p_be: float, p_ab: float, fee_pct: float,
              base: str = "A", bridge: str = "B") -> TriangleResult:
    """Beste van beide richtingen.

    p_ae = prijs A in EUR (1 A = p_ae EUR); p_be = prijs B in EUR; p_ab = prijs A in B (1 A = p_ab B).
    Geen-arbitrage houdt in: p_ab ≈ p_ae / p_be. Elke afwijking daarvan is de ruwe discrepantie.
    """
    if min(p_ae, p_be, p_ab) <= 0:
        raise ValueError("prijzen moeten positief zijn")
    # EUR -> A -> B -> EUR : mult = p_ab * p_be / p_ae
    fwd = p_ab * p_be / p_ae
    # EUR -> B -> A -> EUR : mult = p_ae / (p_be * p_ab)
    rev = p_ae / (p_be * p_ab)
    if _net(fwd, fee_pct) >= _net(rev, fee_pct):
        return TriangleResult(base, bridge, f"EUR->{base}->{bridge}->EUR", fwd, _net(fwd, fee_pct))
    return TriangleResult(base, bridge, f"EUR->{bridge}->{base}->EUR", rev, _net(rev, fee_pct))


def scan_prices(p_ae: float, p_be: float, p_ab: float, fee_pct: float,
                base: str = "A", bridge: str = "B") -> TriangleResult:
    """Alias voor best_edge — de 'observatie' voor een set van drie live prijzen."""
    return best_edge(p_ae, p_be, p_ab, fee_pct, base, bridge)
