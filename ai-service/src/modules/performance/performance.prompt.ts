export const performancePrompt = (input: any) => `
Analyze performance and suggest improvements.

INPUT:
- Sections: ${JSON.stringify(input.sectionScores)}
- Accuracy: ${input.accuracy}%
- Time: ${input.timeTaken} mins

JSON SCHEMA:
{
  "weaknesses": ["Area 1"],
  "suggestions": ["Tip 1"],
  "timeStrategy": "Analysis of speed",
  "routine": "Actionable daily routine"
}
`;

