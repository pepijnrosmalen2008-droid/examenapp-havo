#!/usr/bin/env python3
"""Genereert een self-contained HTML-dashboard uit de SQLite-state.

Gebruik:
    python dashboard.py                    # schrijft dashboard.html
    python dashboard.py --out /var/www/html/index.html

Draai hem periodiek (cron of systemd-timer) en serveer het bestand met elke
webserver — het dashboard heeft geen backend en raakt de trading loop niet.
    */15 * * * *  cd /opt/autopilot && .venv/bin/python dashboard.py
"""

from __future__ import annotations

import argparse
import html
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from autopilot.backtesting import max_drawdown, sharpe
from autopilot.config import load_config
from autopilot.database import Database

MAX_POINTS = 500  # SVG-punten; snapshots worden hierop gebucket


def bucket(points: list[tuple[str, float]], n: int = MAX_POINTS) -> list[tuple[str, float]]:
    if len(points) <= n:
        return points
    size = len(points) / n
    return [points[min(int((i + 1) * size) - 1, len(points) - 1)] for i in range(n)]


def svg_path(values: list[float], w: int, h: int, vmin: float, vmax: float) -> str:
    if vmax - vmin < 1e-9:
        vmax = vmin + 1
    pts = []
    for i, v in enumerate(values):
        x = i / max(len(values) - 1, 1) * w
        y = h - (v - vmin) / (vmax - vmin) * h
        pts.append(f"{x:.1f},{y:.1f}")
    return "M" + " L".join(pts)


def collect(db: Database, cfg) -> dict:
    snaps = db.conn.execute("SELECT ts, equity_eur, cash_eur FROM equity_snapshots ORDER BY id").fetchall()
    equity = bucket([(r["ts"], r["equity_eur"]) for r in snaps])
    curve = [e for _, e in equity]
    # drawdown-curve vanaf running peak
    dd, peak = [], -math.inf
    for v in curve:
        peak = max(peak, v)
        dd.append((peak - v) / peak * 100 if peak > 0 else 0.0)

    start = db.get_meta_float("starting_capital", cfg.capital_eur)
    day_start = db.get_meta_float("day_start_equity", start)
    closed = db.conn.execute(
        "SELECT realized_pnl_eur FROM positions WHERE realized_pnl_eur IS NOT NULL").fetchall()
    wins = sum(1 for r in closed if r["realized_pnl_eur"] > 0)
    per_year = int(365 * 24 * 60 / cfg.schedule.interval_minutes)

    return {
        "mode": db.get_meta("mode", cfg.mode.value),
        "halted": db.get_meta("halted") == "1",
        "halt_reason": db.get_meta("halt_reason", ""),
        "paused_until": db.get_meta("paused_until"),
        "start": start,
        "equity": equity, "dd": dd,
        "now_equity": curve[-1] if curve else start,
        "cash": snaps[-1]["cash_eur"] if snaps else start,
        "day_start": day_start,
        "sharpe": sharpe(curve, per_year) if len(curve) > 2 else float("nan"),
        "max_dd": max_drawdown(curve) if curve else 0.0,
        "hit": (wins / len(closed) * 100) if closed else float("nan"),
        "n_closed": len(closed),
        "positions": db.open_positions(),
        "orders": db.recent_orders(20),
        "blocks": db.conn.execute(
            "SELECT * FROM risk_decisions WHERE allowed=0 ORDER BY id DESC LIMIT 15").fetchall(),
        "n_trades": db.conn.execute(
            "SELECT COUNT(*) c FROM orders WHERE status='FILLED'").fetchone()["c"],
    }


def eur(x: float) -> str:
    return f"€{x:,.2f}"


