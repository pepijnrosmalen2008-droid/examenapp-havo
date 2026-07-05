"""SQLite state store — de bron van waarheid voor crash-safe herstarts.

Alles wat de bot moet weten om na een crash correct verder te gaan staat hier:
open posities, order-journal (intent vóór plaatsing → idempotentie), dagverlies-anker,
kill-switch-status en paper-balansen. WAL-mode + expliciete commits.
"""

from __future__ import annotations

import json
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

from .models import OrderStatus, Position, Side

SCHEMA = """
CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS positions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    pair        TEXT NOT NULL,
    amount      REAL NOT NULL,
    avg_price   REAL NOT NULL,
    peak_price  REAL NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'OPEN',   -- OPEN | CLOSED
    opened_at   TEXT NOT NULL,
    closed_at   TEXT,
    realized_pnl_eur REAL
);

CREATE TABLE IF NOT EXISTS orders (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    client_order_id   TEXT NOT NULL UNIQUE,      -- idempotentiesleutel
    exchange_order_id TEXT,
    pair              TEXT NOT NULL,
    side              TEXT NOT NULL,             -- BUY | SELL
    amount_asset      REAL,
    amount_eur        REAL,
    price             REAL,
    fee_eur           REAL DEFAULT 0,
    status            TEXT NOT NULL,             -- zie models.OrderStatus
    reason            TEXT,
    strategy          TEXT,
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS risk_decisions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    ts            TEXT NOT NULL,
    pair          TEXT,
    side          TEXT,
    allowed       INTEGER NOT NULL,
    reason        TEXT NOT NULL,
    requested_eur REAL,
    approved_eur  REAL
);

CREATE TABLE IF NOT EXISTS equity_snapshots (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    ts        TEXT NOT NULL,
    equity_eur REAL NOT NULL,
    cash_eur  REAL NOT NULL,
    bh_equity REAL          -- buy-and-hold-benchmark op hetzelfde moment (kan NULL zijn)
);

CREATE TABLE IF NOT EXISTS paper_balances (
    asset  TEXT PRIMARY KEY,
    amount REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS strategy_state (
    strategy TEXT NOT NULL,
    pair     TEXT NOT NULL,
    state    TEXT NOT NULL,
    PRIMARY KEY (strategy, pair)
);

CREATE TABLE IF NOT EXISTS candle_cache (
    pair     TEXT NOT NULL,
    interval TEXT NOT NULL,
    ts       INTEGER NOT NULL,
    open REAL NOT NULL, high REAL NOT NULL, low REAL NOT NULL,
    close REAL NOT NULL, volume REAL NOT NULL,
    PRIMARY KEY (pair, interval, ts)
);

CREATE TABLE IF NOT EXISTS decision_log (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    ts      TEXT NOT NULL,
    stance  TEXT NOT NULL,          -- kopen | verkopen | herbalanceren | cash | wachten | gestopt | ...
    headline TEXT NOT NULL,         -- één regel: de netto-beslissing van deze cycle
    record  TEXT NOT NULL           -- volledige JSON: factoren, acties, blokkades, overwegingen
);

-- Leerlus: per factor bijhouden hoe vaak zijn richting achteraf klopte (forward-only).
CREATE TABLE IF NOT EXISTS factor_stats (
    factor_key TEXT PRIMARY KEY,
    n       INTEGER NOT NULL DEFAULT 0,   -- aantal beoordeelde observaties
    hits    INTEGER NOT NULL DEFAULT 0,   -- keren dat de richting klopte
    sum_edge REAL NOT NULL DEFAULT 0      -- som van (forward-return × teken score)
);

-- Openstaande observaties, later beoordeeld tegen de werkelijke koersbeweging.
CREATE TABLE IF NOT EXISTS factor_obs (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    ts      TEXT NOT NULL,
    due_ts  TEXT NOT NULL,          -- moment waarop deze observatie beoordeeld wordt
    factor_key TEXT NOT NULL,
    pair    TEXT NOT NULL,
    score   REAL NOT NULL,
    price   REAL NOT NULL           -- prijs op het observatiemoment
);
CREATE INDEX IF NOT EXISTS idx_factor_obs_due ON factor_obs(due_ts);
"""

