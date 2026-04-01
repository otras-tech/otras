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
var ResultProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const prisma_service_1 = require("../../database/prisma.service");
const common_1 = require("@nestjs/common");
let ResultProcessor = ResultProcessor_1 = class ResultProcessor extends bullmq_1.WorkerHost {
    prisma;
    logger = new common_1.Logger(ResultProcessor_1.name);
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async process(job) {
        return this.calculateAndSave(job.data, job.id);
    }
    async calculateAndSave(data, jobId) {
        const { userId, testId, answers, tier, resultId } = data;
        this.logger.log(`Processing result for User: ${userId}, Test: ${testId}${jobId ? ` (Job: ${jobId})` : ' (Sync)'}`);
        try {
            const test = await this.prisma.test.findUnique({
                where: { id: testId, isDeleted: false },
                select: {
                    questions: {
                        select: {
                            id: true,
                            answer: true,
                            subject: { select: { name: true } },
                        },
                    },
                },
            });
            if (!test)
                throw new Error('Test not found');
            const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedOption]));
            let correctAnswers = 0;
            let wrongAnswers = 0;
            const subjectBreakdown = {};
            test.questions.forEach((q) => {
                const subjectName = q.subject?.name || 'General';
                subjectBreakdown[subjectName] = subjectBreakdown[subjectName] || {
                    correct: 0,
                    wrong: 0,
                    unanswered: 0,
                    total: 0,
                    score: 0,
                };
                subjectBreakdown[subjectName].total++;
                const userAns = answerMap.get(q.id);
                if (userAns !== undefined) {
                    if (userAns === q.answer) {
                        correctAnswers++;
                        subjectBreakdown[subjectName].correct++;
                        subjectBreakdown[subjectName].score += 1;
                    }
                    else {
                        wrongAnswers++;
                        subjectBreakdown[subjectName].wrong++;
                        subjectBreakdown[subjectName].score -= 0.25;
                    }
                }
                else {
                    subjectBreakdown[subjectName].unanswered++;
                }
            });
            const totalScore = correctAnswers - wrongAnswers * 0.25;
            await this.prisma.$transaction(async (tx) => {
                await tx.result.update({
                    where: { id: resultId },
                    data: {
                        score: totalScore,
                        subjectBreakdown: subjectBreakdown,
                        submitTime: new Date(),
                    },
                });
                if (tier === 2 || tier === 3) {
                    const profile = await tx.arthaProfile.findFirst({
                        where: { userId: userId.toString() },
                        select: { id: true },
                    });
                    if (profile) {
                        await tx.arthaProfile.update({
                            where: { id: profile.id },
                            data: { [`tier${tier}Progress`]: 100 },
                        });
                    }
                }
            });
            this.logger.log(`Successfully processed result${jobId ? ` for Job ID: ${jobId}` : ''}`);
        }
        catch (error) {
            this.logger.error(`Failed to process result: ${error.message}`);
            throw error;
        }
    }
};
exports.ResultProcessor = ResultProcessor;
exports.ResultProcessor = ResultProcessor = ResultProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('result-calculation'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResultProcessor);
//# sourceMappingURL=result.processor.js.map