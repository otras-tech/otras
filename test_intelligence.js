const axios = require('axios');

async function testIntelligence() {
  const payload = {
    tier: 1,
    data: {
      logicalScore: 80,
      quantScore: 70,
      verbalScore: 75,
      percentile: 78,
      language: 'en-IN'
    }
  };

  console.log('Sending request to AI Service...');
  const start = Date.now();
  try {
    const response = await axios.post('http://localhost:8000/api/v1/ai/intelligence', payload);
    const end = Date.now();
    console.log(`Success in ${end - start}ms:`, JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Failure:', error.response?.data || error.message);
  }
}

testIntelligence();
