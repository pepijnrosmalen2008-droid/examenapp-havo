"""Config laden en valideren met pydantic.

Fail-hard beleid: elke onbekende sleutel, elk ongeldig type en elke waarde buiten
bereik stopt de bot bij startup met een duidelijke foutmelding. Er is bewust GEEN
"target growth"-parameter: de bot belooft geen rendement, hij begrenst alleen risico.
"""

from __future__ import annotations

import os
from enum import Enum
from pathlib import Path
from typing import Literal

import yaml
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

PROJECT_ROOT = Path(__file__).resolve().parent.parent
RISK_ACK_FILE = "I_UNDERSTAND_THE_RISKS.txt"

# Bitvavo hanteert een minimale ordergrootte van 5 EUR.
MIN_ORDER_EUR = 5.0


class TradingMode(str, Enum):
    PAPER = "PAPER"    # publieke data, gesimuleerde uitvoering; geen API-key nodig
    SHADOW = "SHADOW"  # het volledige LIVE-pad (echte key, echt saldo als limiet),
                       # maar de order zelf wordt gelogd en gesimuleerd — nooit verstuurd
    LIVE = "LIVE"


class RiskConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    max_position_pct: float = Field(gt=0, le=100, description="Max % van kapitaal per positie")
    stop_loss_pct: float = Field(gt=0, le=50, description="Stop-loss per positie in %")
    take_profit_pct: float | None = Field(default=None, gt=0, le=500, description="Take-profit per positie in %")
    trailing_take_profit: bool = Field(default=False, description="Trailing stop zodra take-profit-niveau is bereikt")
    max_daily_loss_pct: float = Field(gt=0, le=50, description="Dag-kill-switch: max verlies per dag in %")
    max_drawdown_pct: float = Field(gt=0, le=90, description="Totale kill-switch: max drawdown vanaf startkapitaal in %")
    max_portfolio_heat_pct: float | None = Field(
        default=None, gt=0, le=50,
        description="Max % van kapitaal dat tegelijk 'op het spel' staat als alle stop-losses "
                    "afgaan (Σ positiewaarde × stop_loss_pct). Crypto-pairs zijn sterk "
                    "gecorreleerd; dit behandelt alle posities bewust als één risico-bucket. "
                    "None = uit.")

    @model_validator(mode="after")
    def daily_loss_below_drawdown(self) -> "RiskConfig":
        if self.max_daily_loss_pct >= self.max_drawdown_pct:
            raise ValueError(
                "risk.max_daily_loss_pct moet kleiner zijn dan risk.max_drawdown_pct "
                f"(nu {self.max_daily_loss_pct} >= {self.max_drawdown_pct})"
            )
        return self


class StrategyConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: Literal["dca", "momentum_ma_cross", "grid"]
    params: dict = Field(default_factory=dict)


class ScheduleConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    interval_minutes: int = Field(ge=1, le=24 * 60)


class BacktestCostConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    # Bitvavo taker fee, standaard tarief (categorie A, < 100k EUR/30d volume).
    # Controleer het actuele tarief op https://bitvavo.com/nl/fees
    taker_fee_pct: float = Field(default=0.25, ge=0, le=5)
    slippage_pct: float = Field(default=0.1, ge=0, le=5)


class AppConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    mode: TradingMode = TradingMode.PAPER  # PAPER | SHADOW | LIVE
    capital_eur: float = Field(gt=0, description="Startkapitaal dat de bot mag beheren")
    pairs: list[str] = Field(min_length=1, description="Whitelist; de bot handelt nooit buiten deze lijst")
    risk: RiskConfig
    strategy: StrategyConfig
    schedule: ScheduleConfig
    costs: BacktestCostConfig = Field(default_factory=BacktestCostConfig)

    @field_validator("pairs")
    @classmethod
    def pairs_format(cls, v: list[str]) -> list[str]:
        seen = set()
        for p in v:
            base, sep, quote = p.partition("-")
            if not sep or quote != "EUR" or not base.isalnum() or not base.isupper():
                raise ValueError(f"Ongeldige pair '{p}': verwacht formaat 'BTC-EUR' (quote-valuta moet EUR zijn)")
            if p in seen:
                raise ValueError(f"Pair '{p}' staat dubbel in de whitelist")
            seen.add(p)
        return v

    @model_validator(mode="after")
    def capital_supports_min_order(self) -> "AppConfig":
        max_pos_eur = self.capital_eur * self.risk.max_position_pct / 100
        if max_pos_eur < MIN_ORDER_EUR:
            raise ValueError(
                f"capital_eur × max_position_pct = €{max_pos_eur:.2f}, dat is onder de "
                f"Bitvavo minimale ordergrootte van €{MIN_ORDER_EUR:.0f}"
            )
        return self


class LiveModeRefused(RuntimeError):
    """Live mode geweigerd; message bevat de reden."""


def load_config(path: str | Path = PROJECT_ROOT / "config.yaml") -> AppConfig:
    """Laad en valideer config.yaml. Gooit een exception bij elke fout (fail hard)."""
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Config niet gevonden: {path}")
    with open(path, encoding="utf-8") as f:
        raw = yaml.safe_load(f)
    if not isinstance(raw, dict):
        raise ValueError(f"{path} bevat geen YAML-mapping")
    return AppConfig.model_validate(raw)


def resolve_mode(cfg: AppConfig, project_root: Path = PROJECT_ROOT) -> TradingMode:
    """Bepaal de effectieve trading mode met live-guardrails.

    LIVE vereist ALLE drie:
      1. config.yaml  mode: LIVE
      2. env          TRADING_MODE=LIVE
      3. bestand      I_UNDERSTAND_THE_RISKS.txt in de projectroot

    Ontbreekt er één, dan:
      - config PAPER → gewoon PAPER (de veilige default, geen fout)
      - config LIVE  → LiveModeRefused met de reden; de bot start dan NIET.
    """
    env_mode = os.environ.get("TRADING_MODE", "PAPER").strip().upper()
    ack = (project_root / RISK_ACK_FILE).exists()

    if cfg.mode == TradingMode.PAPER:
        return TradingMode.PAPER
    if cfg.mode == TradingMode.SHADOW:
        # Shadow verstuurt nooit orders en heeft dus geen extra sloten nodig.
        return TradingMode.SHADOW

    # Config vraagt LIVE — controleer de andere twee sloten.
    reasons = []
    if env_mode != "LIVE":
        reasons.append(f"env TRADING_MODE is '{env_mode}', geen 'LIVE'")
    if not ack:
        reasons.append(f"bevestigingsbestand {RISK_ACK_FILE} ontbreekt in {project_root}")
    if reasons:
        raise LiveModeRefused(
            "LIVE mode geweigerd: " + "; ".join(reasons)
            + ". De bot start niet. Draai in PAPER mode of voldoe aan beide voorwaarden."
        )
    return TradingMode.LIVE
