"""Webportaal-sync — koppelt de bot aan de beveiligde pagina op slagio.nl/bot.html.

Werking:
  - De bot logt in bij Supabase met een eigen account (email+wachtwoord uit .env)
    en upsert elke cycle een compacte status-snapshot naar de tabel `bot_state`.
  - Row Level Security zorgt dat alleen dit account zijn eigen rij kan lezen/schrijven;
    de webpagina leest met dezelfde login.
  - Eén afstandsbediening: het portaal kan een `emergency_stop`-commando plaatsen
    (alles naar EUR + permanente halt). Bewust NIET op afstand: herstarten,
    halt opheffen of instellingen wijzigen — de veilige richting kan op afstand,
    de gevaarlijke richting alleen op de machine zelf.

Alles hier is best-effort: een portaalfout mag de trading loop nooit breken.
De Bitvavo-keys komen nooit in de buurt van dit pad.
"""

from __future__ import annotations

import logging
import os
import time

import requests

from .database import Database, utcnow

log = logging.getLogger("autopilot.portal")

EQUITY_POINTS = 200  # punten in de curve die naar het portaal gaat


class Portal:
    def __init__(self, url: str, anon_key: str, email: str, password: str,
                 session=None):
        self.url = url.rstrip("/")
        self.key = anon_key
        self.email = email
        self.password = password
        self.http = session or requests.Session()
        self._token: str | None = None
        self._token_exp = 0.0
        self.user_id: str | None = None

    # ── auth ──────────────────────────────────────────────────────────

    def _login(self) -> None:
        r = self.http.post(
            f"{self.url}/auth/v1/token?grant_type=password",
            json={"email": self.email, "password": self.password},
            headers={"apikey": self.key, "Content-Type": "application/json"}, timeout=10)
        r.raise_for_status()
        d = r.json()
        self._token = d["access_token"]
        self._token_exp = time.time() + float(d.get("expires_in", 3600)) - 120
        self.user_id = d["user"]["id"]

    def _ensure_login(self) -> None:
        if self._token is None or time.time() >= self._token_exp:
            self._login()

    def _headers(self, **extra: str) -> dict:
        return {"apikey": self.key, "Authorization": f"Bearer {self._token}",
                "Content-Type": "application/json", **extra}

    # ── state sync ────────────────────────────────────────────────────

    def sync_state(self, payload: dict, bot_id: str = "default") -> None:
        self._ensure_login()
        r = self.http.post(
            f"{self.url}/rest/v1/bot_state?on_conflict=user_id,bot_id",
            json={"user_id": self.user_id, "bot_id": bot_id, "state": payload, "updated_at": utcnow()},
            headers=self._headers(Prefer="resolution=merge-duplicates"), timeout=10)
        r.raise_for_status()

    # ── commando's ────────────────────────────────────────────────────

    def pending_commands(self, bot_id: str = "default") -> list[dict]:
        self._ensure_login()
        # commando's voor deze bot, of een broadcast (bot_id leeg)
        r = self.http.get(
            f"{self.url}/rest/v1/bot_commands?handled=eq.false"
            f"&or=(bot_id.eq.{bot_id},bot_id.is.null)&select=id,command&order=id",
            headers=self._headers(), timeout=10)
        r.raise_for_status()
        return r.json()

    def mark_handled(self, cmd_id: int) -> None:
        self._ensure_login()
        r = self.http.patch(
            f"{self.url}/rest/v1/bot_commands?id=eq.{cmd_id}",
            json={"handled": True}, headers=self._headers(), timeout=10)
        r.raise_for_status()


def _bucket(points: list, n: int) -> list:
    if len(points) <= n:
        return points
    size = len(points) / n
    return [points[min(int((i + 1) * size) - 1, len(points) - 1)] for i in range(n)]


