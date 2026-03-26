export const eligibilityPrompt = (input: any) => `
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

