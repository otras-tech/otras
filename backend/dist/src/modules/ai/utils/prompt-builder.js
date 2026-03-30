"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPrompt = buildPrompt;
function buildPrompt(data, language) {
    let languageInstruction = "";
    if (language === "hi") {
        languageInstruction = "Respond entirely in Hindi.";
    }
    if (language === "te") {
        languageInstruction = "Respond entirely in Telugu.";
    }
    if (language === "en") {
        languageInstruction = "Respond entirely in English.";
    }
    return `
${languageInstruction}

You are an institutional career advisor.
Generate a structured study roadmap.

Student Data:
${JSON.stringify(data)}
  `;
}
//# sourceMappingURL=prompt-builder.js.map