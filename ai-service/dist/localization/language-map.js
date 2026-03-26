"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageInstructions = exports.getLanguageRules = exports.mapLanguage = void 0;
const mapLanguage = (lang) => {
    const mapping = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'te': 'te-IN',
        'en-IN': 'en-IN',
        'hi-IN': 'hi-IN',
        'te-IN': 'te-IN'
    };
    return mapping[lang] || 'en-IN';
};
exports.mapLanguage = mapLanguage;
const getLanguageRules = (lang) => {
    const language = (0, exports.mapLanguage)(lang);
    return `
You are the OTRAS Career Intelligence Engine.

Generate response in ${language}

Language Rules:

If language = te-IN
Use modern spoken Telugu used by students in Andhra Pradesh & Telangana.
Avoid classical Sanskrit Telugu.

If language = hi-IN
Use simple conversational Hindi.

If language = en-IN
Use clear Indian English.

Audience:
Indian competitive exam aspirants.

Tone:
Motivational, simple, and practical.

Response must include:
• clear next steps
• motivational tone
• practical study advice
`;
};
exports.getLanguageRules = getLanguageRules;
exports.languageInstructions = {
    en: "Respond entirely in clear Indian English (en-IN).",
    hi: "Respond entirely in simple conversational Hindi (hi-IN).",
    te: "Respond entirely in modern spoken Telugu (te-IN)."
};
//# sourceMappingURL=language-map.js.map