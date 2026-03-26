"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careerPrompt = void 0;
const careerPrompt = (input) => `
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
exports.careerPrompt = careerPrompt;
//# sourceMappingURL=career.prompt.js.map