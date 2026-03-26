import os
import sys
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.feature_engineering import build_feature_vector


def test_feature_transformation():

    sample_input = {
        "aptitude_score": 70,
        "subject_score": 65,
        "time_management_score": 60,
        "mock_average_score": 75,
        "consistency_score": 80
    }

    transformed = build_feature_vector(sample_input)

    assert transformed is not None
    assert transformed.shape == (1, 5)


def test_feature_keys_validation():

    invalid_input = {
        "aptitude_score": 70
    }

    try:
        build_feature_vector(invalid_input)
        assert False
    except ValueError:
        assert True
