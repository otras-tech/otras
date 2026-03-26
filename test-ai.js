async function test() {
  const payload = {
    userId: 3,
    targetExam: 'SSC CGL 2024',
    currentLevel: 'Intermediate',
    weakAreas: ['Reasoning', 'Quant'],
    dailyStudyHours: 6,
    language: 'en'
  };

  console.log("Calling AI Service at http://localhost:8000/api/v1/study-plan...");
  try {
    const res = await fetch('http://localhost:8000/api/v1/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data keys:", Object.keys(data));
    console.log("Summary:", data.summary);
    console.log("Days count:", data.days ? data.days.length : 'N/A');
  } catch (e) {
    console.error("Error:", e.message);
  }
}

test();
