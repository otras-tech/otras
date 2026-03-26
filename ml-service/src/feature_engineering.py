# ======================================================
# feature_engineering.py
# Deterministic Feature Builder for OTRAS
# ======================================================

import numpy as np
import logging
from typing import Dict

logger = logging.getLogger("feature_engineering")
logger.setLevel(logging.INFO)


# ------------------------------------------------------
# Internal Business Rule Normalization
# ------------------------------------------------------

def _normalize_score(value: float) -> float:
    """
    Ensures score is within 0-100 range.
    Defensive safety layer.
    """
    if value < 0:
        return 0.0
    if value > 100:
        return 100.0
    return float(value)


def _derive_consistency_weight(mock_average: float, consistency: float) -> float:
    """
    Domain logic:
    If mock average is high but consistency low,
    penalize slightly to reflect instability.

    Deterministic rule-based logic.
    """
    if mock_average >= 70 and consistency < 50:
        return consistency * 0.9
    return consistency


# ------------------------------------------------------
# Public Feature Builder
# ------------------------------------------------------

def build_feature_vector(payload: Dict) -> np.ndarray:
    """
    Converts validated backend payload into
    structured numeric feature vector.

    Expected payload keys:
    - aptitude_score
    - subject_score
    - time_management_score
    - mock_average_score
    - consistency_score

    Returns:
        numpy array of shape (1, n_features)
    """

    try:
        aptitude = _normalize_score(payload["aptitude_score"])
        subject = _normalize_score(payload["subject_score"])
        time_management = _normalize_score(payload["time_management_score"])
        mock_average = _normalize_score(payload["mock_average_score"])
        consistency = _normalize_score(payload["consistency_score"])

        # Apply domain-specific deterministic adjustment
        adjusted_consistency = _derive_consistency_weight(
            mock_average,
            consistency
        )

        feature_vector = np.array([
            aptitude,
            subject,
            time_management,
            mock_average,
            adjusted_consistency
        ], dtype=float)

        logger.info(f"Feature vector built: {feature_vector}")

        return feature_vector.reshape(1, -1)

    except KeyError as ke:
        logger.error(f"Missing required feature: {str(ke)}")
        raise ValueError(f"Missing required feature: {str(ke)}")

    except Exception as e:
        logger.error(f"Feature engineering failed: {str(e)}")
        raise RuntimeError("Feature engineering failed.")
