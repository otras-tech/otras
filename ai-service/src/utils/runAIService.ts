import OpenAI from 'openai';
import axios from 'axios';
import { mapLanguage } from '../localization/language-map';
import { Logger } from '@nestjs/common';

const logger = new Logger('AIService');

export interface AIServiceOptions {
  provider?: 'openai' | 'mistral';
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  expectedFields?: string[];
  maxRetries?: number;
}

/**
 * 🚀 MAIN AI PIPELINE
 */
export async function runAIService(
  prompt: string,
  language: string = 'en-IN',
  options: AIServiceOptions = {}
) {
  const targetLanguage = mapLanguage(language);
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
        } catch {
          logger.warn(`JSON parse failed → repairing`);
          parsed = repairJSON(cleanOutput);
        }

        // Required fields validation
        if (options.expectedFields?.length) {
          // If keys are missing at root, try to find them inside a single nested object
          // Some AI models return { "Analysis": { "expectedField": "..." } }
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

          // Force all expected fields to be strings (flatten if needed), but PRESERVE arrays
          options.expectedFields.forEach(f => {
            if (typeof parsed[f] !== 'string' && !Array.isArray(parsed[f])) {
              logger.warn(`Field ${f} is NOT a string or array. Flattening nested object.`);
              parsed[f] = typeof parsed[f] === 'object' ? JSON.stringify(parsed[f]) : String(parsed[f]);
            }
          });
        }

        // Language validation (relaxed)
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

    } catch (error) {
      logger.error(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt === maxRetries) {
        logger.error(`Max retries → fallback`);
        return getFallbackResponse(options.expectedFields);
      }
    }
  }
}

/**
 * 🧠 LANGUAGE-CONTROLLED PROMPT
 */
function buildLanguageControlledPrompt(prompt: string, language: string) {
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

/**
 * 🤖 AI EXECUTION
 */
async function executeAI(prompt: string, language: string, options: AIServiceOptions) {
  const provider = options.provider || process.env.AI_PROVIDER || 'openai';

  if (provider === 'mistral') {
    return runMistral(prompt, options);
  }
  return runOpenAI(prompt, options);
}

async function runOpenAI(prompt: string, options: AIServiceOptions) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: "Return ONLY valid JSON." },
      { role: "user", content: prompt }
    ],
    temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.2,
    max_tokens: options.maxTokens || Number(process.env.AI_MAX_TOKENS) || 6000,
    response_format: { type: "json_object" }
  }, { timeout: 90000 }); // 30s for LLM to respond

  const content = response.choices?.[0]?.message?.content || "";
  logger.log(`AI Service: Output length: ${content.length}`);
  if (response.choices?.[0]?.finish_reason === 'length') {
    logger.warn('AI Service: Truncation warning');
  }
  return content;
}

async function runMistral(prompt: string, options: AIServiceOptions) {
  const response = await axios.post(
    process.env.MISTRAL_ENDPOINT || 'https://api.mistral.ai/v1/chat/completions',
    {
      model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
      messages: [
        { role: "system", content: "Return ONLY valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.2,
      max_tokens: options.maxTokens || Number(process.env.AI_MAX_TOKENS) || 6000,
      response_format: { type: "json_object" }
    },
    {
      headers: { Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` },
      timeout: 60000 // 30s for LLM to respond
    }
  );

  const content = response.data?.choices?.[0]?.message?.content || "";
  logger.log(`AI Service: Output length: ${content.length}`);
  if (response.data?.choices?.[0]?.finish_reason === 'length') {
    logger.warn('AI Service: Truncation warning');
  }
  return content;
}

/**
 * 🧹 CLEAN RESPONSE
 */
function sanitizeResponse(raw: string): string {
  if (!raw) return "";

  let clean = raw.trim();

  // Remove markdown blocks if present
  clean = clean.replace(/```json/g, "").replace(/```/g, "");

  // Heuristic to find the main JSON block
  // We look for the first '{' and corresponding last '}'
  // This is more robust than a regex for complex nested JSON
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');

  if (start !== -1 && end !== -1) {
    clean = clean.substring(start, end + 1);
  }

  return clean;
}

/**
 * 🛠 JSON REPAIR (ROBUST)
 */
function repairJSON(input: string): any {
  let repaired = input.trim();

  // Try direct parse first
  try { return JSON.parse(repaired); } catch (e) { }

  // Basic cleaning
  repaired = repaired
    .replace(/\\(?!["/\\bfnrtu])/g, '\\\\') // Fix unescaped backslashes
    .replace(/[\u0000-\u001F]+/g, ' ');     // Remove control characters

  // Balanced stack repair
  const stack: string[] = [];
  let result = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < repaired.length; i++) {
    let char = repaired[i];
    if (escaped) { result += char; escaped = false; continue; }
    if (char === '\\') { result += char; escaped = true; continue; }
    if (char === '"') { result += char; inString = !inString; continue; }

    if (inString) {
      if (char === '\n') result += '\\n';
      else if (char === '\r') { }
      else result += char;
    } else {
      if (char === '{' || char === '[') { stack.push(char); result += char; }
      else if (char === '}') { if (stack.length > 0 && stack[stack.length - 1] === '{') { stack.pop(); result += char; } }
      else if (char === ']') { if (stack.length > 0 && stack[stack.length - 1] === '[') { stack.pop(); result += char; } }
      else result += char;
    }
  }

  // Close open brackets
  while (stack.length > 0) {
    const open = stack.pop();
    if (open === '{') result += '}';
    else if (open === '[') result += ']';
  }

  try {
    return JSON.parse(result);
  } catch (e) {
    logger.error("JSON Repair failed completely");
    return {};
  }
}

/**
 * 🌐 LANGUAGE VALIDATION
 */
function validateLanguageOutput(text: string, language: string) {
  if (language === 'en-IN') return { isValid: true };

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

/**
 * 🧠 TELUGU FLOW FIX
 */
function improveTeluguFlow(text: string) {
  return text
    .replace(/చేయవలెను/g, "చేయాలి")
    .replace(/ప్రయత్నించవలెను/g, "ప్రయత్నించాలి")
    .replace(/విధంగా/g, "లా");
}

/**
 * 🛑 FALLBACK
 */
function getFallbackResponse(fields?: string[]) {
  if (!fields) return { message: "AI failed" };

  const obj: any = {};
  fields.forEach(f => obj[f] = "Unavailable");

  return obj;
}