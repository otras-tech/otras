"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MistralProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistralProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let MistralProvider = MistralProvider_1 = class MistralProvider {
    constructor() {
        this.logger = new common_1.Logger(MistralProvider_1.name);
    }
    async generate(systemPrompt, payload) {
        const prompt = `
SYSTEM INSTRUCTION:
${systemPrompt}

STRUCTURED INPUT:
${JSON.stringify(payload, null, 2)}

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
        try {
            const response = await axios_1.default.post('https://api.mistral.ai/v1/chat/completions', {
                model: process.env.MISTRAL_MODEL || 'mistral-medium',
                messages: [
                    { role: 'system', content: 'You are an institutional AI advisor.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 3000
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data && response.data.choices && response.data.choices[0]) {
                return response.data.choices[0].message.content;
            }
            throw new Error('Malformed response from Mistral');
        }
        catch (error) {
            this.logger.error('Mistral Error details:', error.response?.data || error.message);
            throw error;
        }
    }
};
exports.MistralProvider = MistralProvider;
exports.MistralProvider = MistralProvider = MistralProvider_1 = __decorate([
    (0, common_1.Injectable)()
], MistralProvider);
//# sourceMappingURL=mistral.provider.js.map