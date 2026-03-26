"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careerAiPrompt = void 0;
const careerAiPrompt = (input) => {
    return `
IMPORTANT:
Generate ALL content strictly in ${input.language}.
Do NOT mix languages.
Follow conversational tone rules.

Analyze the candidate intelligence profile. 
Logical Score: ${input.logicalScore} 
Quant Score: ${input.quantScore} 
Verbal Score: ${input.verbalScore} 
Learning Pattern: ${input.learningPattern} 
Confidence Index: ${input.confidenceIndex} 
Interests: ${input.interests} 
Aspirations: ${input.longTermAspirations || input.aspirations} 

Create a structured 1-year career roadmap. 

Return JSON: 
{ 
"summary": "", 
"recommendations": [], 
"sixMonth": ["Step 1", "Step 2"], 
"oneYear": ["Goal 1", "Goal 2"] 
}

STRICT RULE: Return ONLY raw JSON starting with { and ending with }. No markdown, no backticks.
STRICT RULE: Do NOT translate JSON keys (summary, recommendations, sixMonth, oneYear). Only translate the content values.
`;
};
exports.careerAiPrompt = careerAiPrompt;
//# sourceMappingURL=career-ai.prompt.js.map