import os
import sys
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.inference import calculate_readiness


def test_prediction_pipeline():

    sample_input = {
        "aptitude_score": 75,
        "subject_score": 70,
        "time_management_score": 80,
        "mock_average_score": 85,
        "consistency_score": 90
    }

    result = calculate_readiness(sample_input)

    assert "readinessIndex" in result
    assert isinstance(result["readinessIndex"], float)


def test_prediction_range():

    sample_input = {
        "aptitude_score": 60,
        "subject_score": 55,
        "time_management_score": 50,
        "mock_average_score": 65,
        "consistency_score": 70
    }

    result = calculate_readiness(sample_input)

    score = result["readinessIndex"]

    assert 0 <= score <= 100
