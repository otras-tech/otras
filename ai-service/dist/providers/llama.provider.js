"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LlamaProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlamaProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let LlamaProvider = LlamaProvider_1 = class LlamaProvider {
    constructor() {
        this.logger = new common_1.Logger(LlamaProvider_1.name);
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
            const response = await axios_1.default.post(process.env.LLAMA_URL || 'http://localhost:11434/api/generate', {
                model: process.env.LLAMA_MODEL || 'llama3',
                prompt,
                stream: false
            });
            return response.data.response;
        }
        catch (error) {
            this.logger.error('Llama Error', error);
            throw error;
        }
    }
};
exports.LlamaProvider = LlamaProvider;
exports.LlamaProvider = LlamaProvider = LlamaProvider_1 = __decorate([
    (0, common_1.Injectable)()
], LlamaProvider);
//# sourceMappingURL=llama.provider.js.map