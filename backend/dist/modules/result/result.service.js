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
var ResultService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultService = void 0;
const common_1 = require("@nestjs/common");
const result_repository_1 = require("./repository/result.repository");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const result_processor_1 = require("./result.processor");
let ResultService = ResultService_1 = class ResultService {
    resultQueue;
    resultRepository;
    resultProcessor;
    logger = new common_1.Logger(ResultService_1.name);
    constructor(resultQueue, resultRepository, resultProcessor) {
        this.resultQueue = resultQueue;
        this.resultRepository = resultRepository;
        this.resultProcessor = resultProcessor;
    }
    async startTest(requesterId, userId, testId, tier) {
        if (requesterId !== userId) {
            throw new common_1.ForbiddenException('Cannot start test for another user');
        }
        try {
            return await this.resultRepository.createPlaceholder(userId, testId, tier);
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to start test');
        }
    }
    async calculateAndSave(requesterId, dto) {
        if (requesterId !== dto.userId) {
            throw new common_1.ForbiddenException('Cannot submit test for another user');
        }
        const { userId, testId, answers, tier, resultId } = dto;
        try {
            let finalResultId = resultId;
            if (!finalResultId) {
                const placeholder = await this.resultRepository.createPlaceholder(userId, testId, tier);
                finalResultId = placeholder.id;
            }
            if (process.env.DISABLE_REDIS === 'true') {
                this.logger.log(`Processing result sync for User: ${userId}, Result ID: ${finalResultId}`);
                await this.resultProcessor.calculateAndSave({ ...dto, resultId: finalResultId });
                return {
                    message: 'Result processed synchronously (Redis disabled).',
                    resultId: finalResultId,
                };
            }
            await this.resultQueue.add('processResult', { ...dto, resultId: finalResultId }, {
                jobId: `result_${finalResultId}`,
                attempts: 5,
                backoff: { type: 'exponential', delay: 2000 },
                removeOnComplete: { count: 100 },
                removeOnFail: { count: 1000 },
            });
            this.logger.log(`Result submission queued for User: ${userId}, Result ID: ${finalResultId}`);
            return {
                message: 'Your submission is being processed. Results will be available shortly.',
                resultId: finalResultId,
            };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException)
                throw error;
            this.logger.error(`Error processing result: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error processing test submission');
        }
    }
    async getUserResults(userId, cursor, take) {
        try {
            return await this.resultRepository.findByUserId(userId, cursor, take);
        }
        catch {
            throw new common_1.InternalServerErrorException('Could not fetch results');
        }
    }
    async checkOwnership(resultId, userId) {
        return this.resultRepository.checkOwnership(resultId, userId);
    }
};
exports.ResultService = ResultService;
exports.ResultService = ResultService = ResultService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('result-calculation')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        result_repository_1.ResultRepository,
        result_processor_1.ResultProcessor])
], ResultService);
//# sourceMappingURL=result.service.js.map