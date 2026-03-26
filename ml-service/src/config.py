# ======================================================
# config.py
# Central Configuration for OTRAS ML Service
# ======================================================

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings:
    """
    Centralized configuration manager.

    Supports:
    - Docker
    - Kubernetes
    - Local development
    - Environment overrides
    """

    # --------------------------------------------------
    # Core App Metadata
    # --------------------------------------------------

    APP_NAME: str = os.getenv("APP_NAME", "OTRAS ML Readiness Service")
    VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # --------------------------------------------------
    # Base Directory
    # --------------------------------------------------

    BASE_DIR: Path = Path(__file__).resolve().parent.parent

    # --------------------------------------------------
    # Model Paths
    # --------------------------------------------------

    MODEL_PATH: Path = Path(
        os.getenv(
            "MODEL_PATH",
            BASE_DIR / "models" / "readiness_model.pkl"
        )
    )

    SCALER_PATH: Path = Path(
        os.getenv(
            "SCALER_PATH",
            BASE_DIR / "models" / "scaler.pkl"
        )
    )

    # --------------------------------------------------
    # Inference Behavior
    # --------------------------------------------------

    ENABLE_MODEL_VALIDATION: bool = os.getenv(
        "ENABLE_MODEL_VALIDATION",
        "true"
    ).lower() == "true"

    ENABLE_LOGGING: bool = os.getenv(
        "ENABLE_LOGGING",
        "true"
    ).lower() == "true"

    # --------------------------------------------------
    # Performance Settings
    # --------------------------------------------------

    MAX_FEATURE_VALUE: float = 100.0
    MIN_FEATURE_VALUE: float = 0.0


# Singleton settings object
settings = Settings()
