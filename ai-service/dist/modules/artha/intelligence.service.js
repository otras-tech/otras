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
var IntelligenceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligenceService = void 0;
const common_1 = require("@nestjs/common");
const prompt_1 = require("./prompt");
const runAIService_1 = require("../../utils/runAIService");
let IntelligenceService = IntelligenceService_1 = class IntelligenceService {
    constructor() {
        this.logger = new common_1.Logger(IntelligenceService_1.name);
    }
    async generateFeedback(rawTier, data) {
        const tier = parseInt(rawTier || "1", 10);
        const input = data;
        let prompt;
        let expectedFields;
        if (tier === 1) {
            prompt = (0, prompt_1.intelligencePromptTier1)(input);
            expectedFields = ['logicalFoundation', 'subjectDepth', 'readinessInsight', 'examSuggestions'];
        }
        else if (tier === 2) {
            prompt = (0, prompt_1.intelligencePromptTier2)(input);
            expectedFields = ['subjectStrength', 'weakAreas', 'preparationAdvice'];
        }
        else if (tier === 3) {
            prompt = (0, prompt_1.intelligencePromptTier3)(input);
            expectedFields = ['accuracyInsight', 'speedInsight', 'consistencyInsight'];
        }
        else {
            this.logger.error(`ARTHA AI: Unsupported tier: ${tier}`);
            return null;
        }
        console.log(`AI_SERVICE: Tier ${tier} Prompt being sent:\n`, prompt);
        try {
            const result = await (0, runAIService_1.runAIService)(prompt, input.language, {
                jsonMode: true,
                expectedFields
            });
            return result;
        }
        catch (error) {
            this.logger.error("ARTHA AI Critical failure:", error.message);
            return this.getFallback(tier);
        }
    }
    getFallback(tier) {
        if (tier === 1)
            return { logicalFoundation: "Analysis pending.", subjectDepth: "Analysis pending.", readinessInsight: "Analysis pending." };
        if (tier === 2)
            return { subjectStrength: "Analysis pending.", weakAreas: "Analysis pending.", preparationAdvice: "Analysis pending." };
        return { accuracyInsight: "Analysis pending.", speedInsight: "Analysis pending.", consistencyInsight: "Analysis pending." };
    }
};
exports.IntelligenceService = IntelligenceService;
exports.IntelligenceService = IntelligenceService = IntelligenceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], IntelligenceService);
//# sourceMappingURL=intelligence.service.js.map