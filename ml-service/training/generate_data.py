import pandas as pd
import numpy as np
from pathlib import Path
import random
import os

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

FEATURE_COLUMNS = [
    "aptitude_score",
    "subject_score",
    "time_management_score",
    "mock_average_score",
    "consistency_score"
]

TARGET_COLUMN = "readiness_score"

def generate_student_sample():
    aptitude = random.uniform(30, 95)
    subject = random.uniform(25, 95)
    time_mgmt = random.uniform(20, 95)
    mock_avg = random.uniform(20, 95)
    consistency = random.uniform(20, 95)

    # Deterministic readiness formula (baseline truth)
    readiness = (
        0.25 * aptitude +
        0.25 * subject +
        0.2 * time_mgmt +
        0.2 * mock_avg +
        0.1 * consistency
    )

    return [
        aptitude,
        subject,
        time_mgmt,
        mock_avg,
        consistency,
        readiness
    ]

def main():
    print(f"Generating data in {DATA_DIR}...")
    data = [generate_student_sample() for _ in range(5000)]

    df = pd.DataFrame(
        data,
        columns=FEATURE_COLUMNS + [TARGET_COLUMN]
    )

    DATA_PATH = DATA_DIR / "preprocessed_data.csv"
    df.to_csv(DATA_PATH, index=False)

    print(f"Saved 5000 samples to {DATA_PATH}")

if __name__ == "__main__":
    main()
