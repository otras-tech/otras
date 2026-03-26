from src.readiness_model import ReadinessModel
from src.feature_engineering import build_feature_vector
import traceback

try:
    model = ReadinessModel()
    
    print("--- Tier 1 (16.6%) ---")
    payload1 = {
        'aptitude_score': 16.66,
        'subject_score': 0,
        'time_management_score': 0,
        'mock_average_score': 0,
        'consistency_score': 0
    }
    features1 = build_feature_vector(payload1)
    score1 = model.predict(features1)
    print(f"Readiness: {score1}")

    print("\n--- Tier 2 (37.5% - corrected) ---")
    payload2 = {
        'aptitude_score': 16.66,
        'subject_score': 37.5,
        'time_management_score': 0,
        'mock_average_score': 0,
        'consistency_score': 0
    }
    features2 = build_feature_vector(payload2)
    score2 = model.predict(features2)
    print(f"Readiness: {score2}")

except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()
