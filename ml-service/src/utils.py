# ======================================================
# utils.py
# Utility Helpers for OTRAS ML Service
# ======================================================

import joblib
import logging
import os
from pathlib import Path
from typing import Any

from .config import settings


# ------------------------------------------------------
# Logging Setup
# ------------------------------------------------------

def configure_logging():
    """
    Configures application-wide logging.
    Should be called once at startup if needed.
    """

    if settings.ENABLE_LOGGING:
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
        )
    else:
        logging.basicConfig(level=logging.WARNING)


logger = logging.getLogger("ml-utils")


# ------------------------------------------------------
# File Validation
# ------------------------------------------------------

def validate_file_exists(path: Path):
    """
    Ensures model or scaler file exists.
    Raises clear error if missing.
    """

    if not Path(path).exists():
        logger.error(f"File not found: {path}")
        raise FileNotFoundError(f"Required file missing: {path}")


# ------------------------------------------------------
# Safe Pickle Loader
# ------------------------------------------------------

def load_pickle(path: Path) -> Any:
    """
    Loads a pickle file safely.

    Includes:
    - Existence validation
    - Clear error reporting
    - Logging
    """

    try:
        validate_file_exists(path)

        logger.info(f"Loading artifact from: {path}")

        artifact = joblib.load(path)

        logger.info(f"Successfully loaded artifact: {path.name}")

        return artifact

    except FileNotFoundError:
        raise

    except Exception as e:
        logger.error(f"Failed to load pickle file: {str(e)}")
        raise RuntimeError(f"Artifact loading failed: {path}")


# ------------------------------------------------------
# Safe Feature Clamping Helper
# ------------------------------------------------------

def clamp_value(value: float,
                min_value: float = settings.MIN_FEATURE_VALUE,
                max_value: float = settings.MAX_FEATURE_VALUE) -> float:
    """
    Ensures numeric value remains within allowed bounds.
    """

    if value < min_value:
        return min_value
    if value > max_value:
        return max_value
    return float(value)


# ------------------------------------------------------
# Safe Float Conversion
# ------------------------------------------------------

def safe_float(value: Any) -> float:
    """
    Converts input to float safely.
    Raises meaningful error if invalid.
    """

    try:
        return float(value)
    except (ValueError, TypeError):
        raise ValueError(f"Invalid numeric value: {value}")
