"""Zelfdiagnose — de bot bewaakt zijn eigen gezondheid en meldt problemen zelf.

Beantwoordt vragen als: draait hij nog? Krijgt de leerlus nog voeding? Kantelt een
factor? Zakt de beslis-zekerheid structureel weg? Loopt de database vol? Puur afgeleid
van bestaande state — geen nieuwe databron, geen extra proces. Reliability + self-checks,
niet nóg een indicator.

Elke check geeft (naam, status, detail); status ∈ ok | info | warn | crit. De algehele
gezondheid is de ernstigste check.
"""

from __future__ import annotations

from datetime import datetime, timezone

_RANK = {"ok": 0, "info": 0, "warn": 1, "crit": 2}


def _age_min(ts: str | None, now: datetime) -> float | None:
    if not ts:
        return None
    try:
        d = datetime.fromisoformat(ts if ("+" in ts or "Z" in ts) else ts + "+00:00")
    except (ValueError, TypeError):
        return None
    return (now - d).total_seconds() / 60.0


def diagnostics(db, cfg, mode: str, now: datetime | None = None) -> dict:
    now = now or datetime.now(timezone.utc)
    checks: list[dict] = []

    def add(name, status, detail):
        checks.append({"name": name, "status": status, "detail": detail})

    # 1. hartslag — draait hij nog?
    last = db.last_equity()
    age = _age_min(last["ts"], now) if last else None
    if age is None:
        add("Hartslag", "warn", "nog geen snapshots")
    else:
        st = "ok" if age < 4 else "warn" if age < 30 else "crit"
        add("Hartslag", st, f"laatste update {round(age)} min geleden")

    # 2. kill-switches
    if db.get_meta("halted") == "1":
        add("Kill-switch", "crit", "permanent gestopt: " + (db.get_meta("halt_reason") or "?"))
    elif db.get_meta("paused_until"):
        add("Kill-switch", "warn", "dag-pauze actief")
    else:
        add("Kill-switch", "ok", "alles op groen")

    # 3. API / circuit breaker
    cbf = int(db.get_meta_float("cb_failures", 0))
    cbp = db.get_meta("cb_pause_until")
    if cbp:
        add("API / circuit breaker", "warn", f"cooldown tot {cbp} UTC (API-storingen)")
    elif cbf > 0:
        add("API / circuit breaker", "warn", f"{cbf} storing(en) op rij")
    else:
        add("API / circuit breaker", "ok", "data komt door")

    # 4. leerlus-voeding — krijgt de forward-only meting nog observaties?
    fol_age = _age_min(db.get_meta("factor_obs_last"), now)
    if fol_age is None:
        add("Leerlus-voeding", "info", "nog geen observaties vastgelegd (bouwt forward op)")
    elif fol_age / 60 > 26:
        add("Leerlus-voeding", "warn", f"geen nieuwe observatie in {round(fol_age/60)}u")
    else:
        add("Leerlus-voeding", "ok", f"laatste observatie {round(fol_age/60,1)}u geleden")

    # 5. concept-drift — kantelt er een factor?
    drift = {k: v for k, v in db.drift_status().items() if v != "stabiel"}
    if drift:
        add("Concept-drift", "warn", f"{len(drift)} factor(en) kantelen: " + ", ".join(sorted(drift)))
    else:
        add("Concept-drift", "ok", "geen kantelende factoren")

    # 5b. nieuwsfeed — zoekt de nieuwsbot nog actief nieuws?
    if getattr(cfg, "research", None) and cfg.research.enabled and cfg.research.agent == "newsfeed":
        try:
            from . import newsfeed
            data = newsfeed._load(cfg)
            fresh = newsfeed.load_auto_events(cfg, now)
            f_age = _age_min(data.get("fetched_at"), now)
            if f_age is None:
                add("Nieuwsfeed", "info", "nog niet opgehaald (start bij de eerste cyclus)")
            elif f_age > 45:
                add("Nieuwsfeed", "warn", f"geen ophaal in {round(f_age)} min — bronnen bereikbaar?")
            else:
                add("Nieuwsfeed", "ok", f"{len(fresh)} actieve kop(pen) · opgehaald {round(f_age)} min geleden")
        except Exception:  # noqa: BLE001
            pass

    # 6. beslis-zekerheid — zakt de confidence structureel weg?
    recs = db.recent_decisions(30)
    confs = [r.get("confidence") for r in recs if isinstance(r.get("confidence"), (int, float))]
    if len(confs) >= 10:
        confs = confs[::-1]  # oud → nieuw
        half = len(confs) // 2
        first = sum(confs[:half]) / half
        second = sum(confs[half:]) / (len(confs) - half)
        if second < first - 0.12:
            add("Beslis-zekerheid", "warn",
                f"daalt structureel ({round(first*100)}% → {round(second*100)}%)")
        else:
            add("Beslis-zekerheid", "ok", f"stabiel rond {round(second*100)}%")

    # 7. database-groei — loopt iets onbegrensd vol?
    try:
        obs = db.conn.execute("SELECT COUNT(*) c FROM factor_obs").fetchone()["c"]
        snaps = db.conn.execute("SELECT COUNT(*) c FROM equity_snapshots").fetchone()["c"]
        st = "warn" if obs > 80_000 else "ok"
        add("Database", st, f"{obs} open observaties · {snaps} snapshots")
    except Exception:  # noqa: BLE001
        pass

    overall = "ok"
    for c in checks:
        if _RANK[c["status"]] > _RANK[overall]:
            overall = c["status"]
    return {"overall": overall, "checks": checks, "at": now.isoformat(timespec="seconds")}
