import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// ✅ LOAD TEST SCENARIOS
const allScenarios = {
  smoke: {
    executor: 'constant-vus',
    vus: 1,
    duration: '30s',
    tags: { test_type: 'smoke' },
  },
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 50 },
      { duration: '3m', target: 50 },
      { duration: '1m', target: 0 },
    ],
    tags: { test_type: 'load' },
  },
  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 200 },
      { duration: '5m', target: 200 },
      { duration: '2m', target: 0 },
    ],
    tags: { test_type: 'stress' },
  },
  hundred_users: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 100 },
      { duration: '3m', target: 100 },
      { duration: '1m', target: 0 },
    ],
    tags: { test_type: 'hundred_users' },
  },
  custom_stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: "2m", target: 200 },
      { duration: "5m", target: 1000 },
      { duration: "5m", target: 2000 },
      { duration: "2m", target: 0 }
    ],
    tags: { test_type: 'custom_stress' },
  },
};

// Selection logic: Run a specific scenario using `-e SCENARIO=name` or all by default.
export const options = {
  scenarios: __ENV.SCENARIO ? { [__ENV.SCENARIO]: allScenarios[__ENV.SCENARIO] } : allScenarios,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api/v1';
const INTERNAL_SECRET = __ENV.INTERNAL_LOAD_TEST_SECRET || 'super-secret-key';

// ✅ SETUP: Register/Login a unique user for this VU
export function setup() {
  // Setup runs once per test execution. 
  // However, we want individual VUs to have their own identity.
  // We'll perform login inside the default function instead.
}

export default function () {
  const uniqueId = `load_test_${randomString(8)}@example.com`;
  const password = 'Password123!';

  // --- 1. USER REGISTRATION ---
  const regRes = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
    email: uniqueId,
    password: password,
    firstName: 'Load',
    lastName: 'Tester',
    otrId: `OTR_${randomString(10).toUpperCase()}`,
    age: 25,
    category: 'General',
    highestDegree: 'Bachelors',
    careerPreference: 'UPSC',
    domicile: 'Delhi',
    pincode: '110001'
  }), {
    headers: {
      'Content-Type': 'application/json',
      'x-internal-secret': INTERNAL_SECRET
    },
  });

  const isRegistered = check(regRes, { 'registered successfully': (r) => r.status === 201 });

  if (!isRegistered) {
    console.error(`[VU ${__VU}] Registration failed: ${regRes.status} ${regRes.body}`);
    sleep(1); // Safety sleep
    return;
  }

  const tokens = regRes.json();
  const accessToken = tokens.accessToken || tokens.access_token;
  const userId = tokens.user ? tokens.user.otrId : null;

  if (!accessToken) return;

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'x-internal-secret': INTERNAL_SECRET,
  };

  sleep(1);

  // --- 2. BROWSE EXAMS (Read-Heavy) ---
  const examsRes = http.get(`${BASE_URL}/exams`, { headers: authHeaders });
  const exams = examsRes.json();
  check(examsRes, {
    'fetched exams': (r) => r.status === 200,
    'exams list is array': (r) => Array.isArray(r.json())
  });

  if (exams.length > 0) {
    const examId = exams[0].id;
    http.get(`${BASE_URL}/exams/${examId}`, { headers: authHeaders });
  }

  sleep(randomIntBetween(1, 3));

  // --- 3. START ARTHA ASSESSMENT (AI/Queue-Heavy) ---
  const startArthaRes = http.post(`${BASE_URL}/artha/start-tier/1`, JSON.stringify({
    userId: userId || 'OTR_TEST_USER'
  }), { headers: authHeaders });

  check(startArthaRes, { 'artha assessment started': (r) => r.status === 201 });
  const assessmentId = startArthaRes.json().id;

  if (assessmentId) {
    // Simulate answering 3 questions
    for (let i = 0; i < 3; i++) {
      const attemptRes = http.post(`${BASE_URL}/artha/attempt-question`, JSON.stringify({
        assessmentId: assessmentId,
        questionId: randomIntBetween(1, 100),
        selectedOption: 'A',
        isCorrect: true,
        timeTaken: 15
      }), { headers: authHeaders });

      check(attemptRes, { 'recorded attempt': (r) => r.status === 201 });
      sleep(1);
    }

    // --- 4. SUBMIT TIER 1 (Triggers Background AI Analysis via BullMQ) ---
    const submitRes = http.post(`${BASE_URL}/artha/tier1`, JSON.stringify({
      userId: userId || 'OTR_TEST_USER',
      assessmentId: assessmentId,
      logicalScore: 5,
      quantScore: 5,
      verbalScore: 5,
      totalQuestions: 15,
      attemptedCount: 3,
      language: 'English'
    }), { headers: authHeaders });

    check(submitRes, { 'tier 1 submitted': (r) => r.status === 201 });
  }

  // --- 5. GET STATUS (Aggregated Data) ---
  const statusRes = http.get(`${BASE_URL}/artha/status/${userId || 'OTR_TEST_USER'}`, { headers: authHeaders });
  check(statusRes, { 'fetched status': (r) => r.status === 200 });

  sleep(randomIntBetween(2, 5));
}