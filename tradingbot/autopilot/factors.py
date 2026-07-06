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


def _rsi(closes: list[float], n: int = 14) -> float | None:
    """Klassieke RSI (0..100). Gebruikt voor context: is een coin al over-/onderkocht?"""
    if len(closes) < n + 1:
        return None
    gains, losses = [], []
    for i in range(len(closes) - n, len(closes)):
        ch = closes[i] - closes[i - 1]
        gains.append(max(ch, 0.0))
        losses.append(max(-ch, 0.0))
    ag, al = sum(gains) / n, sum(losses) / n
    if al == 0:
        return 100.0
    rs = ag / al
    return 100.0 - 100.0 / (1.0 + rs)


def _extension(closes: list[float]) -> float:
    """Hoe 'uitgerekt' de koers is: -1 (fors onderkocht) .. +1 (fors overkocht).
    Combineert RSI en de afstand boven het 20-daags gemiddelde. Context voor het
    dempen van externe signalen: bullish nieuws telt minder als alles al ver gestegen is."""
    sma20 = _sma(closes, 20)
    above = (closes[-1] / sma20 - 1) if sma20 else 0.0
    rsi = _rsi(closes)
    rsi_ext = ((rsi - 50) / 50) if rsi is not None else 0.0   # -1..+1
    return _clip(0.6 * rsi_ext + 0.4 * _clip(above / 0.15))


@dataclass
class FactorScore:
    key: str
    label: str
    kind: str            # 'price' | 'external'
    score: float         # -1..+1
    weight: float        # basisgewicht (vast, per factortype)
    detail: str          # mensentaal-uitleg met de concrete getallen
    reliability: float = 0.5      # geleerde precisie (0..1); 0,5 = nog geen bewijs
    weight_effective: float = 0.0  # basisgewicht × betrouwbaarheids-multiplier
    n_obs: int = 0                # aantal beoordeelde observaties achter de betrouwbaarheid


@dataclass
class CoinRead:
    """De volledige factor-lezing voor één coin."""
    pair: str
    conviction: float             # betrouwbaarheids-gewogen som van de factoren, -1..+1
    stance: str                   # 'bullish' | 'neutraal' | 'bearish'
    confidence: float = 0.0       # 0..1: hoe eensgezind + hoe betrouwbaar de factoren zijn
    factors: list[FactorScore] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "pair": self.pair,
            "conviction": round(self.conviction, 3),
            "confidence": round(self.confidence, 3),
            "stance": self.stance,
            "factors": [asdict(f) | {"score": round(f.score, 3),
                                     "weight_effective": round(f.weight_effective, 3)}
                        for f in self.factors],
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


def _event_strength(ev: dict, now: datetime) -> float:
    """Effectieve zekerheid van één event: basis-confidence × versheid × bron-vertrouwen.
    Rijkere velden zijn optioneel — ontbreken ze, dan telt alleen `confidence`.
      confidence   basis 0..1
      magnitude    0..1 hoe groot de claim is (default 1)
      n_sources    aantal onafhankelijke bronnen (meer = betrouwbbaarder)
      published    ISO-tijd; ouder nieuws vervaagt (halfwaardetijd ~48u)
    """
    conf = float(ev.get("confidence", 0))
    mag = float(ev.get("magnitude", 1.0))
    n_src = int(ev.get("n_sources", len(ev.get("sources", [])) or 1))
    src_trust = min(1.0, 0.5 + 0.25 * n_src)          # 1 bron→0,75; 2→1,0; capt
    fresh = 1.0
    pub = ev.get("published")
    if pub:
        try:
            age_h = max(0.0, (now - datetime.fromisoformat(pub)).total_seconds() / 3600)
            fresh = 0.5 ** (age_h / 48.0)             # halveert elke 48 uur
        except (ValueError, TypeError):
            pass
    return _clip(conf * mag * src_trust * fresh)


def _slug(s: str) -> str:
    return "".join(c if c.isalnum() else "_" for c in s.lower()).strip("_")[:24]