def render(d: dict, cfg) -> str:
    pnl = d["now_equity"] - d["start"]
    pnl_day = d["now_equity"] - d["day_start"]
    sh = f"{d['sharpe']:.2f}" if not math.isnan(d["sharpe"]) else "—"
    hit = f"{d['hit']:.0f}%" if not math.isnan(d["hit"]) else "—"

    if d["halted"]:
        status = ("critical", "⛔", f"GESTOPT — max drawdown ({html.escape(d['halt_reason'] or '')})")
    elif d["paused_until"]:
        status = ("warning", "⏸", f"Dag-kill-switch: pauze tot {html.escape(d['paused_until'])} UTC")
    else:
        status = ("good", "✓", "Actief — alle kill-switches op groen")

    W, H = 920, 220
    curve = [e for _, e in d["equity"]] or [d["start"]]
    ts_labels = [t for t, _ in d["equity"]] or [""]
    eq_min, eq_max = min(curve), max(curve)
    pad = (eq_max - eq_min) * 0.08 + 0.01
    dd_max = max(max(d["dd"] or [0.0]), cfg.risk.max_drawdown_pct)

    def tile(label, value, sub="", delta=None):
        cls = "" if delta is None else (" up" if delta >= 0 else " down")
        return (f'<div class="tile"><div class="tl">{label}</div>'
                f'<div class="tv{cls}">{value}</div><div class="ts">{sub}</div></div>')

    tiles = "".join([
        tile("Equity", eur(d["now_equity"]), f"cash {eur(d['cash'])}"),
        tile("P&amp;L totaal", f"{pnl:+,.2f} €", f"{pnl / d['start'] * 100:+.2f}% op {eur(d['start'])}", pnl),
        tile("P&amp;L vandaag", f"{pnl_day:+,.2f} €", f"{pnl_day / d['day_start'] * 100:+.2f}%", pnl_day),
        tile("Max drawdown", f"{d['max_dd']:.2f}%", f"kill-switch op {cfg.risk.max_drawdown_pct}%"),
        tile("Hit ratio", hit, f"{d['n_closed']} gesloten posities"),
        tile("Sharpe", sh, f"{d['n_trades']} trades"),
    ])

    def rows_positions():
        if not d["positions"]:
            return '<tr><td colspan="4" class="empty">geen open posities</td></tr>'
        return "".join(
            f"<tr><td>{html.escape(p.pair)}</td><td class='num'>{p.amount:.8f}</td>"
            f"<td class='num'>{eur(p.avg_price)}</td><td>{html.escape(p.opened_at)}</td></tr>"
            for p in d["positions"])

    def rows_orders():
        if not d["orders"]:
            return '<tr><td colspan="6" class="empty">nog geen orders</td></tr>'
        out = []
        for o in d["orders"]:
            amt = eur(o["amount_eur"]) if o["amount_eur"] else "—"
            out.append(f"<tr><td>{html.escape(o['created_at'])}</td><td>{o['side']}</td>"
                       f"<td>{html.escape(o['pair'])}</td><td class='num'>{amt}</td>"
                       f"<td>{o['status']}</td><td>{html.escape(o['reason'] or '')}</td></tr>")
        return "".join(out)

    def rows_blocks():
        if not d["blocks"]:
            return '<tr><td colspan="3" class="empty">geen blokkades</td></tr>'
        return "".join(
            f"<tr><td>{html.escape(b['ts'])}</td><td>{html.escape(b['pair'] or '—')}</td>"
            f"<td>{html.escape(b['reason'])}</td></tr>" for b in d["blocks"])

    gen_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    data_js = json.dumps({"ts": ts_labels, "eq": [round(v, 2) for v in curve],
                          "dd": [round(v, 2) for v in d["dd"]]})

    return f"""<!doctype html><html lang="nl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Autopilot dashboard</title>
<style>
:root {{ --surface:#fcfcfb; --page:#f9f9f7; --ink:#0b0b0b; --ink2:#52514e; --muted:#898781;
  --grid:#e1e0d9; --axis:#c3c2b7; --border:rgba(11,11,11,.10); --s1:#2a78d6; --s6:#e34948;
  --good:#0ca30c; --goodtext:#006300; --warn:#fab219; --crit:#d03b3b; }}
@media (prefers-color-scheme: dark) {{
:root {{ --surface:#1a1a19; --page:#0d0d0d; --ink:#fff; --ink2:#c3c2b7; --muted:#898781;
  --grid:#2c2c2a; --axis:#383835; --border:rgba(255,255,255,.10); --s1:#3987e5; --s6:#e66767;
  --goodtext:#0ca30c; }} }}
* {{ box-sizing:border-box; margin:0 }}
body {{ font:15px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif; background:var(--page);
  color:var(--ink); padding:24px; max-width:1000px; margin:0 auto }}
h1 {{ font-size:20px; }} h2 {{ font-size:15px; color:var(--ink2); margin:28px 0 10px }}
.head {{ display:flex; gap:12px; align-items:center; flex-wrap:wrap }}
.badge {{ font-size:12px; font-weight:600; padding:2px 10px; border-radius:99px;
  border:1px solid var(--border); color:var(--ink2) }}
.status {{ display:flex; gap:8px; align-items:center; margin-top:10px; font-weight:600 }}
.status.good {{ color:var(--goodtext) }} .status.warning {{ color:var(--ink) }}
.status.critical {{ color:var(--crit) }}
.meta {{ color:var(--muted); font-size:12px; margin-top:4px }}
.tiles {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px; margin-top:18px }}
.tile {{ background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:12px 14px }}
.tl {{ font-size:12px; color:var(--muted) }} .tv {{ font-size:22px; font-weight:650; margin:2px 0 }}
.tv.up {{ color:var(--goodtext) }} .tv.down {{ color:var(--crit) }}
.ts {{ font-size:12px; color:var(--ink2) }}
.card {{ background:var(--surface); border:1px solid var(--border); border-radius:10px;
  padding:16px; margin-top:10px; overflow-x:auto; position:relative }}
svg {{ display:block; width:100%; height:auto }}
.gl {{ stroke:var(--grid); stroke-width:1 }} .ax {{ fill:var(--muted); font-size:11px }}
table {{ border-collapse:collapse; width:100%; font-size:13px }}
th {{ text-align:left; color:var(--muted); font-weight:500; padding:6px 10px;
  border-bottom:1px solid var(--axis) }}
td {{ padding:6px 10px; border-bottom:1px solid var(--grid) }}
td.num {{ font-variant-numeric:tabular-nums; text-align:right }}
td.empty {{ color:var(--muted); font-style:italic }}
#tip {{ position:fixed; display:none; background:var(--surface); border:1px solid var(--border);
  border-radius:8px; padding:6px 10px; font-size:12px; pointer-events:none; box-shadow:0 2px 10px rgba(0,0,0,.15) }}
</style></head><body>
<div class="head"><h1>Autopilot</h1><span class="badge">{html.escape(d['mode'])}</span>
<span class="badge">{html.escape(cfg.strategy.name)}</span>
<span class="badge">{html.escape(', '.join(cfg.pairs))}</span></div>
<div class="status {status[0]}"><span>{status[1]}</span><span>{status[2]}</span></div>
<div class="meta">gegenereerd {gen_ts} · dit dashboard belooft geen rendement; het toont risico en gedrag</div>

<div class="tiles">{tiles}</div>

<h2>Equity (EUR)</h2>
<div class="card"><svg id="eq" viewBox="0 0 {W} {H + 20}" role="img" aria-label="Equity-curve in euro">
{_gridlines(W, H, eq_min - pad, eq_max + pad, "€")}
<path d="{svg_path(curve, W, H, eq_min - pad, eq_max + pad)}" fill="none" stroke="var(--s1)"
 stroke-width="2" stroke-linejoin="round"/>
<line x1="0" x2="{W}" y1="{H - (d['start'] - eq_min + pad) / (eq_max - eq_min + 2 * pad) * H:.1f}"
 y2="{H - (d['start'] - eq_min + pad) / (eq_max - eq_min + 2 * pad) * H:.1f}"
 stroke="var(--axis)" stroke-dasharray="4 4"/>
<line id="eq-x" y1="0" y2="{H}" stroke="var(--axis)" visibility="hidden"/>
</svg></div>

<h2>Drawdown vanaf piek (%)</h2>
<div class="card"><svg id="dd" viewBox="0 0 {W} {H // 2 + 20}" role="img" aria-label="Drawdown in procenten">
{_gridlines(W, H // 2, 0, dd_max * 1.05, "%", flip=True)}
<path d="{svg_path([-v for v in d['dd']], W, H // 2, -dd_max * 1.05, 0)} L{W},0 L0,0 Z"
 fill="var(--s6)" opacity="0.18"/>
<path d="{svg_path([-v for v in d['dd']], W, H // 2, -dd_max * 1.05, 0)}" fill="none"
 stroke="var(--s6)" stroke-width="2"/>
<line x1="0" x2="{W}" y1="{cfg.risk.max_drawdown_pct / (dd_max * 1.05) * (H // 2):.1f}"
 y2="{cfg.risk.max_drawdown_pct / (dd_max * 1.05) * (H // 2):.1f}" stroke="var(--crit)" stroke-dasharray="4 4"/>
<text class="ax" x="{W - 4}" text-anchor="end"
 y="{cfg.risk.max_drawdown_pct / (dd_max * 1.05) * (H // 2) - 4:.1f}">kill-switch {cfg.risk.max_drawdown_pct}%</text>
<line id="dd-x" y1="0" y2="{H // 2}" stroke="var(--axis)" visibility="hidden"/>
</svg></div>

<h2>Open posities</h2>
<div class="card"><table><tr><th>pair</th><th class="num">hoeveelheid</th><th class="num">gem. instap</th><th>sinds</th></tr>{rows_positions()}</table></div>

<h2>Laatste orders</h2>
<div class="card"><table><tr><th>tijd</th><th>kant</th><th>pair</th><th class="num">bedrag</th><th>status</th><th>reden</th></tr>{rows_orders()}</table></div>

<h2>Laatste risk-blokkades</h2>
<div class="card"><table><tr><th>tijd</th><th>pair</th><th>reden</th></tr>{rows_blocks()}</table></div>

<div id="tip"></div>
<script>
const D = {data_js};
function hover(svgId, lineId, fmt) {{
  const svg = document.getElementById(svgId), xl = document.getElementById(lineId),
        tip = document.getElementById('tip');
  svg.addEventListener('mousemove', e => {{
    const r = svg.getBoundingClientRect();
    const i = Math.min(D.eq.length - 1, Math.max(0,
      Math.round((e.clientX - r.left) / r.width * (D.eq.length - 1))));
    const x = i / Math.max(D.eq.length - 1, 1) * {W};
    xl.setAttribute('x1', x); xl.setAttribute('x2', x); xl.setAttribute('visibility', 'visible');
    tip.style.display = 'block';
    tip.style.left = Math.min(e.clientX + 14, innerWidth - 180) + 'px';
    tip.style.top = (e.clientY + 14) + 'px';
    tip.innerHTML = '<b>' + fmt(i) + '</b><br>' + (D.ts[i] || '').replace('T', ' ').slice(0, 16);
  }});
  svg.addEventListener('mouseleave', () => {{
    xl.setAttribute('visibility', 'hidden'); tip.style.display = 'none'; }});
}}
hover('eq', 'eq-x', i => '€' + D.eq[i].toLocaleString('nl-NL', {{minimumFractionDigits: 2}}));
hover('dd', 'dd-x', i => '−' + D.dd[i].toFixed(2) + '%');
</script>
</body></html>"""


