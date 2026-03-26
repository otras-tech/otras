export const reportPrompt = (input: any) => `
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