def _external_factors(pair: str, events: list[dict], now: datetime, weights: dict,
                      extension: float) -> list[FactorScore]:
    """Zet gestructureerde events om naar externe factoren. Elk event:
      {"pair":"BTC-EUR"|"*", "kind":"news"|"macro"|"smart_money",
       "direction":-1|0|1, "confidence":0..1, "rationale":"...",
       "entity"?, "source"?, "magnitude"?, "n_sources"?, "published"?, "expires"?}
    '*' = geldt voor alle coins (bv. wereldnieuws).

    Elke bron/persoon krijgt zijn EIGEN factor (key `kind:entity`), zodat de leerlus per
    entiteit een track record opbouwt: Trump, Musk, Reuters en de Fed verdienen los hun
    plek op basis van gemeten netto-edge — niemand is vooraf 'belangrijk'.

    Context: een bullish extern signaal wordt gedempt als de coin al fors is opgelopen
    (hoge `extension`) — dezelfde tweet weegt anders bij +18% dan bij -18%."""
    base = pair.split("-")[0]
    groups: dict[tuple[str, str], list[dict]] = {}
    for ev in events:
        kind = str(ev.get("kind", "news"))
        if kind not in ("news", "macro", "smart_money"):
            continue
        tgt = str(ev.get("pair", "*"))
        if tgt not in ("*", pair, base):
            continue
        attr = str(ev.get("entity") or ev.get("source") or "").strip()
        groups.setdefault((kind, attr), []).append(ev)

    out: list[FactorScore] = []
    for (kind, attr), evs in groups.items():
        num = sum(int(e.get("direction", 0)) * _event_strength(e, now) for e in evs)
        den = sum(_event_strength(e, now) for e in evs) or 1.0
        score = _clip(num / den)
        damp = 1.0 - 0.5 * _clip(score * extension)   # zelfde teken → tot 50% demping
        score *= damp
        top = max(evs, key=lambda e: _event_strength(e, now))
        why = str(top.get("rationale", "")).strip() or f"{len(evs)} event(s)"
        ctx = " · gedempt (koers al uitgerekt)" if damp < 0.9 else ""
        key = f"{kind}:{_slug(attr)}" if attr else kind
        label = FACTOR_LABELS[kind][0] + (f" · {attr}" if attr else "")
        out.append(FactorScore(key, label, "external", score=score,
                               weight=weights[kind], detail=f"{why} ({len(evs)}×){ctx}"))
    return out


def _reliability_multiplier(precision: float) -> float:
    return max(0.4, min(1.6, 1.0 + (precision - 0.5) * 3.0))


def compute_reads(candles: dict[str, list[Candle]], pairs: list[str], now: datetime,
                  events: list[dict] | None = None,
                  weights: dict | None = None,
                  reliabilities: dict[str, dict] | None = None) -> dict[str, CoinRead]:
    """Bereken per coin de factor-lezing.

    `events`        externe gestructureerde events (leeg/None = alleen prijsfactoren).
    `reliabilities` per factor-key {'precision','n',...} uit de leerlus; bepaalt het
                    effectieve gewicht — een factor die het vaak mis had, vervaagt."""
    w = {**DEFAULT_WEIGHTS, **(weights or {})}
    events = events or []
    rel = reliabilities or {}

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
            factors += _external_factors(pair, events, now, w, _extension(closes))
        else:
            factors += _external_factors(pair, events, now, w, 0.0)
        if not factors:
            continue

        # geleerde prestatie → effectief gewicht per factor. Bij voorkeur op basis van
        # de netto verwachte return (weight_mult, na kosten); anders terugval op accuracy.
        for f in factors:
            info = rel.get(f.key, {})
            f.reliability = float(info.get("precision", 0.5))
            f.n_obs = int(info.get("n", 0))
            mult = info.get("weight_mult")
            if mult is None:
                mult = _reliability_multiplier(f.reliability)
            f.weight_effective = f.weight * float(mult)

        tw = sum(f.weight_effective for f in factors) or 1.0
        conviction = sum(f.score * f.weight_effective for f in factors) / tw
        stance = ("bullish" if conviction > 0.15 else
                  "bearish" if conviction < -0.15 else "neutraal")

        # confidence: hoe eensgezind de factoren zijn (aandeel gewicht in de netto-richting),
        # geschaald met de overtuiging. Weinig eensgezind of zwak → lage confidence.
        pos_w = sum(f.weight_effective for f in factors if f.score > 0.1)
        neg_w = sum(f.weight_effective for f in factors if f.score < -0.1)
        agree = (max(pos_w, neg_w) / tw) if tw else 0.0
        confidence = _clip(abs(conviction)) * (0.4 + 0.6 * agree)

        reads[pair] = CoinRead(pair=pair, conviction=conviction, stance=stance,
                               confidence=confidence, factors=factors)
    return reads


