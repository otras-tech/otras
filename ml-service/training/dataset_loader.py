# training/dataset_loader.py

import pandas as pd
from sklearn.model_selection import train_test_split
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/preprocessed_data.csv")


def load_dataset():
    """
    Load training dataset from CSV.
    """

    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)

    print("Dataset loaded successfully")
    print(f"Dataset shape: {df.shape}")

    return df


def split_dataset(df, target_column="readiness_score", test_size=0.2):

    if target_column not in df.columns:
        raise ValueError(f"Target column {target_column} not found")

    X = df.drop(columns=[target_column])
    y = df[target_column]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=42
    )

    print("Dataset split completed")

    return X_train, X_test, y_train, y_test
