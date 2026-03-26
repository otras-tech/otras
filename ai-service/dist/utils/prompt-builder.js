"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPrompt = buildPrompt;
const language_map_1 = require("../localization/language-map");
function buildPrompt(data, language) {
    const instruction = language_map_1.languageInstructions[language] || language_map_1.languageInstructions.en;
    return `
${instruction}

You are an expert exam readiness advisor.

Student Data:
${JSON.stringify(data)}
`;
}
//# sourceMappingURL=prompt-builder.js.map