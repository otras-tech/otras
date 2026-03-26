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
var ModelRouterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRouterService = void 0;
const common_1 = require("@nestjs/common");
const provider_factory_1 = require("../providers/provider.factory");
const prompt_builder_1 = require("../utils/prompt-builder");
const response_parser_1 = require("../utils/response-parser");
let ModelRouterService = ModelRouterService_1 = class ModelRouterService {
    constructor(providerFactory) {
        this.providerFactory = providerFactory;
        this.logger = new common_1.Logger(ModelRouterService_1.name);
    }
    async generate(systemPrompt, payload) {
        const provider = this.providerFactory.getProvider();
        const providerName = process.env.AI_PROVIDER || 'openai';
        const modelName = process.env.OPENAI_MODEL || 'default';
        const prompt = (0, prompt_builder_1.buildPrompt)(systemPrompt, payload);
        try {
            const rawResponse = await provider.generate(prompt, payload);
            const parsed = response_parser_1.ResponseParser.parse(providerName, modelName, rawResponse);
            return parsed;
        }
        catch (error) {
            this.logger.error('Primary AI provider failed', error);
            const fallback = process.env.AI_FALLBACK || 'openai';
            try {
                process.env.AI_PROVIDER = fallback;
                const fallbackProvider = this.providerFactory.getProvider();
                const rawResponse = await fallbackProvider.generate(prompt, payload);
                return response_parser_1.ResponseParser.parse(fallback, modelName, rawResponse);
            }
            catch (fallbackError) {
                this.logger.error('Fallback AI provider also failed', fallbackError);
                throw new Error('All AI providers failed');
            }
        }
    }
};
exports.ModelRouterService = ModelRouterService;
exports.ModelRouterService = ModelRouterService = ModelRouterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [provider_factory_1.ProviderFactory])
], ModelRouterService);
//# sourceMappingURL=model-router.service.js.map