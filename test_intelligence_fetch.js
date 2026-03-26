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
    const response = await fetch('http://localhost:8000/api/v1/ai/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
       console.error(`Status ${response.status}: ${await response.text()}`);
       return;
    }

    const data = await response.json();
    const end = Date.now();
    console.log(`Success in ${end - start}ms:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failure:', error.message);
  }
}

testIntelligence();
