import os
import joblib
import json

MODELS_DIR = os.path.join(os.path.dirname(__file__), "../models")


def test_model_file_exists():
    model_path = os.path.join(MODELS_DIR, "readiness_model.pkl")
    assert os.path.exists(model_path), "Model file does not exist"


def test_scaler_file_exists():
    scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")
    assert os.path.exists(scaler_path), "Scaler file does not exist"


def test_feature_columns_exists():
    feature_path = os.path.join(MODELS_DIR, "feature_columns.json")
    assert os.path.exists(feature_path), "Feature columns file missing"


def test_model_can_load():
    model_path = os.path.join(MODELS_DIR, "readiness_model.pkl")

    model = joblib.load(model_path)

    assert model is not None


def test_scaler_can_load():
    scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")

    scaler = joblib.load(scaler_path)

    assert scaler is not None


def test_feature_columns_format():
    feature_path = os.path.join(MODELS_DIR, "feature_columns.json")

    with open(feature_path) as f:
        columns = json.load(f)

    assert isinstance(columns, list)
    assert len(columns) > 0