def _metrics(db: Database, all_pts: list) -> dict:
    """Risico-/prestatiematen over de equity-curve + trade-historie.

    Sharpe/Sortino/volatiliteit worden op DAGrendementen berekend (geannualiseerd met
    √365) — dat geeft standaard, interpreteerbare getallen i.p.v. ruis uit
    minuutdata. Ze zijn indicatief bij korte historie en zijn None tot er ≥3 dagen zijn.
    """
    import math

    eq_full = [e for _, e, _ in all_pts]

    def daily(pts):  # laatste equity per kalenderdag
        out, day = [], None
        for ts, e, _b in pts:
            d = ts[:10]
            if d != day:
                out.append(e); day = d
            else:
                out[-1] = e
        return out

    def rets(v):
        return [v[i] / v[i - 1] - 1 for i in range(1, len(v)) if v[i - 1] > 0]

    def std(xs):
        if len(xs) < 2:
            return 0.0
        m = sum(xs) / len(xs)
        return math.sqrt(sum((x - m) ** 2 for x in xs) / (len(xs) - 1))

    def max_dd(v):
        peak, dd = -math.inf, 0.0
        for x in v:
            peak = max(peak, x)
            if peak > 0:
                dd = max(dd, (peak - x) / peak)
        return dd * 100

    daily_eq = daily(all_pts)
    r = rets(daily_eq) if len(daily_eq) >= 3 else []  # pas ratio's vanaf ~3 dagen
    mean = sum(r) / len(r) if r else 0.0
    sd = std(r)
    downside = std([x for x in r if x < 0])
    sqrt_py = math.sqrt(365)

    closed = db.conn.execute(
        "SELECT realized_pnl_eur FROM positions WHERE status='CLOSED' AND realized_pnl_eur IS NOT NULL"
    ).fetchall()
    pnls = [row["realized_pnl_eur"] for row in closed]
    wins = [p for p in pnls if p > 0]
    losses = [p for p in pnls if p <= 0]
    n_trades = db.conn.execute(
        "SELECT COUNT(*) c FROM orders WHERE status='FILLED'").fetchone()["c"]

    bh_full = [b for _, _, b in all_pts if b is not None]
    vs_bench = None
    if eq_full and bh_full and eq_full[0] > 0 and bh_full[0] > 0:
        vs_bench = (eq_full[-1] / eq_full[0] - 1) * 100 - (bh_full[-1] / bh_full[0] - 1) * 100

    return {  # None i.p.v. NaN (NaN is geen geldige JSON)
        "sharpe": round(mean / sd * sqrt_py, 2) if sd > 0 else None,
        "sortino": round(mean / downside * sqrt_py, 2) if downside > 0 else None,
        "volatility_pct": round(sd * sqrt_py * 100, 1),
        "max_dd_pct": round(max_dd(eq_full), 2),
        "n_trades": n_trades,
        "n_closed": len(pnls),
        "win_rate": round(len(wins) / len(pnls) * 100, 0) if pnls else None,
        "avg_win": round(sum(wins) / len(wins), 2) if wins else 0.0,
        "avg_loss": round(sum(losses) / len(losses), 2) if losses else 0.0,
        "vs_benchmark_pct": round(vs_bench, 2) if vs_bench is not None else None,
    }


def build_payload(db: Database, cfg, mode: str) -> dict:
    """Compacte, JSON-serialiseerbare status-snapshot voor het portaal.

    Twee equity-reeksen zodat de site zowel korte (1u) als lange (alles) tijdvakken
    scherp kan tonen: `eq_recent` = ruwe snapshots van de laatste ~dagen; `eq_all` =
    de volledige historie, gebucket tot een handelbaar aantal punten.
    """
    import json as _json

    snaps = db.conn.execute(
        "SELECT ts, equity_eur, bh_equity FROM equity_snapshots ORDER BY id").fetchall()
    all_pts = [(r["ts"], r["equity_eur"], r["bh_equity"]) for r in snaps]
    recent, allb = all_pts[-1200:], _bucket(all_pts, 500)
    eq_recent = [[t, round(e, 2)] for t, e, _ in recent]                 # ruw, fijn (korte vakken)
    eq_all = [[t, round(e, 2)] for t, e, _ in allb]                      # gebucket (lange vakken)
    bh_recent = [[t, round(b, 2)] for t, e, b in recent if b is not None]
    bh_all = [[t, round(b, 2)] for t, e, b in allb if b is not None]
    start = db.get_meta_float("starting_capital", cfg.capital_eur)
    last = db.last_equity()
    last_prices = _json.loads(db.get_meta("last_prices") or "{}")
    equity_now = last["equity_eur"] if last else start
    bh_now = last["bh_equity"] if last and last["bh_equity"] is not None else start
    metrics = _metrics(db, all_pts)

    def _position(p):
        price = last_prices.get(p.pair, p.avg_price)
        value = p.amount * price
        pnl_eur = value - p.amount * p.avg_price
        pnl_pct = ((price - p.avg_price) / p.avg_price * 100) if p.avg_price > 0 else 0.0
        alloc = (value / equity_now * 100) if equity_now > 0 else 0.0
        return {"pair": p.pair, "amount": p.amount, "avg_price": p.avg_price,
                "price": price, "value_eur": value, "pnl_eur": pnl_eur,
                "pnl_pct": pnl_pct, "alloc_pct": alloc, "opened_at": p.opened_at}
    return {
        "mode": mode,
        "bot_id": cfg.bot_id,
        "strategy": cfg.strategy.name,
        "interval_minutes": cfg.schedule.interval_minutes,
        "halted": db.get_meta("halted") == "1",
        "halt_reason": db.get_meta("halt_reason", ""),
        "paused_until": db.get_meta("paused_until"),
        "start": start,
        "day_start": db.get_meta_float("day_start_equity", start),
        "equity_now": equity_now,
        "cash": last["cash_eur"] if last else start,
        "invested": sum(p.amount * last_prices.get(p.pair, p.avg_price) for p in db.open_positions()),
        "max_drawdown_pct": cfg.risk.max_drawdown_pct,
        "eq_recent": eq_recent,
        "eq_all": eq_all,
        "bh_recent": bh_recent,
        "bh_all": bh_all,
        "bh_now": bh_now,
        "metrics": metrics,
        "positions": [_position(p) for p in db.open_positions()],
        "n_markets": len(cfg.pairs),
        "orders": [{"t": o["created_at"], "side": o["side"], "pair": o["pair"],
                    "eur": o["amount_eur"], "price": o["price"], "amount": o["amount_asset"],
                    "status": o["status"], "reason": o["reason"]}
                   for o in db.recent_orders(60)],
        "blocks": [{"t": b["ts"], "pair": b["pair"], "reason": b["reason"]}
                   for b in db.conn.execute(
                       "SELECT ts, pair, reason FROM risk_decisions WHERE allowed=0 "
                       "ORDER BY id DESC LIMIT 12")],
        "thinking": _thinking(db),
        "updated": utcnow(),
    }


