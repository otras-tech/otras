import sys
import os

# Add src to path
sys.path.append(os.path.abspath('src'))

from readiness_model import ReadinessModel
from feature_engineering import build_feature_vector

try:
    model = ReadinessModel()
    
    print("--- Simulation 1 (Low) ---")
    payload1 = {'aptitude_score': 16.6, 'subject_score': 0, 'time_management_score': 0, 'mock_average_score': 0, 'consistency_score': 0}
    score1 = model.predict(build_feature_vector(payload1))
    print(f"Readiness: {score1}")

    print("\n--- Simulation 2 (Medium) ---")
    payload2 = {'aptitude_score': 50, 'subject_score': 50, 'time_management_score': 50, 'mock_average_score': 50, 'consistency_score': 50}
    score2 = model.predict(build_feature_vector(payload2))
    print(f"Readiness: {score2}")

    print("\n--- Simulation 3 (High) ---")
    payload3 = {'aptitude_score': 90, 'subject_score': 90, 'time_management_score': 90, 'mock_average_score': 90, 'consistency_score': 90}
    score3 = model.predict(build_feature_vector(payload3))
    print(f"Readiness: {score3}")

except Exception as e:
    print(f"Error: {e}")
