"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performancePrompt = void 0;
const performancePrompt = (input) => `
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
exports.performancePrompt = performancePrompt;
//# sourceMappingURL=performance.prompt.js.map