# backend/config.py

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

TEXT_MODEL_NAME = (
    BASE_DIR
    / "checkpoints"
    / "transformer"
    / "dummy_model"
)

THRESH_BLOCK = 0.75
THRESH_BLUR  = 0.50
THRESH_WARN  = 0.30
