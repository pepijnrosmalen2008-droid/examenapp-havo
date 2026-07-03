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


def _bucket(points: list[tuple[str, float]], n: int) -> list[tuple[str, float]]:
    if len(points) <= n:
        return points
    size = len(points) / n
    return [points[min(int((i + 1) * size) - 1, len(points) - 1)] for i in range(n)]


def build_payload(db: Database, cfg, mode: str) -> dict:
    """Compacte, JSON-serialiseerbare status-snapshot voor het portaal.

    Twee equity-reeksen zodat de site zowel korte (1u) als lange (alles) tijdvakken
    scherp kan tonen: `eq_recent` = ruwe snapshots van de laatste ~dagen; `eq_all` =
    de volledige historie, gebucket tot een handelbaar aantal punten.
    """
    import json as _json

    snaps = db.conn.execute(
        "SELECT ts, equity_eur FROM equity_snapshots ORDER BY id").fetchall()
    all_pts = [(r["ts"], r["equity_eur"]) for r in snaps]
    eq_recent = [[t, round(v, 2)] for t, v in all_pts[-1200:]]          # ruw, fijn (korte vakken)
    eq_all = [[t, round(v, 2)] for t, v in _bucket(all_pts, 500)]        # gebucket (lange vakken)
    start = db.get_meta_float("starting_capital", cfg.capital_eur)
    last = db.last_equity()
    last_prices = _json.loads(db.get_meta("last_prices") or "{}")
    equity_now = last["equity_eur"] if last else start

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
        "updated": utcnow(),
    }


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
