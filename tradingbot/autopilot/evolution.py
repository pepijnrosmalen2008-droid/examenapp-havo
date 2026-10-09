"""Evolutie-laag — de bot schrijft zijn eigen strategie-code, toetst die automatisch, wiret hem
(gated) live in en rolt mislukkingen vanzelf terug.

Dit is Fase 3 op de arena (D37) en de onderzoeker (D38). Het sluit de "self-coding"-lus, maar
binnen de grens die je zelf in AUTONOMOUS_ENGINE_PLAN.md §7 trok:

    "Geen onbeperkte zelf-programmerende loop die live code vervangt. Wél: AI ontwikkelt in een
     afgeschermde omgeving, tests automatisch, stelt verbeteringen voor; uitrol gecontroleerd,
     met versiebeheer en automatische terugval."

Concreet:
  • GENEREREN — `evolve_once` verzint strategie-varianten (parameter-ruimte rond de `adaptive`-
    factorstrategie) en toetst elke OFFLINE via de onderzoeker (backtest + buy-and-hold + de
    adversariële suite). Default-uitkomst = afwijzen (falsificatie-eerst).
  • CODE SCHRIJVEN — alleen een variant die álle toetsen overleeft, wordt als ECHTE .py-module
    weggeschreven in `strategies/generated/` (een registreerbare `Strategy`-subklasse). Elke versie
    is een eigen, onveranderlijk bestand → versiebeheer.
  • LIVE INWIREN (gated) — `load_generated` importeert de actieve modules zodat ze in `_REGISTRY`
    komen; de autonome strategie zet ze als extra roster-leden in de arena. Ze krijgen pas ECHT
    kapitaal als ze zich óók forward-only (na kosten) bewijzen — precies zoals elke andere kandidaat.
  • AUTOMATISCHE TERUGVAL — `auto_retire` trekt een gegenereerde strategie weer uit de roster zodra
    haar live netto-edge negatief blijkt bij genoeg observaties. De arena kiest dan automatisch de
    volgende best-bewezen aanpak (of cash). Geen handmatige rollback nodig.

HARDE VEILIGHEIDSGRENS (bewust, niet configureerbaar): de generator schrijft UITSLUITEND
`Strategy`-subklassen in deze ene map, en die kunnen alleen Signals afgeven. Zelf-geschreven code
raakt NOOIT de risk-engine, de execution-laag of de order-plaatsing aan, en alloceert nooit zelf
geld. De onafhankelijke risk-governor en de bewijs-gated arena blijven de enige poorten naar echt
kapitaal. Zo "past de bot zichzelf live aan" zonder dat een slechte zelf-geschreven regel je saldo
kan leegtrekken.
"""

from __future__ import annotations

import hashlib
import importlib
import json
import logging
import random
from datetime import datetime, timezone
from pathlib import Path

from . import researcher
from .config import AppConfig
from .database import Database
from .models import Candle

log = logging.getLogger("autopilot.evolution")

GEN_DIR = Path(__file__).resolve().parent / "strategies" / "generated"
GEN_PKG = "autopilot.strategies.generated"

# Veilige parameter-ruimte waarbinnen de bot mag "muteren". Bewust begrensd: dit bepaalt gedrag,
# nooit of risk-limieten gelden. Alles hierbuiten kan de generator niet schrijven.
BOUNDS = {
    "candle_interval": ["5m", "15m", "1h"],
    "buy_threshold": (0.08, 0.35),
    "sell_threshold": (-0.25, -0.05),
    "min_confidence": (0.05, 0.30),
    "max_positions": (2, 8),
    "edge_scale": (0.05, 0.12),
    "cost_mult": (1.0, 2.0),
    "rotate_margin": (0.10, 0.30),
}

