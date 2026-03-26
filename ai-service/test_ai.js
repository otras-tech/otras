const axios = require('axios');
require('dotenv').config({ path: 'e:/OTRAS-PLATFORM/otras-platform/ai-service/.env' });

async function testMistral() {
  console.log('Testing Mistral with Key:', process.env.MISTRAL_API_KEY ? 'Present' : 'Missing');
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-medium',
        messages: [{ role: 'user', content: 'Say hello' }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('Failure:', error.response?.data || error.message);
  }
}

testMistral();