def market_summary(reads: dict[str, CoinRead]) -> dict:
    """Compacte 'markt-lezing' + Decision-Intelligence-telling over alle coins samen."""
    if not reads:
        return {"tone": "onbekend", "avg_conviction": 0.0, "n_bullish": 0, "n_bearish": 0,
                "n": 0, "avg_confidence": 0.0, "f_pos": 0, "f_neg": 0, "f_neutral": 0}
    convs = [r.conviction for r in reads.values()]
    avg = sum(convs) / len(convs)
    n_bull = sum(1 for r in reads.values() if r.stance == "bullish")
    n_bear = sum(1 for r in reads.values() if r.stance == "bearish")
    tone = ("risk-on" if avg > 0.12 else "risk-off" if avg < -0.12 else "gemengd")
    # tel alle individuele factor-signalen (over alle coins) — de "52 factoren bekeken"-teller
    f_pos = f_neg = f_neu = 0
    for r in reads.values():
        for f in r.factors:
            if f.score > 0.1:
                f_pos += 1
            elif f.score < -0.1:
                f_neg += 1
            else:
                f_neu += 1
    avg_conf = sum(r.confidence for r in reads.values()) / len(reads)
    return {"tone": tone, "avg_conviction": round(avg, 3),
            "n_bullish": n_bull, "n_bearish": n_bear, "n": len(reads),
            "avg_confidence": round(avg_conf, 3),
            "f_pos": f_pos, "f_neg": f_neg, "f_neutral": f_neu,
            "n_factors": f_pos + f_neg + f_neu}


def counterfactuals(read: CoinRead, limit: int = 3) -> list[dict]:
    """Wat-als-analyse: hoeveel verandert de overtuiging als je één factor wegdenkt?
    Zo zie je welke factor doorslaggevend was — en waarom de bot (on)zeker is.
    Voorbeeld: 'zonder Wereld/macro was de overtuiging +12 i.p.v. −3'."""
    facs = read.factors
    tw = sum(f.weight_effective for f in facs)
    base = read.conviction
    out = []
    for f in facs:
        rem = tw - f.weight_effective
        if rem <= 0:
            continue
        without = sum(g.score * g.weight_effective for g in facs if g is not f) / rem
        out.append({"label": f.label, "kind": f.kind,
                    "without": round(without, 3), "delta": round(base - without, 3)})
    out.sort(key=lambda d: abs(d["delta"]), reverse=True)
    return out[:limit]


def top_reasons(read: CoinRead, want_positive: bool, limit: int = 5) -> list[dict]:
    """De sterkst bijdragende factoren voor (of tegen) een coin — voor 'Top 5 redenen'."""
    facs = [f for f in read.factors
            if (f.score > 0) == want_positive and abs(f.score) > 0.05]
    facs.sort(key=lambda f: abs(f.score * f.weight_effective), reverse=True)
    return [{"label": f.label, "detail": f.detail, "kind": f.kind,
             "reliability": round(f.reliability, 2), "n_obs": f.n_obs}
            for f in facs[:limit]]
