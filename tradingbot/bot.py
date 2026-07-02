#!/usr/bin/env python3
"""Autopilot — hoofdproces. Start altijd in PAPER tenzij aan ALLE live-voorwaarden is voldaan.

Gebruik:
    python bot.py                 # draait de trading loop (PAPER default)
    python bot.py --once          # één cycle en stoppen (handig voor tests/cron)
"""

from __future__ import annotations

import argparse
import logging
import signal
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent

from autopilot.config import LiveModeRefused, TradingMode, load_config, resolve_mode
from autopilot.database import Database
from autopilot.engine import TradingEngine
from autopilot.exchange import BitvavoClient, MarketData, PaperExchange, ShadowExchange
from autopilot.logsetup import setup_logging
from autopilot.notify import TelegramNotifier, build_notifier
from autopilot.risk import RiskEngine
from autopilot.strategies import get_strategy

log = logging.getLogger("autopilot.bot")

_running = True


def _stop(signum, frame):  # noqa: ARG001
    global _running
    log.info("signaal %s ontvangen; netjes afsluiten na deze cycle", signum)
    _running = False


def build_engine(cfg, db: Database, mode: TradingMode) -> TradingEngine:
    notifier = build_notifier()
    if mode == TradingMode.LIVE:
        exchange = BitvavoClient(allow_trading=True)
    elif mode == TradingMode.SHADOW:
        # SHADOW: het volledige live-pad (echte key optioneel, echt saldo als limiet),
        # maar orders worden alleen gelogd + gesimuleerd, nooit verstuurd.
        try:
            real = BitvavoClient(allow_trading=False)
        except RuntimeError:
            log.warning("SHADOW zonder API-key: echt-saldo-limiet wordt overgeslagen")
            real = None
        exchange = ShadowExchange(db, real or MarketData(), capital_eur=cfg.capital_eur,
                                  real_client=real,
                                  taker_fee_pct=cfg.costs.taker_fee_pct,
                                  slippage_pct=cfg.costs.slippage_pct)
    else:
        # PAPER: echte marktdata, gesimuleerde uitvoering. Een API-key is niet nodig.
        exchange = PaperExchange(db, MarketData(), capital_eur=cfg.capital_eur,
                                 taker_fee_pct=cfg.costs.taker_fee_pct,
                                 slippage_pct=cfg.costs.slippage_pct)
    risk = RiskEngine(cfg, db)
    strategy = get_strategy(cfg, db)
    return TradingEngine(cfg, db, exchange, risk, strategy, mode, notifier=notifier)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--once", action="store_true", help="één cycle draaien en stoppen")
    ap.add_argument("--db", default=str(ROOT / "autopilot.db"))
    args = ap.parse_args()

    load_dotenv(ROOT / ".env")
    setup_logging(ROOT / "logs")
    cfg = load_config(ROOT / "config.yaml")

    try:
        mode = resolve_mode(cfg)
    except LiveModeRefused as e:
        log.critical(str(e))
        print(f"GEWEIGERD: {e}", file=sys.stderr)
        return 2

    banner = {TradingMode.PAPER: "PAPER TRADING (simulatie)",
              TradingMode.SHADOW: "SHADOW MODE (live-pad, orders worden NIET verstuurd)",
              TradingMode.LIVE: "⚠️  LIVE TRADING MET ECHT GELD ⚠️"}[mode]
    log.info("Autopilot start — mode: %s, strategie: %s, pairs: %s, interval: %d min",
             banner, cfg.strategy.name, cfg.pairs, cfg.schedule.interval_minutes)

    db = Database(args.db)
    engine = build_engine(cfg, db, mode)
    engine.startup()

    if engine.risk.is_halted():
        reason = db.get_meta("halt_reason", "onbekend")
        log.critical("Bot is permanent gestopt door de drawdown-kill-switch (%s). "
                     "Hef dit bewust op met: python status.py --clear-halt", reason)
        print(f"GESTOPT: {reason} — opheffen kan met: python status.py --clear-halt", file=sys.stderr)
        return 3

    signal.signal(signal.SIGINT, _stop)
    signal.signal(signal.SIGTERM, _stop)

    interval = cfg.schedule.interval_minutes * 60
    notifier = engine.notify
    if isinstance(notifier, TelegramNotifier):
        notifier.send(f"🤖 Autopilot gestart in {mode.value} mode "
                      f"({cfg.strategy.name}, {', '.join(cfg.pairs)})")

    while _running:
        started = time.monotonic()
        try:
            engine.cycle()
            if isinstance(notifier, TelegramNotifier):
                notifier.maybe_daily_summary(db, cfg, datetime.now(timezone.utc))
        except Exception:  # noqa: BLE001 — loop mag nooit sterven aan een enkele fout
            log.exception("cycle mislukt; volgende poging over %d min", cfg.schedule.interval_minutes)
        if engine.risk.is_halted() or args.once:
            break
        # slaap in stukjes zodat SIGTERM snel doorkomt
        remaining = max(0.0, interval - (time.monotonic() - started))
        while _running and remaining > 0:
            step = min(5.0, remaining)
            time.sleep(step)
            remaining -= step

    db.close()
    log.info("Autopilot gestopt.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
