const axios = require('axios');

async function testTier1() {
    const payload = {
        userId: "1",
        logicalScore: 0.5,
        quantScore: 0,
        verbalScore: 0,
        totalQuestions: 15,
        attemptedCount: 1
    };

    try {
        console.log("Triggering Tier-1 Readiness Test...");
        const resp = await axios.post("http://localhost:4000/artha/tier1", payload);
        console.log("Success:", JSON.stringify(resp.data, null, 2));
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}

testTier1();
