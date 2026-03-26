"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roadmapPrompt = void 0;
const roadmapPrompt = (input) => `
Format a 12-week exam preparation roadmap.

INPUT:
- Exam: ${input.exam}
- Readiness: ${input.readinessScore}%
- Focus: ${input.focusArea}

JSON SCHEMA:
{
  "overview": "Study trajectory overview",
  "plan": "12-week weekly goals",
  "strategy": "Mock/Revision strategy",
  "advisory": "Final advice"
}
`;
exports.roadmapPrompt = roadmapPrompt;
//# sourceMappingURL=roadmap.prompt.js.map