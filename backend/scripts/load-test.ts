import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1';
const CONCURRENT_REQUESTS = 50;

async function runLoadTest() {
  console.log(`🚀 Starting Load Test: ${CONCURRENT_REQUESTS} concurrent AI Roadmap requests...`);
  
  const startTime = Date.now();
  const requests = Array.from({ length: CONCURRENT_REQUESTS }).map((_, i) => {
    return axios.post(`${BASE_URL}/career-ai/generate-roadmap`, {
      userId: `user_${i}`,
      userProfile: {
        currentLevel: "Undergraduate",
        targetField: "AI/ML Engineering",
        scores: { logical: 85, quant: 90, verbal: 75 }
      }
    }).then(res => {
      console.log(`✅ Request ${i}: Received Job ID ${res.data.jobId}`);
      return res.data;
    }).catch(err => {
      console.error(`❌ Request ${i} Failed: ${err.message}`);
    });
  });

  await Promise.all(requests);
  const endTime = Date.now();
  
  console.log('------------------------------------------------');
  console.log(`📊 Load Test Finished in ${endTime - startTime}ms`);
  console.log(`${CONCURRENT_REQUESTS} jobs successfully enqueued in BullMQ.`);
  console.log('Check your Redis dashboard to monitor the processing queue!');
  console.log('------------------------------------------------');
}

runLoadTest();
