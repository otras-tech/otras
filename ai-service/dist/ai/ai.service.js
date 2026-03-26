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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const provider_factory_1 = require("../providers/provider.factory");
const language_map_1 = require("../localization/language-map");
let AiService = AiService_1 = class AiService {
    constructor(providerFactory) {
        this.providerFactory = providerFactory;
        this.logger = new common_1.Logger(AiService_1.name);
    }
    async generate(systemPrompt, payload) {
        const language = payload?.language || 'en-IN';
        const languageRules = (0, language_map_1.getLanguageRules)(language);
        const finalSystemPrompt = `${languageRules}\n\n--- MODULE SPECIFIC INSTRUCTIONS ---\n\n${systemPrompt}`;
        const provider = this.providerFactory.getProvider();
        try {
            const response = await provider.generate(finalSystemPrompt, payload);
            return response;
        }
        catch (error) {
            this.logger.error('Primary provider failed. Trying fallback...', error);
            try {
                const fallback = process.env.AI_FALLBACK || 'openai';
                process.env.AI_PROVIDER = fallback;
                const fallbackProvider = this.providerFactory.getProvider();
                return await fallbackProvider.generate(finalSystemPrompt, payload);
            }
            catch (fallbackError) {
                this.logger.error('All AI providers failed', fallbackError);
                throw new common_1.InternalServerErrorException('AI generation failed. Please try again later.');
            }
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [provider_factory_1.ProviderFactory])
], AiService);
//# sourceMappingURL=ai.service.js.map