export const burnoutPrompt = (input: any) => `
Analyze study/sleep balance and burnout risk.

INPUT:
- Study/Sleep: ${input.studyHours}h / ${input.sleepHours}h
- Stress: ${input.stressLevel}
- Trend: ${input.performanceTrend}
- Risk: ${input.burnoutRisk}

JSON SCHEMA:
{
  "riskInterpretation": "Analysis of current risk",
  "strategies": ["Break strategy 1", "Break strategy 2"],
  "advice": "Optimization advice"
}
`;

