import { languageInstructions } from "../localization/language-map";

export function buildPrompt(data, language) {

  const instruction =
    languageInstructions[language] || languageInstructions.en;

  return `
${instruction}

You are an expert exam readiness advisor.

Student Data:
${JSON.stringify(data)}
`;
}