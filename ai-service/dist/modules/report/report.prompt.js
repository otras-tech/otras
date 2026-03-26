"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportPrompt = void 0;
const reportPrompt = (input) => `
Format an institutional report.

INPUT:
- Readiness: ${input.readinessScore}%
- Sections: ${JSON.stringify(input.sectionScores)}
- Eligibility: ${input.eligibility}
- Risk: ${input.burnoutRisk}

JSON SCHEMA:
{
  "summary": "Executive summary",
  "assessment": "Academic interpretation",
  "strengthsAndImprovements": "Strategic analysis",
  "plan": "4-week action plan",
  "parentSummary": "Non-technical summary for parent"
}
`;
exports.reportPrompt = reportPrompt;
//# sourceMappingURL=report.prompt.js.map