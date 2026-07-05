"""Multi-factor beslissingslaag — maakt de 'gedachtegang' van een bot expliciet.

Elke factor levert een score in [-1, +1] (bearish → bullish), een gewicht en een
uitleg in mensentaal. Zo kan de site tonen *waarom* een bot koopt, verkoopt of cash
aanhoudt: niet één zwart getal, maar een opgesplitste afweging.

De factoren vallen bewust in twee klassen, want ze zijn NIET gelijkwaardig bewijs:

  PRIJS-FACTOREN (backtestbaar) — momentum, trend, volatiliteit, afstand-tot-top,
    relatieve sterkte. Puur uit candles, deterministisch, in walk-forward te toetsen.
    Dit zijn de enige factoren die standaard aanstaan.

  EXTERNE FACTOREN (alleen vooruit te toetsen, NIET backtestbaar) — nieuws rond de
    coin, wereld-/macronieuws en 'smart money' (bv. gemelde trades van bekende
    personen zoals politici of ondernemers). Ze komen uit gestructureerde events
    (zie research.py / research_events.json) en kleuren alléén de gedachtegang.
    Ze plaatsen NOOIT zelf een order: een externe factor kan hooguit een VOORSTEL
    worden dat verplicht door de risk engine gaat. Waarom dit onderscheid streng is:
    een model dat op oud nieuws wordt getest 'kent de toekomst' (leakage), dus zulke
    signalen kun je niet backtesten — alleen live, in PAPER/SHADOW, forward toetsen.
    Zie experiments/2026_multifactor_decisions.md.

De strategie beslíst nog steeds zelf (deze laag dwingt niets af); de factoren zijn de
onderbouwing die bij die beslissing hoort, plus — als externe events aanstaan — een
optionele overlay-conviction per coin.
"""

from __future__ import annotations

import math
from dataclasses import asdict, dataclass, field
from datetime import datetime

from .models import Candle

# Standaardgewichten. Prijsfactoren domineren; ze zijn de enige die getoetst zijn.
DEFAULT_WEIGHTS = {
    "momentum": 1.0,
    "trend": 1.0,
    "volatility": 0.5,
    "drawdown": 0.3,
    "relative_strength": 0.7,
    # externe factoren — 0 tot je ze bewust aanzet via research.enabled + events
    "news": 0.6,
    "macro": 0.4,
    "smart_money": 0.5,
}

# Wat elke factor betekent, voor de tooltip op de site.
FACTOR_LABELS = {
    "momentum": ("Momentum", "price", "Koers t.o.v. het recente gemiddelde — stijgt of daalt hij?"),
    "trend": ("Trend", "price", "Korte vs. lange trend — is de richting op- of neerwaarts?"),
    "volatility": ("Rust/risico", "price", "Hoe wild beweegt de koers — meer rust telt positief."),
    "drawdown": ("Afstand tot top", "price", "Hoe ver onder de recente piek — diep gezakt telt negatief."),
    "relative_strength": ("Relatieve sterkte", "price", "Sterker of zwakker dan de rest van de mand?"),
    "news": ("Nieuws", "external", "Nieuws rond de coin (forward-only, niet backtestbaar)."),
    "macro": ("Wereld/macro", "external", "Wereldnieuws, centrale banken, economische instituten."),
    "smart_money": ("Smart money", "external", "Gemelde trades van invloedrijke personen/partijen."),
}


def _clip(x: float) -> float:
    return max(-1.0, min(1.0, x))


def _sma(xs: list[float], n: int) -> float | None:
    if len(xs) < n or n <= 0:
        return None
    return sum(xs[-n:]) / n


def _returns(xs: list[float]) -> list[float]:
    return [xs[i] / xs[i - 1] - 1 for i in range(1, len(xs)) if xs[i - 1] > 0]


def _std(xs: list[float]) -> float:
    if len(xs) < 2:
        return 0.0
    m = sum(xs) / len(xs)
    return math.sqrt(sum((x - m) ** 2 for x in xs) / (len(xs) - 1))


@dataclass
class FactorScore:
    key: str
    label: str
    kind: str            # 'price' | 'external'
    score: float         # -1..+1
    weight: float
    detail: str          # mensentaal-uitleg met de concrete getallen


@dataclass
class CoinRead:
    """De volledige factor-lezing voor één coin."""
    pair: str
    conviction: float             # gewogen som van de factoren, -1..+1
    stance: str                   # 'bullish' | 'neutraal' | 'bearish'
    factors: list[FactorScore] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "pair": self.pair,
            "conviction": round(self.conviction, 3),
            "stance": self.stance,
            "factors": [asdict(f) | {"score": round(f.score, 3)} for f in self.factors],
        }


