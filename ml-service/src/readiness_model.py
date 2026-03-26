# ======================================================
# readiness_model.py
# Core Deterministic Readiness Engine
# ======================================================

import numpy as np
import logging
from typing import Optional
from sklearn.base import BaseEstimator
from sklearn.preprocessing import StandardScaler

import pandas as pd
from .utils import load_pickle
from .config import settings

logger = logging.getLogger("readiness_model")
logger.setLevel(logging.INFO)


class ReadinessModel:
    """
    Production-safe readiness model wrapper.

    Responsibilities:
    - Load trained model
    - Load scaler
    - Apply deterministic transformation
    - Return bounded readiness score
    """

    def __init__(self):
        self.model: Optional[BaseEstimator] = None
        self.scaler: Optional[StandardScaler] = None
        self.feature_names: Optional[list] = None
        self._load_artifacts()

    def _load_artifacts(self):
        """
        Loads model and scaler from disk.
        Fails safely if artifacts missing.
        """
        try:
            logger.info("Loading readiness model...")
            self.model = load_pickle(settings.MODEL_PATH)

            logger.info("Loading scaler...")
            self.scaler = load_pickle(settings.SCALER_PATH)

            # Load feature names to ensure DataFrame compatibility
            feature_names_path = settings.BASE_DIR / "models" / "feature_columns.json"
            import json
            with open(feature_names_path, 'r') as f:
                self.feature_names = json.load(f)

            logger.info("Model, scaler, and feature names loaded successfully.")

        except Exception as e:
            logger.error(f"Failed to load model artifacts: {str(e)}")
            raise RuntimeError(f"Model initialization failed: {str(e)}")

    def predict(self, features: np.ndarray) -> float:
        """
        Deterministic readiness score prediction.

        IMPORTANT:
        - No probability output
        - No classification exposure
        - No success prediction
        """

        if self.model is None or self.scaler is None:
            logger.warning("Artifacts missing during predict, attempting lazy load...")
            self._load_artifacts()
            if self.model is None or self.scaler is None:
                raise RuntimeError("Model not initialized properly and lazy load failed.")

        if features.ndim != 2:
            raise ValueError("Feature vector must be 2D.")

        try:
            # Convert to DataFrame with names to satisfy strict scikit-learn transformers
            df_features = pd.DataFrame(features, columns=self.feature_names)
            
            # Scale features
            scaled_features = self.scaler.transform(df_features)

            # Predict readiness score
            raw_score = self.model.predict(scaled_features)[0]

            # Convert to float safely
            score = float(raw_score)

            # Enforce 0-100 boundary (government compliance)
            score = max(0.0, min(100.0, score))

            return round(score, 2)

        except Exception as e:
            import traceback
            traceback.print_exc()
            logger.error(f"Prediction failed: {str(e)}")
            raise RuntimeError(f"Readiness prediction failed: {str(e)}")
