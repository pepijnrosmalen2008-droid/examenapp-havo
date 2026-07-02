"""Telegram-notificaties. Faalt stil (met log) — een kapotte notificatie mag
nooit de trading loop breken. Token/chat-id via .env; wordt nooit gelogd."""

from __future__ import annotations

import logging
import os
from datetime import datetime
from zoneinfo import ZoneInfo

import requests

log = logging.getLogger("autopilot.notify")
AMS = ZoneInfo("Europe/Amsterdam")
SUMMARY_HOUR = 20  # dagelijkse samenvatting om 20:00 Europe/Amsterdam


class TelegramNotifier:
    def __init__(self, token: str, chat_id: str):
        self._url = f"https://api.telegram.org/bot{token}/sendMessage"
        self._chat_id = chat_id

    def send(self, text: str) -> None:
        try:
            r = requests.post(self._url, json={"chat_id": self._chat_id, "text": text},
                              timeout=10)
            if r.status_code != 200:
                log.warning("Telegram antwoordde %s: %s", r.status_code, r.text[:200])
        except requests.RequestException as e:
            log.warning("Telegram-notificatie mislukt: %s", e)

    def maybe_daily_summary(self, db, cfg, now_utc: datetime) -> None:
        """Stuur één samenvatting per dag, zodra het 20:00 (Amsterdam) of later is."""
        local = now_utc.astimezone(AMS)
        if local.hour < SUMMARY_HOUR:
            return
        today = local.date().isoformat()
        if db.get_meta("last_summary_date") == today:
            return
        db.set_meta("last_summary_date", today)

        snap = db.last_equity()
        start = db.get_meta_float("starting_capital", cfg.capital_eur)
        day_start = db.get_meta_float("day_start_equity", start)
        positions = db.open_positions()

        if snap is None:
            return
        equity, cash = snap["equity_eur"], snap["cash_eur"]
        lines = [
            f"📊 Dagelijkse samenvatting {today}",
            f"Equity: €{equity:,.2f} (cash €{cash:,.2f})",
            f"P&L vandaag: €{equity - day_start:+,.2f} ({(equity - day_start) / day_start * 100:+.2f}%)",
            f"P&L totaal: €{equity - start:+,.2f} ({(equity - start) / start * 100:+.2f}%)",
            f"Open posities: {len(positions)}",
        ]
        for p in positions:
            lines.append(f"  • {p.pair}: {p.amount:.8f} @ €{p.avg_price:,.2f}")
        self.send("\n".join(lines))


class NullNotifier:
    def send(self, text: str) -> None:
        pass


def build_notifier():
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()
    if token and chat_id:
        log.info("Telegram-notificaties actief")
        return TelegramNotifier(token, chat_id)
    log.info("Telegram niet geconfigureerd; notificaties uit")
    return NullNotifier()
