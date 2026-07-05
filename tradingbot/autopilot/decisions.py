"""Beslissingsjournaal — de 'gedachtegang' per cycle, leesbaar op de site.

Na elke cycle legt de engine hier vast *waarom* de bot deed wat hij deed: welke
factoren meespeelden (uit factors.py), wat er concreet is gekocht/verkocht, wat de
risk engine blokkeerde, en — belangrijk — waarom er soms juist niets gebeurt
(cash aanhouden, net geherbalanceerd, regime-filter, enz.).

Dit is puur observeerbaarheid: het journaal beslist niets, het legt de reeds
genomen beslissing vast in mensentaal + de onderliggende getallen.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .factors import CoinRead, market_summary


@dataclass
class ActionRecord:
    pair: str
    side: str            # BUY | SELL
    status: str          # uitgevoerd | geblokkeerd | mislukt
    reason: str          # de reden van de strategie (of de blokkade-reden)
    eur: float | None = None


@dataclass
class DecisionRecord:
    stance: str                      # kopen | verkopen | herbalanceren | cash | wachten | gestopt | pauze
    headline: str                    # één regel voor bovenaan
    detail: str                      # iets uitgebreider, 1–2 zinnen
    market: dict = field(default_factory=dict)     # market_summary()
    actions: list[dict] = field(default_factory=list)
    considered: list[dict] = field(default_factory=list)  # top coin-reads (factoren)

    def to_dict(self) -> dict:
        return {
            "stance": self.stance, "headline": self.headline, "detail": self.detail,
            "market": self.market, "actions": self.actions, "considered": self.considered,
        }


def _top_reads(reads: dict[str, CoinRead], held: set[str], limit: int = 8) -> list[dict]:
    """De meest overtuigende lezingen eerst; coins die we aanhouden krijgen voorrang
    zodat je altijd ziet waarom we ze (nog) vasthouden."""
    items = list(reads.values())
    items.sort(key=lambda r: (r.pair not in held, -abs(r.conviction)))
    return [r.to_dict() for r in items[:limit]]


def build_record(*, reads: dict[str, CoinRead], actions: list[ActionRecord],
                 held: set[str], cash: float, equity: float,
                 halted: bool, halt_reason: str, paused: bool,
                 strategy_ran: bool) -> DecisionRecord:
    """Vertaal de cycle-uitkomst naar een leesbare beslissing."""
    market = market_summary(reads)
    considered = _top_reads(reads, held)
    acts = [a.__dict__ for a in actions]
    executed = [a for a in actions if a.status == "uitgevoerd"]
    buys = [a for a in executed if a.side == "BUY"]
    sells = [a for a in executed if a.side == "SELL"]
    cash_pct = (cash / equity * 100) if equity > 0 else 0.0

    if halted:
        return DecisionRecord("gestopt", "Bot is permanent gestopt",
                              halt_reason or "kill-switch geraakt", market, acts, considered)
    if paused:
        return DecisionRecord("pauze", "Bot pauzeert (dag-kill-switch)",
                              "Na een te grote dagdaling handelt de bot 24 uur niet.",
                              market, acts, considered)

    if buys and sells:
        stance, head = "herbalanceren", f"Herbalanceren: {len(buys)} koop, {len(sells)} verkoop"
    elif buys:
        stance, head = "kopen", f"Kopen: {', '.join(a.pair for a in buys[:3])}"
    elif sells:
        stance, head = "verkopen", f"Afbouwen: {', '.join(a.pair for a in sells[:3])}"
    else:
        # Niets uitgevoerd — leg uit waarom.
        if not strategy_ran:
            stance, head = "wachten", "Nog geen beoordeling deze cycle"
        elif any(a.status == "geblokkeerd" for a in actions):
            stance = "wachten"
            head = "Signaal door risk engine tegengehouden"
        else:
            stance = "cash"
            head = (f"Cash aanhouden ({cash_pct:.0f}%) — geen overtuigende kans"
                    if cash_pct > 5 else "Vasthouden — geen reden om te wijzigen")

    tone = market.get("tone", "onbekend")
    detail = (f"Marktbeeld: {tone} "
              f"({market.get('n_bullish', 0)} bullish / {market.get('n_bearish', 0)} bearish). ")
    if stance == "cash":
        detail += f"De factoren geven te weinig richting; {cash_pct:.0f}% staat in EUR."
    elif stance == "herbalanceren":
        detail += "Gewichten liepen buiten de band; posities teruggezet naar doel."
    elif stance in ("kopen", "verkopen"):
        top = ", ".join(f"{a.pair} ({a.reason})" for a in executed[:2])
        detail += top
    elif stance == "wachten":
        detail += "Er was deze cycle geen actie nodig of toegestaan."

    return DecisionRecord(stance, head, detail, market, acts, considered)
