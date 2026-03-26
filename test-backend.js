const payload = {
  userId: 3,
  targetExam: "SSC CGL 2024",
  examDate: "2026-06-16",
  currentLevel: "Intermediate",
  weakAreas: ["Reasoning", "Quant"],
  dailyStudyHours: 6,
  mockFrequency: "Once a week",
  revisionStrategy: "Spaced Repetition",
  preferredStudyTimes: "Mornings (8 AM - 12 PM)",
  language: "en"
};

async function test() {
  console.log("Calling backend at http://localhost:4000/study-plan/generate...");
  try {
    const res = await fetch("http://localhost:4000/study-plan/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  }
}

test();
