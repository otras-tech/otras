# ======================================================
# main.py
# OTRAS ML Readiness Microservice
# ======================================================

import logging
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import numpy as np

from .readiness_model import ReadinessModel
from .feature_engineering import build_feature_vector
from .config import settings


# ------------------------------------------------------
# Logging Configuration
# ------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)

logger = logging.getLogger("ml-service")


# ------------------------------------------------------
# Initialize FastAPI App
# ------------------------------------------------------

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="OTRAS Deterministic Readiness ML Service"
)


# ------------------------------------------------------
# Initialize Model (Singleton)
# ------------------------------------------------------

try:
    readiness_model = ReadinessModel()
    logger.info("Readiness model initialized successfully.")
except Exception as e:
    logger.critical(f"Model initialization failed: {str(e)}")
    readiness_model = None


# ------------------------------------------------------
# Request Schema
# ------------------------------------------------------

class ReadinessRequest(BaseModel):
    aptitude_score: float = Field(..., ge=0, le=100)
    subject_score: float = Field(..., ge=0, le=100)
    time_management_score: float = Field(..., ge=0, le=100)
    mock_average_score: float = Field(..., ge=0, le=100)
    consistency_score: float = Field(..., ge=0, le=100)


# ------------------------------------------------------
# Response Schema
# ------------------------------------------------------

class ReadinessResponse(BaseModel):
    readinessIndex: float
    status: str


# ------------------------------------------------------
# Health Endpoint
# ------------------------------------------------------

@app.get("/health")
def health():
    return {
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "healthy"
    }


# ------------------------------------------------------
# Readiness Calculation Endpoint
# ------------------------------------------------------

@app.post("/readiness/calculate", response_model=ReadinessResponse)
def calculate_readiness(request: ReadinessRequest):

    if readiness_model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not available"
        )

    try:
        # Convert to dict
        payload = request.dict()

        # Feature engineering
        features = build_feature_vector(payload)

        # Predict readiness
        score = readiness_model.predict(features)

        # Interpret status (deterministic mapping)
        if score >= 75:
            status = "High Readiness"
        elif score >= 50:
            status = "Moderate Readiness"
        else:
            status = "Low Readiness"

        return JSONResponse(
            content={
                "readinessIndex": score,
                "status": status
            }
        )

    except ValueError as ve:
        logger.warning(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))

    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error(f"Internal error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal readiness computation error: {str(e)}"
        )
