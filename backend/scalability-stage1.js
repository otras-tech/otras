import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        stage1_test: {
            executor: 'constant-arrival-rate',
            rate: 1000, // 🎯 100 RPS target
            timeUnit: '1s',
            duration: '1m',
            preAllocatedVUs: 300,
            maxVUs: 1000,
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<200'], // latency goal
        http_req_failed: ['rate<0.01'],   // <1% errors
    },
};

export default function () {
    const res = http.get('http://localhost:4000/api/v1/exams?take=10');

    check(res, {
        'status is 200': (r) => r.status === 200,
    });
}