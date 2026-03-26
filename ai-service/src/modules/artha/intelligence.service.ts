import { Injectable, Logger } from '@nestjs/common';
import {
    intelligencePromptTier1,
    intelligencePromptTier2,
    intelligencePromptTier3
} from './prompt';

import { runAIService } from '../../utils/runAIService';

@Injectable()
export class IntelligenceService {
    private readonly logger = new Logger(IntelligenceService.name);

    constructor() { }

    async generateFeedback(rawTier: any, data: any) {
        const tier = parseInt(rawTier || "1", 10);
        const input = data;

        let prompt: string;
        let expectedFields: string[];

        if (tier === 1) {
            prompt = intelligencePromptTier1(input);
            expectedFields = ['logicalFoundation', 'subjectDepth', 'readinessInsight', 'examSuggestions'];
        } else if (tier === 2) {
            prompt = intelligencePromptTier2(input);
            expectedFields = ['subjectStrength', 'weakAreas', 'preparationAdvice'];
        } else if (tier === 3) {
            prompt = intelligencePromptTier3(input);
            expectedFields = ['accuracyInsight', 'speedInsight', 'consistencyInsight'];
        } else {
            this.logger.error(`ARTHA AI: Unsupported tier: ${tier}`);
            return null;
        }

        console.log(`AI_SERVICE: Tier ${tier} Prompt being sent:\n`, prompt);

        try {
            const result = await runAIService(prompt, input.language, {
                jsonMode: true,
                expectedFields
            });
            return result;
        } catch (error) {
            this.logger.error("ARTHA AI Critical failure:", error.message);
            return this.getFallback(tier);
        }
    }

    private getFallback(tier: number) {
        if (tier === 1) return { logicalFoundation: "Analysis pending.", subjectDepth: "Analysis pending.", readinessInsight: "Analysis pending." };
        if (tier === 2) return { subjectStrength: "Analysis pending.", weakAreas: "Analysis pending.", preparationAdvice: "Analysis pending." };
        return { accuracyInsight: "Analysis pending.", speedInsight: "Analysis pending.", consistencyInsight: "Analysis pending." };
    }
}

