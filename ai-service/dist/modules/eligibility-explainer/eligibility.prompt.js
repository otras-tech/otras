"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eligibilityPrompt = void 0;
const eligibilityPrompt = (input) => `
Explain the eligibility status for ${input.exam}.

DATA:
- Status: ${input.status}
- Reasons: ${input.reasons}

JSON SCHEMA:
{
  "decision": "Breakdown of the decision",
  "improvements": ["Mandatory improvement 1"],
  "alternatives": ["Suggested alternatives"]
}
`;
exports.eligibilityPrompt = eligibilityPrompt;
//# sourceMappingURL=eligibility.prompt.js.map