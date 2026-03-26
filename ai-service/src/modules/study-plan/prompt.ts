export const studyPlanPrompt = (
  input: any,
  daysToGenerate: number,
  startDay: number
) => `
CRITICAL:

- Use simple conversational modern daily speaking ${input.language}
// CHANGED: Enforced transliteration rule for Telugu & Hindi + strict subject-only English
- Use only ${input.language} words. If language is Telugu or Hindi, write English terms in native script (transliteration), NOT pure English
// CHANGED: Strict rule for subjects
- Use English ONLY for subject names like Quant, Logical, Verbal. Do NOT use English for any other words
// CHANGED: Updated mentor instruction
- Write like a coaching mentor guiding a student in ${input.language}

----------------------------------------

TASK:
Generate study plan for ${input.targetExam}

USER PROFILE:
- Proficiency: ${input.currentLevel}
- Weakness: ${Array.isArray(input.weakAreas) ? input.weakAreas.join(', ') : input.weakAreas}
- Strategy: ${input.revisionStrategy}

----------------------------------------

CHUNK INFO:
- Days: ${startDay} to ${startDay + daysToGenerate - 1}
- Total: ${daysToGenerate}

----------------------------------------

REQUIREMENTS:

1. Each day MUST have:
- Minimum 4 activities
- Maximum 5 activities
- Prefer 5

2. Description Rules:
- Use 1–2 short sentences
- Must include WHAT + HOW
- Minimum 8–12 words
- Avoid one-line phrases
- Make it useful guidance

3. Language:
// CHANGED: Strict enforcement for Telugu/Hindi transliteration + subject-only English
- Write descriptions fully in ${input.language}
- If ${input.language} is Telugu or Hindi:
  - Convert English words into native script (example: practice → ప్రాక్టీస్ / प्रैक्टिस)
  - Do NOT use raw English words
  - EXCEPTION: Only subject names (Quant, Logical, Verbal) must remain in English

----------------------------------------

IMPORTANT:

// CHANGED: Examples updated for Telugu + Hindi transliteration with subject-only English

BAD:
"Quant practice చేయి"

GOOD (Telugu):
"ఈ రోజు Quant ప్రాక్టీస్ చేయి. ముఖ్యమైన విషయాలపై ఫోకస్ పెట్టు"

BAD:
"Mock test రాయ్"

GOOD (Telugu):
"మాక్ టెస్ట్ రాయ్ మరియు తప్పులను చూసుకుని ఇంప్రూవ్ చేస్కో"

BAD:
"Quant practice करो"

GOOD (Hindi):
"आज Quant प्रैक्टिस करो। महत्वपूर्ण टॉपिक्स पर फोकस करो"

BAD:
"Mock test दो"

GOOD (Hindi):
"मॉक टेस्ट दो और गलतियों को देखकर इम्प्रूव करो"

----------------------------------------

STRICT RULES:

// CHANGED: Added strict enforcement clarity
- ONLY subject names can be in English (Quant, Logical, Verbal)
- All other words must be in ${input.language} (Telugu/Hindi transliteration if needed)
- Do NOT mix raw English words in sentences
- Do NOT generate short 1-line tasks
- Do NOT generate less than 4 activities
- Maintain proper JSON

----------------------------------------

JSON SCHEMA (MANDATORY):

{
  "summary": "Brief plan summary",
  "recommendations": ["Tip 1"],
  "days": [
    {
      "dayNumber": number,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "timeSlot": "HH:MM",
          "description": "1–2 sentence mentor-style guidance",
          "focusArea": "Subject"
        }
      ]
    }
  ]
}

----------------------------------------

FINAL:
Return ONLY valid JSON.
`;