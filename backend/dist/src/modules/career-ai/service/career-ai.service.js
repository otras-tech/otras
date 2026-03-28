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
var CareerAIService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerAIService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let CareerAIService = CareerAIService_1 = class CareerAIService {
    careerAIQueue;
    logger = new common_1.Logger(CareerAIService_1.name);
    constructor(careerAIQueue) {
        this.careerAIQueue = careerAIQueue;
    }
    async generateRoadmap(dto) {
        this.logger.log(`CareerAI: Enqueuing Roadmap Generation Job for User ${dto.userId}`);
        const job = await this.careerAIQueue.add('generate-roadmap', dto, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        });
        this.logger.log(`CareerAI: Job ${job.id} created successfully`);
        return {
            jobId: job.id,
            message: "AI Roadmap generation started as a background process. Please check back in a few moments."
        };
    }
    async getJobStatus(jobId) {
        const job = await this.careerAIQueue.getJob(jobId);
        if (!job)
            return { status: 'not_found' };
        const status = await job.getState();
        return {
            id: job.id,
            status: status,
            result: job.returnvalue,
            progress: job.progress,
            failedReason: job.failedReason
        };
    }
};
exports.CareerAIService = CareerAIService;
exports.CareerAIService = CareerAIService = CareerAIService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('career-ai')),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], CareerAIService);
//# sourceMappingURL=career-ai.service.js.map