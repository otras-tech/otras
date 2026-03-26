"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAIService = runAIService;
const openai_1 = require("openai");
const axios_1 = require("axios");
const language_map_1 = require("../localization/language-map");
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('AIService');
async function runAIService(prompt, language = 'en-IN', options = {}) {
    const targetLanguage = (0, language_map_1.mapLanguage)(language);
    const maxRetries = options.maxRetries || 1;
    const jsonMode = options.jsonMode !== false;
    logger.log(`Request | Language: ${targetLanguage}`);
    let adaptivePrompt = buildLanguageControlledPrompt(prompt, targetLanguage);
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            logger.log(`AI Call [${attempt}/${maxRetries}]`);
            const rawOutput = await executeAI(adaptivePrompt, targetLanguage, options);
            let cleanOutput = sanitizeResponse(rawOutput);
            if (targetLanguage === 'te-IN') {
                cleanOutput = improveTeluguFlow(cleanOutput);
            }
            if (jsonMode) {
                let parsed;
                try {
                    parsed = JSON.parse(cleanOutput);
                }
                catch {
                    logger.warn(`JSON parse failed → repairing`);
                    parsed = repairJSON(cleanOutput);
                }
                if (options.expectedFields?.length) {
                    const rootKeys = Object.keys(parsed);
                    if (rootKeys.length === 1 && typeof parsed[rootKeys[0]] === 'object' && !Array.isArray(parsed[rootKeys[0]])) {
                        const nested = parsed[rootKeys[0]];
                        const nestedKeys = Object.keys(nested);
                        if (options.expectedFields.some(f => nestedKeys.includes(f))) {
                            logger.warn(`Heuristic: Detected nested JSON. Flattening from key "${rootKeys[0]}"`);
                            parsed = { ...parsed, ...nested };
                        }
                    }
                    const missing = options.expectedFields.filter(f => parsed[f] === undefined);
                    if (missing.length) {
                        adaptivePrompt = `
${prompt}

FIX:
- Missing fields: [${missing.join(', ')}]
- Ensure proper JSON structure
`;
                        throw new Error(`Missing fields: ${missing.join(', ')}`);
                    }
                    options.expectedFields.forEach(f => {
                        if (typeof parsed[f] !== 'string' && !Array.isArray(parsed[f])) {
                            logger.warn(`Field ${f} is NOT a string or array. Flattening nested object.`);
                            parsed[f] = typeof parsed[f] === 'object' ? JSON.stringify(parsed[f]) : String(parsed[f]);
                        }
                    });
                }
                const result = validateLanguageOutput(JSON.stringify(parsed), targetLanguage);
                if (!result.isValid) {
                    logger.warn(`Language issue: ${result.reason}`);
                    adaptivePrompt = `
${prompt}

FIX:
- Keep JSON structure same
- Rewrite values in ${targetLanguage}
- Keep 1–2 sentences (slightly descriptive)
`;
                    throw new Error(result.reason);
                }
                logger.log(`✅ Success`);
                return parsed;
            }
            return cleanOutput;
        }
        catch (error) {
            logger.error(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt === maxRetries) {
                logger.error(`Max retries → fallback`);
                return getFallbackResponse(options.expectedFields);
            }
        }
    }
}
function buildLanguageControlledPrompt(prompt, language) {
    let languageInstruction = "";
    if (language === "te-IN") {
        languageInstruction = `
Respond like a friendly coaching mentor.

STYLE:
- Modern conversational Telugu
- Telugu PRIMARY (~80%)
- English support words allowed (practice, test, revision, quant)
- Use 1–2 short sentences per activity
- Add helpful guidance (what + how to do it)
- Give clarity like a mentor explaining next step
- Make it slightly detailed but not long paragraphs
- Give practical guidance (what + how)

STRICT RULES:
- Start sentences in Telugu
- Avoid full English sentences
- Avoid formal Telugu

TONE:
- Friendly
- Motivational
- Clear

Examples:
"ఈ రోజు quant practice చేయి. ముఖ్యమైన topics మీద focus పెట్టు"
"reasoning test రాయ్ మరియు mistakes చూసుకుని improve అవ్వు"
`;
    }
    else if (language === "hi-IN") {
        languageInstruction = `
Respond like a friendly coaching mentor.

STYLE:
- Simple conversational Hindi
- Hindi PRIMARY (~80%)
- English support words allowed
- Use 1–2 short sentences
- Give practical guidance

STRICT RULES:
- Start sentences in Hindi
- Avoid full English sentences

TONE:
- Friendly
- Motivational

Examples:
"आज quant practice करो. important topics पर focus करो"
"reasoning test दो और mistakes समझकर improve करो"
`;
    }
    else {
        languageInstruction = `
Respond in standard, clear English as used in Indian professional and educational contexts.
STRICTLY use English script only. 
DO NOT use Hindi, Hinglish, or any other regional language characters or words.
Maintain a professional mentor tone.
`;
    }
    return `
You are the OTRAS Career Intelligence Engine.

TARGET LANGUAGE: ${language}

${languageInstruction}

IMPORTANT RULES:
- JSON keys must be in English.
- JSON values MUST be in the TARGET LANGUAGE (${language}).
- If TARGET LANGUAGE is en-IN, use standard English ONLY.
- Return ONLY valid JSON.

--- TASK ---
${prompt}
`;
}
async function executeAI(prompt, language, options) {
    const provider = options.provider || process.env.AI_PROVIDER || 'openai';
    if (provider === 'mistral') {
        return runMistral(prompt, options);
    }
    return runOpenAI(prompt, options);
}
async function runOpenAI(prompt, options) {
    const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
            { role: "system", content: "Return ONLY valid JSON." },
            { role: "user", content: prompt }
        ],
        temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.2,
        max_tokens: options.maxTokens || Number(process.env.AI_MAX_TOKENS) || 6000,
        response_format: { type: "json_object" }
    }, { timeout: 90000 });
    const content = response.choices?.[0]?.message?.content || "";
    logger.log(`AI Service: Output length: ${content.length}`);
    if (response.choices?.[0]?.finish_reason === 'length') {
        logger.warn('AI Service: Truncation warning');
    }
    return content;
}
async function runMistral(prompt, options) {
    const response = await axios_1.default.post(process.env.MISTRAL_ENDPOINT || 'https://api.mistral.ai/v1/chat/completions', {
        model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
        messages: [
            { role: "system", content: "Return ONLY valid JSON." },
            { role: "user", content: prompt }
        ],
        temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.2,
        max_tokens: options.maxTokens || Number(process.env.AI_MAX_TOKENS) || 6000,
        response_format: { type: "json_object" }
    }, {
        headers: { Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` },
        timeout: 60000
    });
    const content = response.data?.choices?.[0]?.message?.content || "";
    logger.log(`AI Service: Output length: ${content.length}`);
    if (response.data?.choices?.[0]?.finish_reason === 'length') {
        logger.warn('AI Service: Truncation warning');
    }
    return content;
}
function sanitizeResponse(raw) {
    if (!raw)
        return "";
    let clean = raw.trim();
    clean = clean.replace(/```json/g, "").replace(/```/g, "");
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
        clean = clean.substring(start, end + 1);
    }
    return clean;
}
function repairJSON(input) {
    let repaired = input.trim();
    try {
        return JSON.parse(repaired);
    }
    catch (e) { }
    repaired = repaired
        .replace(/\\(?!["/\\bfnrtu])/g, '\\\\')
        .replace(/[\u0000-\u001F]+/g, ' ');
    const stack = [];
    let result = "";
    let inString = false;
    let escaped = false;
    for (let i = 0; i < repaired.length; i++) {
        let char = repaired[i];
        if (escaped) {
            result += char;
            escaped = false;
            continue;
        }
        if (char === '\\') {
            result += char;
            escaped = true;
            continue;
        }
        if (char === '"') {
            result += char;
            inString = !inString;
            continue;
        }
        if (inString) {
            if (char === '\n')
                result += '\\n';
            else if (char === '\r') { }
            else
                result += char;
        }
        else {
            if (char === '{' || char === '[') {
                stack.push(char);
                result += char;
            }
            else if (char === '}') {
                if (stack.length > 0 && stack[stack.length - 1] === '{') {
                    stack.pop();
                    result += char;
                }
            }
            else if (char === ']') {
                if (stack.length > 0 && stack[stack.length - 1] === '[') {
                    stack.pop();
                    result += char;
                }
            }
            else
                result += char;
        }
    }
    while (stack.length > 0) {
        const open = stack.pop();
        if (open === '{')
            result += '}';
        else if (open === '[')
            result += ']';
    }
    try {
        return JSON.parse(result);
    }
    catch (e) {
        logger.error("JSON Repair failed completely");
        return {};
    }
}
function validateLanguageOutput(text, language) {
    if (language === 'en-IN')
        return { isValid: true };
    const teluguRegex = /[\u0C00-\u0C7F]/;
    const hindiRegex = /[\u0900-\u097F]/;
    if (language === 'te-IN' && !teluguRegex.test(text)) {
        return { isValid: false, reason: "No Telugu content" };
    }
    if (language === 'hi-IN' && !hindiRegex.test(text)) {
        return { isValid: false, reason: "No Hindi content" };
    }
    return { isValid: true };
}
function improveTeluguFlow(text) {
    return text
        .replace(/చేయవలెను/g, "చేయాలి")
        .replace(/ప్రయత్నించవలెను/g, "ప్రయత్నించాలి")
        .replace(/విధంగా/g, "లా");
}
function getFallbackResponse(fields) {
    if (!fields)
        return { message: "AI failed" };
    const obj = {};
    fields.forEach(f => obj[f] = "Unavailable");
    return obj;
}
//# sourceMappingURL=runAIService.js.map