"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptBuilder = void 0;
class PromptBuilder {
    static build(system, userInput) {
        return `
SYSTEM ROLE:
${system}

STRUCTURED INPUT:
${JSON.stringify(userInput, null, 2)}

IMPORTANT:
- Do not calculate scores
- Do not modify numbers
- Only explain and generate structured output
- Keep response professional and institutional

LANGUAGE RULES:
If Telugu: Use modern spoken Telugu (AP/Telangana), avoid classical Sanskrit.
If Hindi: Use simple conversational Hindi.
If English: Use clear Indian English.

AUDIENCE: Competitive exam aspirants.
TONE: Simple, motivational, and practical.
REQUIRED: Clear next steps and study advice.

STRICT ANALYTICAL RULE:
The output must be strictly analytical and educational.
Do NOT include any branding, marketing content, product promotions, advertisements, or suggestions recommending any platform, service, institute, coaching center, or brand.

The response should only focus on objective analysis, academic insights, or structured guidance based on the provided data.
`;
    }
}
exports.PromptBuilder = PromptBuilder;
//# sourceMappingURL=prompt-builder.js.map