MODULE_TEMPLATE = '''\
"""AUTO-GEGENEREERD door autopilot/evolution.py — {name} (v{version}), geboren {ts}.

Zelf-geschreven strategie: een variant van de factor-gedreven `adaptive`-strategie met deze door de
bot gekozen, offline-getoetste parameters. Kan ALLEEN Signals afgeven; orders plaatst uitsluitend de
engine ná de risk-engine. NIET met de hand bewerken — dit is een onveranderlijke versie.

Offline bij geboorte: netto-excess t.o.v. buy-and-hold ≈ {excess:+.2f}%, overleeft de adversariële
suite (kosten-stress / shuffle / vertraging / leave-one-out).
"""

from __future__ import annotations

from .. import register
from ..adaptive import AdaptiveFactorStrategy

GENERATED_PARAMS = {params!r}


@register
class {cls}(AdaptiveFactorStrategy):
    name = {name!r}
    candle_interval = {interval!r}

    def __init__(self, cfg, db):
        super().__init__(cfg, db)
        merged = {{**GENERATED_PARAMS, **(self.params or {{}})}}
        self.params = merged
        self.candle_interval = str(merged.get("candle_interval", self.candle_interval))
        self.candle_limit = int(merged.get("candle_limit", self.candle_limit))
'''


def _rand_params(rng: random.Random) -> dict:
    """Trek één variant uit de begrensde ruimte. Deterministisch via de meegegeven rng."""
    p: dict = {"candle_interval": rng.choice(BOUNDS["candle_interval"])}
    for key in ("buy_threshold", "sell_threshold", "min_confidence",
                "edge_scale", "cost_mult", "rotate_margin"):
        lo, hi = BOUNDS[key]
        p[key] = round(rng.uniform(lo, hi), 3)
    lo, hi = BOUNDS["max_positions"]
    p["max_positions"] = rng.randint(lo, hi)
    return p


def _name_for(params: dict) -> str:
    return "gen_" + researcher.hkey("adaptive", params)


def render_module(name: str, params: dict, *, version: int, excess: float) -> str:
    cls = "GeneratedStrategy_" + name.split("_", 1)[1]
    return MODULE_TEMPLATE.format(
        name=name, cls=cls, version=version, ts=datetime.now(timezone.utc).isoformat(timespec="seconds"),
        params=params, interval=params.get("candle_interval", "1h"), excess=excess)


def write_module(name: str, source: str) -> str:
    """Schrijf de module onveranderlijk weg (nooit overschrijven → versiebeheer). Geeft de bestandsnaam."""
    GEN_DIR.mkdir(parents=True, exist_ok=True)
    fname = f"{name}.py"
    path = GEN_DIR / fname
    if not path.exists():                       # bestaande versie nooit overschrijven
        path.write_text(source, encoding="utf-8")
    return fname


def evolve_once(cfg: AppConfig, db: Database, data: dict[str, list[Candle]], *,
                n: int = 12, seed: int = 1, shuffles: int = 40, warmup: int | None = None,
                write: bool = True) -> list[dict]:
    """Genereer n varianten, toets ze offline, schrijf de overlevers als echte code. Geeft overlevers."""
    rng = random.Random(seed)
    survivors: list[dict] = []
    for _ in range(n):
        params = _rand_params(rng)
        key = researcher.hkey("adaptive", params)
        if db.research_seen(key):
            continue
        try:
            res = researcher.evaluate(cfg, "adaptive", params, data, shuffles=shuffles, warmup=warmup)
        except Exception:  # noqa: BLE001 — één kapotte variant stopt de evolutie niet
            log.exception("evolution: variant %s faalde", params)
            continue
        # leg het oordeel vast in hetzelfde onderzoeksregister (dedup + overzicht)
        db.record_research(
            hkey=key, strategy="adaptive", params=json.dumps(params, sort_keys=True),
            return_pct=res["return_pct"], hold_pct=res["hold_pct"], excess_pct=res["excess_pct"],
            trades=res["trades"], verdict=res["verdict"], flags=json.dumps(res["flags"]))
        if res["verdict"] != "kandidaat":
            continue
        name = _name_for(params)
        if any(g["name"] == name for g in db.generated_all()):
            continue                            # al eerder geboren
        source = render_module(name, params, version=1, excess=res["excess_pct"])
        module = write_module(name, source) if write else f"{name}.py"
        db.record_generated(name=name, params=json.dumps(params, sort_keys=True), module=module,
                            status="kandidaat", parent="adaptive", excess_pct=res["excess_pct"])
        survivors.append({**res, "name": name, "module": module})
        log.info("evolution: nieuwe strategie geschreven → %s (excess %.2f%%)", name, res["excess_pct"])
    return survivors


