import requests
import json

BASE_URL = "http://127.0.0.1:5000"

# ── Test 1: Health Check ──────────────────────────────────────────────────────
print("=" * 60)
print("TEST 1: Health Check")
print("=" * 60)
resp = requests.get(f"{BASE_URL}/health")
print(f"Status Code : {resp.status_code}")
print(f"Response    : {json.dumps(resp.json(), indent=2)}")
print()

# ── Test 2: Valid Readiness Request ──────────────────────────────────────────
print("=" * 60)
print("TEST 2: Valid Readiness Calculation (typical student)")
print("=" * 60)
payload = {
    "aptitude_score": 75.0,
    "subject_score": 68.0,
    "time_management_score": 60.0,
    "mock_average_score": 72.0,
    "consistency_score": 80.0
}
resp = requests.post(f"{BASE_URL}/readiness/calculate", json=payload)
print(f"Status Code : {resp.status_code}")
print(f"Input       : {json.dumps(payload, indent=2)}")
print(f"Response    : {json.dumps(resp.json(), indent=2)}")
print()

# ── Test 3: High Scorer ───────────────────────────────────────────────────────
print("=" * 60)
print("TEST 3: High Performer")
print("=" * 60)
payload_high = {
    "aptitude_score": 95.0,
    "subject_score": 92.0,
    "time_management_score": 90.0,
    "mock_average_score": 94.0,
    "consistency_score": 91.0
}
resp = requests.post(f"{BASE_URL}/readiness/calculate", json=payload_high)
print(f"Status Code : {resp.status_code}")
print(f"Response    : {json.dumps(resp.json(), indent=2)}")
print()

# ── Test 4: Low Scorer ───────────────────────────────────────────────────────
print("=" * 60)
print("TEST 4: Low Performer")
print("=" * 60)
payload_low = {
    "aptitude_score": 30.0,
    "subject_score": 25.0,
    "time_management_score": 20.0,
    "mock_average_score": 28.0,
    "consistency_score": 22.0
}
resp = requests.post(f"{BASE_URL}/readiness/calculate", json=payload_low)
print(f"Status Code : {resp.status_code}")
print(f"Response    : {json.dumps(resp.json(), indent=2)}")
print()

# ── Test 5: Invalid Payload (missing fields) ─────────────────────────────────
print("=" * 60)
print("TEST 5: Invalid Payload (missing fields - expect 422)")
print("=" * 60)
bad_payload = {"aptitude_score": 70.0}
resp = requests.post(f"{BASE_URL}/readiness/calculate", json=bad_payload)
print(f"Status Code : {resp.status_code} (expected 422)")
print(f"Response    : {json.dumps(resp.json(), indent=2)}")
print()

# ── Test 6: Out-of-Range Values ──────────────────────────────────────────────
print("=" * 60)
print("TEST 6: Out-of-Range Values (expect 422)")
print("=" * 60)
oob_payload = {
    "aptitude_score": 150.0,
    "subject_score": -10.0,
    "time_management_score": 60.0,
    "mock_average_score": 72.0,
    "consistency_score": 80.0
}
resp = requests.post(f"{BASE_URL}/readiness/calculate", json=oob_payload)
print(f"Status Code : {resp.status_code} (expected 422)")
print(f"Response    : {json.dumps(resp.json(), indent=2)}")
print()

print("=" * 60)
print("ALL TESTS COMPLETE")
print("=" * 60)
