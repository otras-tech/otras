"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiService", {
    enumerable: true,
    get: function() {
        return AiService;
    }
});
const _common = require("@nestjs/common");
const _promptbuilder = require("./utils/prompt-builder");
const _openaiprovider = require("./providers/openai.provider");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AiService = class AiService {
    async generate(dto) {
        const { language, ...data } = dto;
        if (![
            'en',
            'hi',
            'te'
        ].includes(language)) {
            throw new _common.BadRequestException('Unsupported language');
        }
        try {
            // Call the AI microservice
            const response = await fetch('http://127.0.0.1:8000/api/v1/career-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-language': language
                },
                body: JSON.stringify({
                    ...data,
                    language
                })
            });
            if (!response.ok) {
                throw new Error(`AI service responded with status: ${response.status}`);
            }
            const result = await response.json();
            return {
                status: 'success',
                language,
                roadmap: result
            };
        } catch (error) {
            // Fallback to simulation if microservice is down
            console.error('AI Service call failed:', error.message);
            const prompt = (0, _promptbuilder.buildPrompt)(data, language);
            const systemPrompt = 'You are an institutional career advisor.';
            const simulatedResponse = await this.openAiProvider.generateCompletion(systemPrompt, prompt);
            return {
                status: 'success',
                language,
                roadmap: simulatedResponse
            };
        }
    }
    constructor(openAiProvider){
        this.openAiProvider = openAiProvider;
    }
};
AiService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _openaiprovider.OpenAiProvider === "undefined" ? Object : _openaiprovider.OpenAiProvider
    ])
], AiService);

//# sourceMappingURL=ai.service.js.map