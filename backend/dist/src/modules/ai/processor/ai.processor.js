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
var AiProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const openai_provider_1 = require("../providers/openai.provider");
const prompt_builder_1 = require("../utils/prompt-builder");
let AiProcessor = AiProcessor_1 = class AiProcessor extends bullmq_1.WorkerHost {
    openAiProvider;
    logger = new common_1.Logger(AiProcessor_1.name);
    constructor(openAiProvider) {
        super();
        this.openAiProvider = openAiProvider;
    }
    async process(job) {
        const { data, language, roadmapId } = job.data;
        this.logger.log(`Processing career-ai job ${job.id} for roadmap ${roadmapId}`);
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
            let roadmap;
            if (response.ok) {
                roadmap = await response.json();
            }
            else {
                this.logger.warn(`AI Service call failed (status ${response.status}), falling back to OpenAI`);
                const prompt = (0, prompt_builder_1.buildPrompt)(data, language);
                const systemPrompt = "You are an institutional career advisor.";
                roadmap = await this.openAiProvider.generateCompletion(systemPrompt, prompt);
            }
            this.logger.log(`Career roadmap generated for ${roadmapId}`);
            return { status: 'completed', roadmap };
        }
        catch (error) {
            this.logger.error(`Failed to process career-ai job ${job.id}`, error.stack);
            throw error;
        }
    }
};
exports.AiProcessor = AiProcessor;
exports.AiProcessor = AiProcessor = AiProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('career-ai'),
    __metadata("design:paramtypes", [openai_provider_1.OpenAiProvider])
], AiProcessor);
//# sourceMappingURL=ai.processor.js.map