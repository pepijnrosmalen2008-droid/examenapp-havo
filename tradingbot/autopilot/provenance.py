"""Reproduceerbaarheid — elke beslissing herleidbaar naar exact deze code + config.

Werkt óók vanuit een gedownloade ZIP (geen .git nodig): de 'code-versie' is een hash
van de eigen broncode, niet een git-commit. Samen met de config-hash kan elke conclusie
later exact worden teruggevonden: welke code, welke instellingen, wanneer gestart.
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

_PKG = Path(__file__).resolve().parent


def code_hash() -> str:
    """Korte hash over alle .py-bestanden van de bot — verandert bij elke codewijziging."""
    h = hashlib.sha256()
    for p in sorted(_PKG.glob("*.py")):
        h.update(p.name.encode())
        h.update(p.read_bytes())
    return h.hexdigest()[:10]


def config_hash(cfg) -> str:
    """Korte hash over de (genormaliseerde) config — verandert bij elke instelling."""
    try:
        data = cfg.model_dump(mode="json")
    except Exception:  # noqa: BLE001 — val terug op repr
        data = str(cfg)
    blob = json.dumps(data, sort_keys=True, default=str)
    return hashlib.sha256(blob.encode()).hexdigest()[:10]


def python_version() -> str:
    return f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