# Bayesiaanse krimp naar 0,5: een factor moet zijn betrouwbaarheid verdienen met data.
FACTOR_PRIOR = 8.0


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class Database:
    def __init__(self, path: str | Path):
        self.path = Path(path)
        self.conn = sqlite3.connect(str(self.path))
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA journal_mode=WAL")
        self.conn.execute("PRAGMA foreign_keys=ON")
        self.conn.executescript(SCHEMA)
        self._migrate()
        self.conn.commit()

    def _migrate(self) -> None:
        """Kleine, veilige migraties voor databases van een oudere versie."""
        cols = {r["name"] for r in self.conn.execute("PRAGMA table_info(equity_snapshots)")}
        if "bh_equity" not in cols:
            self.conn.execute("ALTER TABLE equity_snapshots ADD COLUMN bh_equity REAL")

    def close(self) -> None:
        self.conn.close()

    # ── meta (key/value) ──────────────────────────────────────────────

    def get_meta(self, key: str, default: str | None = None) -> str | None:
        row = self.conn.execute("SELECT value FROM meta WHERE key=?", (key,)).fetchone()
        return row["value"] if row else default

    def set_meta(self, key: str, value: str) -> None:
        self.conn.execute(
            "INSERT INTO meta(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
            (key, str(value)),
        )
        self.conn.commit()

    def del_meta(self, key: str) -> None:
        self.conn.execute("DELETE FROM meta WHERE key=?", (key,))
        self.conn.commit()

    def get_meta_float(self, key: str, default: float = 0.0) -> float:
        v = self.get_meta(key)
        return float(v) if v is not None else default

    # ── posities ──────────────────────────────────────────────────────

    def open_positions(self, pair: str | None = None) -> list[Position]:
        q = "SELECT * FROM positions WHERE status='OPEN'"
        args: tuple = ()
        if pair:
            q += " AND pair=?"
            args = (pair,)
        rows = self.conn.execute(q, args).fetchall()
        return [
            Position(
                id=r["id"], pair=r["pair"], amount=r["amount"], avg_price=r["avg_price"],
                peak_price=r["peak_price"], status=r["status"], opened_at=r["opened_at"],
            )
            for r in rows
        ]

    def upsert_position(self, pair: str, amount: float, price: float) -> Position:
        """BUY-fill verwerken: bestaande open positie middelen, anders nieuwe openen."""
        existing = self.open_positions(pair)
        if existing:
            p = existing[0]
            total_cost = p.amount * p.avg_price + amount * price
            p.amount += amount
            p.avg_price = total_cost / p.amount if p.amount > 0 else 0.0
            p.peak_price = max(p.peak_price, price)
            self.conn.execute(
                "UPDATE positions SET amount=?, avg_price=?, peak_price=? WHERE id=?",
                (p.amount, p.avg_price, p.peak_price, p.id),
            )
            self.conn.commit()
            return p
        now = utcnow()
        cur = self.conn.execute(
            "INSERT INTO positions(pair, amount, avg_price, peak_price, status, opened_at) VALUES(?,?,?,?, 'OPEN', ?)",
            (pair, amount, price, price, now),
        )
        self.conn.commit()
        return Position(id=cur.lastrowid, pair=pair, amount=amount, avg_price=price,
                        peak_price=price, opened_at=now)

    def reduce_position(self, pair: str, amount_sold: float, price: float) -> float:
        """SELL-fill verwerken. Geeft gerealiseerde P&L in EUR terug."""
        existing = self.open_positions(pair)
        if not existing:
            return 0.0
        p = existing[0]
        sold = min(amount_sold, p.amount)
        realized = sold * (price - p.avg_price)
        remaining = p.amount - sold
        if remaining * price < 0.01:  # stofrestje → positie sluiten
            self.conn.execute(
                "UPDATE positions SET amount=0, status='CLOSED', closed_at=?, realized_pnl_eur=COALESCE(realized_pnl_eur,0)+? WHERE id=?",
                (utcnow(), realized, p.id),
            )
        else:
            self.conn.execute(
                "UPDATE positions SET amount=?, realized_pnl_eur=COALESCE(realized_pnl_eur,0)+? WHERE id=?",
                (remaining, realized, p.id),
            )
        self.conn.commit()
        return realized

    def update_peak_price(self, position_id: int, peak: float) -> None:
        self.conn.execute("UPDATE positions SET peak_price=? WHERE id=?", (peak, position_id))
        self.conn.commit()

    # ── order-journal (idempotentie) ──────────────────────────────────

    def journal_order_intent(self, pair: str, side: Side, *, amount_eur: float | None,
                             amount_asset: float | None, reason: str, strategy: str) -> str:
        """Stap 1 van elke order: intent vastleggen VOOR plaatsing. Geeft client_order_id terug."""
        coid = uuid.uuid4().hex
        now = utcnow()
        self.conn.execute(
            "INSERT INTO orders(client_order_id, pair, side, amount_eur, amount_asset, status, reason, strategy, created_at, updated_at) "
            "VALUES(?,?,?,?,?,?,?,?,?,?)",
            (coid, pair, side.value, amount_eur, amount_asset, OrderStatus.PENDING.value, reason, strategy, now, now),
        )
        self.conn.commit()
        return coid

    def mark_order(self, client_order_id: str, status: OrderStatus, *,
                   exchange_order_id: str | None = None, price: float | None = None,
                   amount_asset: float | None = None, amount_eur: float | None = None,
                   fee_eur: float | None = None) -> None:
        sets, args = ["status=?", "updated_at=?"], [status.value, utcnow()]
        for col, val in (("exchange_order_id", exchange_order_id), ("price", price),
                         ("amount_asset", amount_asset), ("amount_eur", amount_eur), ("fee_eur", fee_eur)):
            if val is not None:
                sets.append(f"{col}=?")
                args.append(val)
        args.append(client_order_id)
        self.conn.execute(f"UPDATE orders SET {', '.join(sets)} WHERE client_order_id=?", args)
        self.conn.commit()

    def pending_orders(self) -> list[sqlite3.Row]:
        return self.conn.execute(
            "SELECT * FROM orders WHERE status IN (?, ?) ORDER BY id",
            (OrderStatus.PENDING.value, OrderStatus.PLACED.value),
        ).fetchall()

    def orders_since(self, iso_ts: str) -> list[sqlite3.Row]:
        return self.conn.execute(
            "SELECT * FROM orders WHERE created_at >= ? ORDER BY id", (iso_ts,)
        ).fetchall()

    def recent_orders(self, limit: int = 20) -> list[sqlite3.Row]:
        return self.conn.execute("SELECT * FROM orders ORDER BY id DESC LIMIT ?", (limit,)).fetchall()

    # ── risk-beslissingen ─────────────────────────────────────────────

    def log_risk_decision(self, *, pair: str | None, side: str | None, allowed: bool,
                          reason: str, requested_eur: float | None, approved_eur: float | None) -> None:
        self.conn.execute(
            "INSERT INTO risk_decisions(ts, pair, side, allowed, reason, requested_eur, approved_eur) VALUES(?,?,?,?,?,?,?)",
            (utcnow(), pair, side, int(allowed), reason, requested_eur, approved_eur),
        )
        self.conn.commit()

    # ── beslissingen (gedachtegang) ──────────────────────────────────

    def log_decision(self, *, stance: str, headline: str, record: dict) -> None:
        self.conn.execute(
            "INSERT INTO decision_log(ts, stance, headline, record) VALUES(?,?,?,?)",
            (utcnow(), stance, headline, json.dumps(record)),
        )
        # Houd het logje compact: alleen de laatste ~200 cycles bewaren.
        self.conn.execute(
            "DELETE FROM decision_log WHERE id < "
            "(SELECT MIN(id) FROM (SELECT id FROM decision_log ORDER BY id DESC LIMIT 200))"
        )
        self.conn.commit()

    def recent_decisions(self, limit: int = 20) -> list[dict]:
        rows = self.conn.execute(
            "SELECT ts, stance, headline, record FROM decision_log ORDER BY id DESC LIMIT ?",
            (limit,),
        ).fetchall()
        out = []
        for r in rows:
            rec = json.loads(r["record"])
            rec["ts"], rec["stance"], rec["headline"] = r["ts"], r["stance"], r["headline"]
            out.append(rec)
        return out

    # ── factor-leerlus (forward-only betrouwbaarheid) ────────────────

    def record_factor_obs(self, *, ts: str, due_ts: str, factor_key: str,
                          pair: str, score: float, price: float) -> None:
        self.conn.execute(
            "INSERT INTO factor_obs(ts, due_ts, factor_key, pair, score, price) VALUES(?,?,?,?,?,?)",
            (ts, due_ts, factor_key, pair, score, price),
        )
        self.conn.commit()

    def due_factor_obs(self, now_iso: str) -> list[sqlite3.Row]:
        return self.conn.execute(
            "SELECT * FROM factor_obs WHERE due_ts <= ? ORDER BY id LIMIT 2000", (now_iso,)
        ).fetchall()

    def resolve_factor_obs(self, obs_id: int, factor_key: str,
                           hit: bool | None, edge: float) -> None:
        """Verwerk één beoordeelde observatie in de aggregaten en verwijder ze."""
        if hit is not None:
            self.conn.execute(
                "INSERT INTO factor_stats(factor_key, n, hits, sum_edge) VALUES(?,?,?,?) "
                "ON CONFLICT(factor_key) DO UPDATE SET n=n+1, hits=hits+?, sum_edge=sum_edge+?",
                (factor_key, 1, int(hit), edge, int(hit), edge),
            )
        self.conn.execute("DELETE FROM factor_obs WHERE id=?", (obs_id,))
        self.conn.commit()

    def factor_reliabilities(self) -> dict[str, dict]:
        """Per factor: n, precisie (met krimp naar 0,5) en gemiddelde edge."""
        out: dict[str, dict] = {}
        for r in self.conn.execute("SELECT * FROM factor_stats"):
            n, hits = r["n"], r["hits"]
            precision = (hits + FACTOR_PRIOR) / (n + 2 * FACTOR_PRIOR) if n >= 0 else 0.5
            out[r["factor_key"]] = {
                "n": n, "precision": round(precision, 3),
                "avg_edge": round(r["sum_edge"] / n, 4) if n > 0 else 0.0,
            }
        return out

    # ── equity ────────────────────────────────────────────────────────

    def snapshot_equity(self, equity_eur: float, cash_eur: float,
                        bh_equity: float | None = None) -> None:
        self.conn.execute(
            "INSERT INTO equity_snapshots(ts, equity_eur, cash_eur, bh_equity) VALUES(?,?,?,?)",
            (utcnow(), equity_eur, cash_eur, bh_equity),
        )
        self.conn.commit()

    def last_equity(self) -> sqlite3.Row | None:
        return self.conn.execute("SELECT * FROM equity_snapshots ORDER BY id DESC LIMIT 1").fetchone()

    # ── paper-balansen ────────────────────────────────────────────────

    def paper_balance(self, asset: str) -> float:
        row = self.conn.execute("SELECT amount FROM paper_balances WHERE asset=?", (asset,)).fetchone()
        return row["amount"] if row else 0.0

    def set_paper_balance(self, asset: str, amount: float) -> None:
        self.conn.execute(
            "INSERT INTO paper_balances(asset, amount) VALUES(?,?) ON CONFLICT(asset) DO UPDATE SET amount=excluded.amount",
            (asset, amount),
        )
        self.conn.commit()

    def paper_balances(self) -> dict[str, float]:
        return {r["asset"]: r["amount"] for r in self.conn.execute("SELECT * FROM paper_balances")}

    # ── strategie-state ───────────────────────────────────────────────

    def get_strategy_state(self, strategy: str, pair: str) -> dict:
        row = self.conn.execute(
            "SELECT state FROM strategy_state WHERE strategy=? AND pair=?", (strategy, pair)
        ).fetchone()
        return json.loads(row["state"]) if row else {}

    def set_strategy_state(self, strategy: str, pair: str, state: dict) -> None:
        self.conn.execute(
            "INSERT INTO strategy_state(strategy, pair, state) VALUES(?,?,?) "
            "ON CONFLICT(strategy, pair) DO UPDATE SET state=excluded.state",
            (strategy, pair, json.dumps(state)),
        )
        self.conn.commit()

    # ── candle-cache (backtester) ─────────────────────────────────────

    def cache_candles(self, pair: str, interval: str, candles: list[tuple]) -> None:
        self.conn.executemany(
            "INSERT OR REPLACE INTO candle_cache(pair, interval, ts, open, high, low, close, volume) VALUES(?,?,?,?,?,?,?,?)",
            [(pair, interval, c[0], c[1], c[2], c[3], c[4], c[5]) for c in candles],
        )
        self.conn.commit()

    def cached_candles(self, pair: str, interval: str, start_ms: int, end_ms: int) -> list[tuple]:
        rows = self.conn.execute(
            "SELECT ts, open, high, low, close, volume FROM candle_cache "
            "WHERE pair=? AND interval=? AND ts>=? AND ts<? ORDER BY ts",
            (pair, interval, start_ms, end_ms),
        ).fetchall()
        return [tuple(r) for r in rows]
