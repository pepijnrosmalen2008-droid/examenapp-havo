import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from autopilot.config import AppConfig  # noqa: E402
from autopilot.database import Database  # noqa: E402


BASE_CFG = {
    "mode": "PAPER",
    "capital_eur": 500,
    "pairs": ["BTC-EUR", "ETH-EUR"],
    "risk": {
        "max_position_pct": 20,
        "stop_loss_pct": 5,
        "take_profit_pct": 10,
        "max_daily_loss_pct": 3,
        "max_drawdown_pct": 15,
    },
    "strategy": {"name": "dca", "params": {"amount_eur": 10, "every_hours": 24}},
    "schedule": {"interval_minutes": 15},
}


def make_config(**overrides) -> AppConfig:
    import copy
    raw = copy.deepcopy(BASE_CFG)
    for key, val in overrides.items():
        if isinstance(val, dict) and isinstance(raw.get(key), dict):
            raw[key].update(val)
        else:
            raw[key] = val
    return AppConfig.model_validate(raw)


@pytest.fixture
def cfg() -> AppConfig:
    return make_config()


@pytest.fixture
def db(tmp_path) -> Database:
    d = Database(tmp_path / "test.db")
    yield d
    d.close()


class FakeMarket:
    """Deterministische marktdata voor tests."""

    def __init__(self, prices: dict[str, float] | None = None):
        self.prices = prices or {"BTC-EUR": 50_000.0, "ETH-EUR": 2_500.0}
        self.candle_data: dict[str, list[tuple]] = {}

    def ticker_price(self, pair: str) -> float:
        return self.prices[pair]

    def candles(self, pair: str, interval: str = "1h", limit: int = 200, since_ms=None) -> list[tuple]:
        data = self.candle_data.get(pair, [])
        return data[-limit:]


@pytest.fixture
def market() -> FakeMarket:
    return FakeMarket()
