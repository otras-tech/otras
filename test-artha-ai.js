async function testArtha() {
  const payload = {
    tier: 1,
    data: {
      logicalScore: 75,
      quantScore: 80,
      verbalScore: 60,
      percentile: 72,
      language: 'en'
    }
  };

  const url = 'http://localhost:8000/api/v1/ai/intelligence';
  console.log(`Calling Artha Intelligence at ${url}...`);
  try {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  }
}

testArtha();
