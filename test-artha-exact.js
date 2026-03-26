async function testArthaExactJSON() {
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
  try {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log("RAW_JSON_START");
    console.log(JSON.stringify(data));
    console.log("RAW_JSON_END");
  } catch (e) {
    console.error("Error:", e.message);
  }
}

testArthaExactJSON();