def _gridlines(w: int, h: int, vmin: float, vmax: float, unit: str, flip: bool = False) -> str:
    """4 horizontale hairlines met as-labels in gedempte inkt."""
    out = []
    for k in range(4 if flip else 5):  # flipped chart: onderste label botst met de kill-switch-lijn
        y = h * k / 4
        v = vmax - (vmax - vmin) * k / 4
        if flip:
            v = vmin + (vmax - vmin) * k / 4
        label = f"{v:,.0f}{unit}" if unit == "%" else f"{unit}{v:,.0f}"
        ty = max(y - 3, 10)  # bovenste label niet buiten de viewBox laten vallen
        out.append(f'<line class="gl" x1="0" x2="{w}" y1="{y:.1f}" y2="{y:.1f}"/>'
                   f'<text class="ax" x="4" y="{ty:.1f}">{label}</text>')
    return "".join(out)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--db", default=str(ROOT / "autopilot.db"))
    ap.add_argument("--out", default=str(ROOT / "dashboard.html"))
    args = ap.parse_args()

    cfg = load_config(ROOT / "config.yaml")
    db = Database(args.db)
    page = render(collect(db, cfg), cfg)
    Path(args.out).write_text(page, encoding="utf-8")
    db.close()
    print(f"Dashboard geschreven naar {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
