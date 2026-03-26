"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prompt_builder_1 = require("./utils/prompt-builder");
const openai_provider_1 = require("./providers/openai.provider");
let AiService = class AiService {
    openAiProvider;
    constructor(openAiProvider) {
        this.openAiProvider = openAiProvider;
    }
    async generate(dto) {
        const { language, ...data } = dto;
        if (!['en', 'hi', 'te'].includes(language)) {
            throw new common_1.BadRequestException('Unsupported language');
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/career-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-language': language,
                },
                body: JSON.stringify({
                    ...data,
                    language,
                }),
            });
            if (!response.ok) {
                throw new Error(`AI service responded with status: ${response.status}`);
            }
            const result = await response.json();
            return {
                status: 'success',
                language,
                roadmap: result,
            };
        }
        catch (error) {
            console.error('AI Service call failed:', error.message);
            const prompt = (0, prompt_builder_1.buildPrompt)(data, language);
            const systemPrompt = "You are an institutional career advisor.";
            const simulatedResponse = await this.openAiProvider.generateCompletion(systemPrompt, prompt);
            return {
                status: 'success',
                language,
                roadmap: simulatedResponse,
            };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openai_provider_1.OpenAiProvider])
], AiService);
//# sourceMappingURL=ai.service.js.map