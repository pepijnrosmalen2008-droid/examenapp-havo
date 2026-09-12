"""Execution-laag — HOE een order wordt uitgevoerd, losgekoppeld van WAT er verhandeld wordt.

De goedkoopste "edge" die met zekerheid bestaat is niet de tol onnodig betalen. Elke keer dat
een niet-urgente order als market-order (taker) wordt geplaatst waar een passieve postOnly-limit
had gekund, betaal je de taker−maker-fee én de slippage teveel. Over honderden trades telt dat op.

Dit is bewust géén alpha en géén nieuwe informatiebron: het verslaat geen tegenpartij en
voorspelt niets. Het kiest per order de uitvoeringsstijl en verhoogt zo de netto-EV van álle
strategieën tegelijk. De regel is simpel en conservatief:

  * urgente orders (er-uit-komen) → altijd TAKER. Een paar basispunten besparen weegt niet op
    tegen het risico dat een passieve order níét vult terwijl je juist wilt liquideren;
  * al het andere → MAKER (passief posten) als execution.mode == 'maker_first'.

Zie ExecutionConfig en BITVAVO_ALPHA_ENGINE.md (stap 1) voor de PAPER/SHADOW/LIVE-nuance.
"""

from __future__ import annotations

from .config import AppConfig

# Substrings in de order-reden die "moet er NU uit" betekenen → nooit passief posten.
URGENT_MARKERS = (
    "stop-loss", "take-profit", "kill-switch", "liquidat", "circuit breaker",
    "noodstop", "emergency", "halt",
)

TAKER = "taker"
MAKER = "maker"


def is_urgent(reason: str | None) -> bool:
    """Een exit die niet kan wachten op een passieve fill."""
    low = (reason or "").lower()
    return any(m in low for m in URGENT_MARKERS)


def choose_style(reason: str | None, cfg: AppConfig) -> str:
    """Kies TAKER of MAKER voor deze order. Default (mode 'taker') → altijd TAKER."""
    if cfg.execution.mode != "maker_first":
        return TAKER
    return TAKER if is_urgent(reason) else MAKER


def fee_saving_pct(cfg: AppConfig) -> float:
    """Gegarandeerde fee-besparing (%) van maker t.o.v. taker, als de order als maker vult."""
    return max(0.0, cfg.costs.taker_fee_pct - cfg.costs.maker_fee_pct)
