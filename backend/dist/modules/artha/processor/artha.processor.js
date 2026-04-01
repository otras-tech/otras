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
var ArthaProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArthaProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const artha_repository_1 = require("../repository/artha.repository");
const config_1 = require("@nestjs/config");
let ArthaProcessor = ArthaProcessor_1 = class ArthaProcessor extends bullmq_1.WorkerHost {
    repository;
    configService;
    logger = new common_1.Logger(ArthaProcessor_1.name);
    ML_SERVICE_URL;
    AI_SERVICE_URL;
    constructor(repository, configService) {
        super();
        this.repository = repository;
        this.configService = configService;
        this.ML_SERVICE_URL =
            this.configService.get('ML_SERVICE_URL') || 'http://127.0.0.1:5000';
        this.AI_SERVICE_URL =
            this.configService.get('AI_SERVICE_URL') ||
                'http://localhost:8000/api/v1';
    }
    async process(job) {
        const { type, userId, assessmentId, tier, data } = job.data;
        this.logger.log(`Processing artha job ${job.id} of type ${type} for user ${userId}`);
        try {
            if (type === 'tier-analysis') {
                await this.handleTierAnalysis(userId, assessmentId, tier, data);
            }
            return { status: 'completed' };
        }
        catch (error) {
            this.logger.error(`Failed to process artha job ${job.id}`, error.stack);
            throw error;
        }
    }
    async handleTierAnalysis(userId, assessmentId, tier, inputData) {
        await this.repository.completeAssessment(assessmentId, {
            status: 'PROCESSING',
        });
        const profile = await this.repository.findProfileByUserId(userId);
        if (!profile)
            throw new Error('Artha Profile not found');
        let readinessIndex = profile.readinessIndex;
        try {
            readinessIndex = await this.calculateReadiness(userId, tier, inputData);
            this.logger.log(`Readiness calculated: ${readinessIndex}`);
        }
        catch (err) {
            this.logger.error('ML Readiness calculation failed in background', err);
        }
        let feedback = null;
        try {
            feedback = await this.generateAiFeedback(tier, inputData);
            if (feedback) {
                await this.repository.saveFeedback(profile.id, tier, feedback);
                this.logger.log('AI Feedback saved');
            }
        }
        catch (err) {
            this.logger.error('AI Feedback generation failed in background', err);
        }
        await this.repository.completeAssessment(assessmentId, {
            status: 'COMPLETED',
            readinessIndex,
        });
        this.logger.log(`Artha analysis completed for assessment ${assessmentId}`);
    }
    async calculateReadiness(userId, tier, currentData) {
        const response = await fetch(`${this.ML_SERVICE_URL}/readiness/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentData),
            signal: AbortSignal.timeout(15000),
        });
        if (response.ok) {
            const result = (await response.json());
            const readinessIndex = Math.round(result.readinessIndex);
            await this.repository.updateProfileReadiness(userId, readinessIndex);
            return readinessIndex;
        }
        throw new Error(`ML Service failed with status ${response.status}`);
    }
    async generateAiFeedback(tier, data) {
        const response = await fetch(`${this.AI_SERVICE_URL}/ai/intelligence`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tier, data }),
            signal: AbortSignal.timeout(90000),
        });
        if (response.ok) {
            return (await response.json());
        }
        throw new Error(`AI Service failed with status ${response.status}`);
    }
};
exports.ArthaProcessor = ArthaProcessor;
exports.ArthaProcessor = ArthaProcessor = ArthaProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('artha'),
    __metadata("design:paramtypes", [artha_repository_1.ArthaRepository,
        config_1.ConfigService])
], ArthaProcessor);
//# sourceMappingURL=artha.processor.js.map