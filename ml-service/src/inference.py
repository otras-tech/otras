# ======================================================
# inference.py
# Readiness Orchestration Layer
# ======================================================

import logging
from typing import Dict

from .feature_engineering import build_feature_vector
from .readiness_model import ReadinessModel

logger = logging.getLogger("inference")
logger.setLevel(logging.INFO)


# Singleton model instance
_model_instance = None


def _get_model() -> ReadinessModel:
    global _model_instance

    if _model_instance is None:
        logger.info("Initializing readiness model instance...")
        _model_instance = ReadinessModel()

    return _model_instance


# ------------------------------------------------------
# Score Interpretation Logic
# ------------------------------------------------------

def _interpret_score(score: float) -> str:
    """
    Deterministic interpretation mapping.
    Government compliant.
    """

    if score >= 85:
        return "Excellent Readiness"
    elif score >= 75:
        return "High Readiness"
    elif score >= 60:
        return "Moderate Readiness"
    elif score >= 40:
        return "Developing Readiness"
    else:
        return "Low Readiness"


# ------------------------------------------------------
# Public Inference Function
# ------------------------------------------------------

def calculate_readiness(payload: Dict) -> Dict:
    """
    Main orchestration method used by FastAPI layer.

    Steps:
    1. Build feature vector
    2. Run deterministic prediction
    3. Interpret score
    4. Return structured response
    """

    try:
        logger.info("Starting readiness calculation...")

        # Step 1: Feature Engineering
        features = build_feature_vector(payload)

        # Step 2: Get model
        model = _get_model()

        # Step 3: Predict score
        score = model.predict(features)

        # Step 4: Interpret score
        status = _interpret_score(score)

        logger.info(f"Readiness score computed: {score}")

        return {
            "readinessIndex": round(score, 2),
            "status": status
        }

    except ValueError as ve:
        logger.warning(f"Validation error in inference: {str(ve)}")
        raise

    except Exception as e:
        logger.error(f"Inference pipeline failed: {str(e)}")
        raise RuntimeError("Readiness inference failed.")