def load_generated(db: Database) -> list[dict]:
    """Importeer de niet-geretireerde modules (registreert ze) en geef hun roster-specs terug.

    Geeft een lijst {name, label, params:{}} voor de autonome strategie. Params zijn al in de klasse
    gebakken, dus de roster-spec heeft ze niet nodig. Een module die niet importeert, wordt
    geretireerd i.p.v. de hele bot te breken (automatische terugval ook bij een schrijf-/importfout).
    """
    specs: list[dict] = []
    for g in db.generated_by_status(("kandidaat", "actief")):
        modname = g["module"][:-3] if g["module"].endswith(".py") else g["module"]
        if not (GEN_DIR / f"{modname}.py").exists():
            db.set_generated_status(g["name"], "retired", "module-bestand ontbreekt")
            continue
        try:
            importlib.import_module(f"{GEN_PKG}.{modname}")
        except Exception:  # noqa: BLE001 — kapotte zelf-geschreven module → retire, niet crashen
            log.exception("evolution: kon %s niet laden; retire", g["name"])
            db.set_generated_status(g["name"], "retired", "module importeerde niet")
            continue
        specs.append({"name": g["name"], "label": g["name"], "params": {}})
    return specs


def auto_retire(db: Database, min_obs: int, *, min_net_edge: float = 0.0) -> list[str]:
    """Trek gegenereerde strategieën met bewezen-negatieve live-edge uit de roster (terugval).

    Alleen retiren bij GENOEG observaties — anders zou ruis een jonge strategie vroegtijdig doden.
    Geeft de namen die zijn geretireerd.
    """
    stats = db.strategy_stats()
    retired: list[str] = []
    active = {g["name"] for g in db.generated_by_status(("kandidaat", "actief"))}
    for name in active:
        s = stats.get(name)
        if not s or (s.get("n") or 0) < min_obs:
            continue
        net = s.get("net_edge")
        if net is not None and net <= min_net_edge:
            db.set_generated_status(name, "retired", f"live netto-edge {net:+.4f} ≤ {min_net_edge}")
            retired.append(name)
            log.info("evolution: %s geretireerd (netto-edge %+.4f)", name, net)
    return retired


def promote_from_research(db: Database) -> list[dict]:
    """Zet onderzoeks-kandidaten (adaptive-params) die nog geen code hebben, om in echte modules.

    Zo stromen ook de door `research.py` gevonden kandidaten vanzelf de zelf-geschreven laag in.
    """
    written: list[dict] = []
    existing = {g["name"] for g in db.generated_all()}
    for r in researcher.promoted(db):
        if r["strategy"] != "adaptive":
            continue                            # alleen adaptive-varianten kennen we als code-sjabloon
        try:
            params = json.loads(r["params"])
        except Exception:  # noqa: BLE001
            continue
        name = _name_for(params)
        if name in existing:
            continue
        source = render_module(name, params, version=1, excess=r["excess_pct"] or 0.0)
        module = write_module(name, source)
        db.record_generated(name=name, params=json.dumps(params, sort_keys=True), module=module,
                            status="kandidaat", parent="research", excess_pct=r["excess_pct"])
        written.append({"name": name, "module": module})
    return written
