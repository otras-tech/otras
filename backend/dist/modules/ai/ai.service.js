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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prompt_builder_1 = require("./utils/prompt-builder");
const openai_provider_1 = require("./providers/openai.provider");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const ai_repository_1 = require("./repository/ai.repository");
const config_1 = require("@nestjs/config");
let AiService = AiService_1 = class AiService {
    openAiProvider;
    aiQueue;
    repository;
    configService;
    logger = new common_1.Logger(AiService_1.name);
    constructor(openAiProvider, aiQueue, repository, configService) {
        this.openAiProvider = openAiProvider;
        this.aiQueue = aiQueue;
        this.repository = repository;
        this.configService = configService;
    }
    async generate(requesterOtrId, requesterRole, dto) {
        if (requesterOtrId !== dto.userId && requesterRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('Cannot generate roadmap for another user');
        }
        const { language, ...data } = dto;
        if (!['en', 'hi', 'te'].includes(language)) {
            throw new common_1.BadRequestException('Unsupported language');
        }
        const richData = {
            userId: dto.userId?.toString() || 'unknown',
            logicalScore: dto.logicalScore || 0,
            quantScore: dto.quantScore || 0,
            verbalScore: dto.verbalScore || 0,
            interests: dto.interests || [],
            learningPattern: dto.learningPattern || 'Standard',
            confidenceScore: dto.confidenceScore || 0,
            aspirations: dto.aspirations || 'None provided',
        };
        const prof = await this.repository.createProfile({
            userId: richData.userId,
            logicalScore: Number(richData.logicalScore),
            quantScore: Number(richData.quantScore),
            verbalScore: Number(richData.verbalScore),
            interests: richData.interests,
            learningPattern: richData.learningPattern,
            confidenceIndex: Number(richData.confidenceScore),
            aspirations: richData.aspirations,
        });
        const roadmap = await this.repository.createRoadmap({
            profileId: prof.id,
            summary: 'Processing career study plan...',
            recommendations: [],
            phase1: 'Queued',
            phase2: 'Queued',
            status: 'PENDING',
        });
        if (this.configService.get('DISABLE_REDIS') === 'true') {
            process.nextTick(async () => {
                try {
                    const prompt = (0, prompt_builder_1.buildPrompt)(data, language);
                    const systemPrompt = 'You are an institutional career advisor.';
                    const simulatedResponse = (await this.openAiProvider.generateCompletion(systemPrompt, prompt));
                    const summary = typeof simulatedResponse === 'string'
                        ? simulatedResponse
                        : (simulatedResponse.summary ?? 'Generated roadmap');
                    const recommendations = Array.isArray(simulatedResponse.recommendations)
                        ? simulatedResponse.recommendations
                        : [];
                    await this.repository.updateRoadmap(roadmap.id, {
                        summary,
                        recommendations,
                        phase1: simulatedResponse.phase1 ?? 'Completed',
                        phase2: simulatedResponse.phase2 ?? 'Completed',
                        status: 'COMPLETED',
                    });
                }
                catch (err) {
                    this.logger.error('Local AiService execution failed:', err);
                    await this.repository.updateRoadmap(roadmap.id, { status: 'FAILED' });
                }
            });
        }
        else {
            const job = await this.aiQueue.add('generate-roadmap', {
                data: richData,
                language,
                roadmapId: roadmap.id,
            });
            await this.repository.updateRoadmap(roadmap.id, { jobId: job.id });
        }
        return {
            success: true,
            status: 'processing',
            message: 'Roadmap generation started',
            jobId: roadmap.id,
            language,
        };
    }
    async getStatus(requesterOtrId, requesterRole, roadmapId) {
        const roadmap = await this.repository.findRoadmapById(roadmapId);
        if (!roadmap)
            throw new common_1.NotFoundException('Roadmap not found');
        if (roadmap.IntelligenceProfile.userId !== requesterOtrId && requesterRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        return {
            success: true,
            status: roadmap.status,
            roadmap: roadmap.status === 'COMPLETED' ? roadmap : null,
        };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('career-ai')),
    __metadata("design:paramtypes", [openai_provider_1.OpenAiProvider,
        bullmq_2.Queue,
        ai_repository_1.AiRepository,
        config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map