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
const prisma_service_1 = require("../../database/prisma.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const result_processor_1 = require("./result.processor");
let ResultService = ResultService_1 = class ResultService {
    resultQueue;
    prisma;
    resultProcessor;
    logger = new common_1.Logger(ResultService_1.name);
    constructor(resultQueue, prisma, resultProcessor) {
        this.resultQueue = resultQueue;
        this.prisma = prisma;
        this.resultProcessor = resultProcessor;
    }
    async startTest(userId, testId, tier) {
        try {
            return await this.prisma.result.create({
                data: {
                    userId,
                    testId,
                    tier,
                    startTime: new Date(),
                    score: 0,
                    subjectBreakdown: {},
                },
                select: { id: true, startTime: true },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to start test');
        }
    }
    async calculateAndSave(dto) {
        const { userId, testId, answers, tier, resultId } = dto;
        try {
            let finalResultId = resultId;
            if (!finalResultId) {
                const placeholder = await this.prisma.result.create({
                    data: {
                        userId,
                        testId,
                        tier,
                        score: 0,
                        subjectBreakdown: {},
                        startTime: new Date(),
                    },
                    select: { id: true },
                });
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
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: true
            });
            this.logger.log(`Result submission queued for User: ${userId}, Result ID: ${finalResultId}`);
            return {
                message: 'Your submission is being processed. Results will be available shortly.',
                resultId: finalResultId,
            };
        }
        catch (error) {
            this.logger.error(`Error processing result: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error processing test submission');
        }
    }
    async getUserResults(userId, cursor) {
        try {
            return await this.prisma.result.findMany({
                where: { userId, isDeleted: false },
                take: 20,
                skip: cursor ? 1 : 0,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    score: true,
                    submitTime: true,
                    subjectBreakdown: true,
                    createdAt: true,
                    test: {
                        select: {
                            name: true,
                            _count: { select: { questions: true } },
                        },
                    },
                },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Could not fetch results');
        }
    }
    async checkOwnership(resultId, userId) {
        const result = await this.prisma.result.findUnique({
            where: { id: resultId },
            select: { userId: true },
        });
        return result?.userId === userId;
    }
};
exports.ResultService = ResultService;
exports.ResultService = ResultService = ResultService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('result-calculation')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        prisma_service_1.PrismaService,
        result_processor_1.ResultProcessor])
], ResultService);
//# sourceMappingURL=result.service.js.map