# training/train_model.py

import os
import json
import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor

from .dataset_loader import load_dataset, split_dataset
from .model_evaluation import evaluate_model
from .hyperparameter_tuning import tune_model


MODELS_DIR = os.path.join(os.path.dirname(__file__), "../models")


def ensure_model_directory():
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)


def train_model():

    print("Starting training pipeline...")

    df = load_dataset()

    X_train, X_test, y_train, y_test = split_dataset(df)

    feature_columns = list(X_train.columns)

    print("Feature columns:", feature_columns)

    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("Feature scaling completed")

    # Base Model
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=10,
        random_state=42
    )

    model.fit(X_train_scaled, y_train)

    print("Model training completed")

    metrics = evaluate_model(model, X_test_scaled, y_test)

    ensure_model_directory()

    joblib.dump(model, os.path.join(MODELS_DIR, "readiness_model.pkl"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))

    print("Model artifacts saved")

    with open(os.path.join(MODELS_DIR, "feature_columns.json"), "w") as f:
        json.dump(feature_columns, f)

    metadata = {
        "model": "RandomForestRegressor",
        "version": "1.0",
        "metrics": metrics
    }

    with open(os.path.join(MODELS_DIR, "model_metadata.json"), "w") as f:
        json.dump(metadata, f)

    print("Metadata saved")

    print("Training pipeline finished successfully")


def train_with_tuning():

    print("Starting training with hyperparameter tuning")

    df = load_dataset()

    X_train, X_test, y_train, y_test = split_dataset(df)

    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    best_model = tune_model(X_train_scaled, y_train)

    metrics = evaluate_model(best_model, X_test_scaled, y_test)

    ensure_model_directory()

    joblib.dump(best_model, os.path.join(MODELS_DIR, "readiness_model.pkl"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))

    print("Tuned model saved")


if __name__ == "__main__":
    train_model()
