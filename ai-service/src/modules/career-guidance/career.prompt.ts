export const careerPrompt = (input: any) => `
Suggest career directions based on candidate profile.

INPUT:
- Scores: ${JSON.stringify(input.scores)}
- Interests: ${input.interests}

GENERATE JSON:
{
  "clusters": "List of clusters",
  "reasoning": "Mapping logic",
  "roadmap": "12-month skill plan",
  "nextSteps": "Actionable steps"
}
`;