FACTOR_LABELS = {
    "momentum": "Momentum", "trend": "Trend", "volatility": "Rust/risico",
    "drawdown": "Afstand tot top", "relative_strength": "Relatieve sterkte",
    "news": "Nieuws", "macro": "Wereld/macro", "smart_money": "Smart money",
}


def _thinking(db: Database) -> dict:
    """Gedachtegang voor de site: laatste beslissing (met factoren + confidence),
    korte historie, en de geleerde betrouwbaarheid per factor (forward-only)."""
    recs = db.recent_decisions(20)
    rel = db.factor_reliabilities()
    reliability = sorted(
        ({"key": k, "label": FACTOR_LABELS.get(k, k), "precision": v["precision"],
          "n": v["n"], "avg_edge": v["avg_edge"]} for k, v in rel.items()),
        key=lambda r: (-r["n"], -r["precision"]))
    if not recs:
        return {"latest": None, "history": [], "reliability": reliability}
    history = [{"ts": r["ts"], "stance": r["stance"], "headline": r["headline"]}
               for r in recs]
    return {"latest": recs[0], "history": history, "reliability": reliability}


def build_portal() -> Portal | None:
    """Portal uit .env; None als niet (volledig) geconfigureerd."""
    url = os.environ.get("SUPABASE_URL", "").strip()
    key = os.environ.get("SUPABASE_ANON_KEY", "").strip()
    email = os.environ.get("BOT_PORTAL_EMAIL", "").strip()
    password = os.environ.get("BOT_PORTAL_PASSWORD", "").strip()
    if not (url and key and email and password):
        log.info("webportaal niet geconfigureerd (SUPABASE_URL/ANON_KEY/BOT_PORTAL_* in .env)")
        return None
    log.info("webportaal-sync actief → %s", url)
    return Portal(url, key, email, password)


def portal_tick(portal: Portal | None, engine, db: Database, cfg, mode: str) -> None:
    """Eén sync-ronde na elke cycle. Mag nooit een exception doorlaten."""
    if portal is None:
        return
    bot_id = cfg.bot_id
    try:
        portal.sync_state(build_payload(db, cfg, mode), bot_id)
    except Exception:  # noqa: BLE001
        log.exception("portal: state-sync mislukt (volgende cycle opnieuw)")
    try:
        for cmd in portal.pending_commands(bot_id):
            if cmd["command"] == "emergency_stop":
                log.critical("NOODSTOP ontvangen via webportaal")
                engine.emergency_stop("noodstop via slagio-webportaal")
                portal.mark_handled(cmd["id"])
                # direct de nieuwe (gestopte) status tonen
                portal.sync_state(build_payload(db, cfg, mode), bot_id)
            else:
                log.warning("portal: onbekend commando %r genegeerd", cmd["command"])
                portal.mark_handled(cmd["id"])
    except Exception:  # noqa: BLE001
        log.exception("portal: commando-check mislukt (volgende cycle opnieuw)")