def _price_factors(closes: list[float], basket_ret: float, weights: dict) -> list[FactorScore]:
    out: list[FactorScore] = []
    price = closes[-1]

    # Momentum: koers vs. 20-punts gemiddelde.
    sma20 = _sma(closes, 20)
    if sma20:
        mom = (price / sma20 - 1)
        out.append(FactorScore("momentum", *FACTOR_LABELS["momentum"][:2],
                               score=_clip(mom / 0.15), weight=weights["momentum"],
                               detail=f"{mom * 100:+.1f}% t.o.v. 20-daags gemiddelde"))

    # Trend: 10- vs 30-punts gemiddelde.
    sf, sl = _sma(closes, 10), _sma(closes, 30)
    if sf and sl:
        tr = (sf / sl - 1)
        arrow = "opwaarts" if tr > 0 else "neerwaarts"
        out.append(FactorScore("trend", *FACTOR_LABELS["trend"][:2],
                               score=_clip(tr / 0.10), weight=weights["trend"],
                               detail=f"korte trend {arrow} ({tr * 100:+.1f}%)"))

    # Volatiliteit: lage vol = positief (rust). Rond 3%/dag = neutraal-negatief.
    rets = _returns(closes[-21:])
    vol = _std(rets)
    if rets:
        vscore = _clip((0.03 - vol) / 0.03)
        out.append(FactorScore("volatility", *FACTOR_LABELS["volatility"][:2],
                               score=vscore, weight=weights["volatility"],
                               detail=f"dagvolatiliteit {vol * 100:.1f}%"))

    # Afstand tot recente top (60): diep eronder = negatief.
    window = closes[-60:]
    peak = max(window)
    if peak > 0:
        dd = (price / peak - 1)  # ≤ 0
        out.append(FactorScore("drawdown", *FACTOR_LABELS["drawdown"][:2],
                               score=_clip(dd / 0.30), weight=weights["drawdown"],
                               detail=f"{dd * 100:.1f}% onder de 60-daags top"))

    # Relatieve sterkte vs. de mand (op basis van de laatste return).
    own_ret = (closes[-1] / closes[-2] - 1) if len(closes) >= 2 and closes[-2] > 0 else 0.0
    rs = own_ret - basket_ret
    out.append(FactorScore("relative_strength", *FACTOR_LABELS["relative_strength"][:2],
                           score=_clip(rs / 0.05), weight=weights["relative_strength"],
                           detail=f"{'sterker' if rs >= 0 else 'zwakker'} dan de mand ({rs * 100:+.1f}%)"))
    return out


def _external_factors(pair: str, events: list[dict], now: datetime, weights: dict) -> list[FactorScore]:
    """Zet gestructureerde events om naar externe factoren. Elk event:
      {"pair":"BTC-EUR"|"*", "kind":"news"|"macro"|"smart_money",
       "direction":-1|0|1, "confidence":0..1, "rationale":"...", "expires":ISO?}
    '*' = geldt voor alle coins (bv. wereldnieuws)."""
    base = pair.split("-")[0]
    buckets: dict[str, list[dict]] = {"news": [], "macro": [], "smart_money": []}
    for ev in events:
        kind = str(ev.get("kind", "news"))
        if kind not in buckets:
            continue
        tgt = str(ev.get("pair", "*"))
        if tgt not in ("*", pair, base):
            continue
        buckets[kind].append(ev)

    out: list[FactorScore] = []
    for kind, evs in buckets.items():
        if not evs:
            continue
        # Confidence-gewogen richting → score; det = kortste onderbouwing.
        num = sum(int(e.get("direction", 0)) * float(e.get("confidence", 0)) for e in evs)
        den = sum(float(e.get("confidence", 0)) for e in evs) or 1.0
        score = _clip(num / den)
        top = max(evs, key=lambda e: float(e.get("confidence", 0)))
        why = str(top.get("rationale", "")).strip() or f"{len(evs)} event(s)"
        out.append(FactorScore(kind, *FACTOR_LABELS[kind][:2], score=score,
                               weight=weights[kind], detail=f"{why} ({len(evs)}×)"))
    return out


def compute_reads(candles: dict[str, list[Candle]], pairs: list[str], now: datetime,
                  events: list[dict] | None = None,
                  weights: dict | None = None) -> dict[str, CoinRead]:
    """Bereken per coin de factor-lezing. `events` = externe gestructureerde events
    (leeg/None = alleen prijsfactoren, de veilige default)."""
    w = {**DEFAULT_WEIGHTS, **(weights or {})}
    events = events or []

    # mand-return (mediaan laatste return) voor relatieve sterkte
    last_rets = []
    closes_by: dict[str, list[float]] = {}
    for pair in pairs:
        c = candles.get(pair) or []
        if len(c) >= 2:
            closes = [x.close for x in c]
            closes_by[pair] = closes
            if closes[-2] > 0:
                last_rets.append(closes[-1] / closes[-2] - 1)
    last_rets.sort()
    basket_ret = last_rets[len(last_rets) // 2] if last_rets else 0.0

    reads: dict[str, CoinRead] = {}
    for pair in pairs:
        closes = closes_by.get(pair)
        factors: list[FactorScore] = []
        if closes and len(closes) >= 5:
            factors += _price_factors(closes, basket_ret, w)
        factors += _external_factors(pair, events, now, w)
        if not factors:
            continue
        tw = sum(f.weight for f in factors) or 1.0
        conviction = sum(f.score * f.weight for f in factors) / tw
        stance = ("bullish" if conviction > 0.15 else
                  "bearish" if conviction < -0.15 else "neutraal")
        reads[pair] = CoinRead(pair=pair, conviction=conviction, stance=stance, factors=factors)
    return reads


def market_summary(reads: dict[str, CoinRead]) -> dict:
    """Een compacte 'markt-lezing' over alle coins samen, voor de kop van het paneel."""
    if not reads:
        return {"tone": "onbekend", "avg_conviction": 0.0, "n_bullish": 0, "n_bearish": 0}
    convs = [r.conviction for r in reads.values()]
    avg = sum(convs) / len(convs)
    n_bull = sum(1 for r in reads.values() if r.stance == "bullish")
    n_bear = sum(1 for r in reads.values() if r.stance == "bearish")
    tone = ("risk-on" if avg > 0.12 else "risk-off" if avg < -0.12 else "gemengd")
    return {"tone": tone, "avg_conviction": round(avg, 3),
            "n_bullish": n_bull, "n_bearish": n_bear, "n": len(reads)}
