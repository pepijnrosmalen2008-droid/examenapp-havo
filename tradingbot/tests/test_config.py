"""Config-validatie: fail hard op alles wat niet klopt."""

import pytest
from pydantic import ValidationError

from autopilot.config import LiveModeRefused, TradingMode, resolve_mode
from conftest import make_config


def test_valid_config_loads():
    cfg = make_config()
    assert cfg.mode == TradingMode.PAPER
    assert cfg.pairs == ["BTC-EUR", "ETH-EUR"]


def test_unknown_key_rejected():
    with pytest.raises(ValidationError):
        make_config(target_growth_pct=50)  # géén rendement-beloftes in config


def test_unknown_risk_key_rejected():
    with pytest.raises(ValidationError):
        make_config(risk={"max_position_pct": 20, "stop_loss_pct": 5,
                          "max_daily_loss_pct": 3, "max_drawdown_pct": 15,
                          "target_growth": 10})


def test_invalid_pair_rejected():
    for bad in (["BTC-USD"], ["btc-eur"], ["BTCEUR"], ["BTC-EUR", "BTC-EUR"]):
        with pytest.raises(ValidationError):
            make_config(pairs=bad)


def test_percentages_out_of_range_rejected():
    with pytest.raises(ValidationError):
        make_config(risk={"max_position_pct": 150, "stop_loss_pct": 5,
                          "max_daily_loss_pct": 3, "max_drawdown_pct": 15})
    with pytest.raises(ValidationError):
        make_config(risk={"max_position_pct": 20, "stop_loss_pct": -1,
                          "max_daily_loss_pct": 3, "max_drawdown_pct": 15})


def test_daily_loss_must_be_below_drawdown():
    with pytest.raises(ValidationError):
        make_config(risk={"max_position_pct": 20, "stop_loss_pct": 5,
                          "max_daily_loss_pct": 20, "max_drawdown_pct": 15})


def test_capital_must_support_min_order():
    with pytest.raises(ValidationError):
        make_config(capital_eur=20, risk={"max_position_pct": 10, "stop_loss_pct": 5,
                                          "max_daily_loss_pct": 3, "max_drawdown_pct": 15})


def test_unknown_strategy_rejected():
    with pytest.raises(ValidationError):
        make_config(strategy={"name": "yolo", "params": {}})


# ── Live-mode guardrails ──────────────────────────────────────────────

def test_paper_config_always_paper(tmp_path, monkeypatch):
    monkeypatch.setenv("TRADING_MODE", "LIVE")  # env alleen is niet genoeg
    (tmp_path / "I_UNDERSTAND_THE_RISKS.txt").write_text("ok")
    cfg = make_config(mode="PAPER")
    assert resolve_mode(cfg, project_root=tmp_path) == TradingMode.PAPER


def test_live_refused_without_env(tmp_path, monkeypatch):
    monkeypatch.setenv("TRADING_MODE", "PAPER")
    (tmp_path / "I_UNDERSTAND_THE_RISKS.txt").write_text("ok")
    with pytest.raises(LiveModeRefused, match="TRADING_MODE"):
        resolve_mode(make_config(mode="LIVE"), project_root=tmp_path)


def test_live_refused_without_ack_file(tmp_path, monkeypatch):
    monkeypatch.setenv("TRADING_MODE", "LIVE")
    with pytest.raises(LiveModeRefused, match="I_UNDERSTAND_THE_RISKS"):
        resolve_mode(make_config(mode="LIVE"), project_root=tmp_path)


def test_live_allowed_with_all_three(tmp_path, monkeypatch):
    monkeypatch.setenv("TRADING_MODE", "LIVE")
    (tmp_path / "I_UNDERSTAND_THE_RISKS.txt").write_text("ok")
    assert resolve_mode(make_config(mode="LIVE"), project_root=tmp_path) == TradingMode.LIVE
