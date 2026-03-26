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
var CareerReadinessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerReadinessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CareerReadinessService = CareerReadinessService_1 = class CareerReadinessService {
    prisma;
    logger = new common_1.Logger(CareerReadinessService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveResult(data) {
        const testId = Number(data.testId);
        if (isNaN(testId)) {
            throw new Error(`Invalid testId: ${data.testId}`);
        }
        this.logger.log(`Saving career readiness result for user ${data.otrId}, test ${testId}`);
        const test = await this.prisma.test.findUnique({
            where: { id: testId },
            include: {
                questions: {
                    include: { subject: true },
                },
            },
        });
        if (!test) {
            this.logger.error(`Test ${testId} not found`);
            throw new common_1.NotFoundException(`Test with ID ${testId} not found`);
        }
        const subjectBreakdown = {};
        let correctAnswers = 0;
        let wrongAnswers = 0;
        test.questions.forEach((q) => {
            const subjectName = q.subject?.name || 'General';
            if (!subjectBreakdown[subjectName]) {
                subjectBreakdown[subjectName] = { correct: 0, wrong: 0, unanswered: 0, total: 0, score: 0 };
            }
            subjectBreakdown[subjectName].total++;
            const userAns = data.answers.find((a) => Number(a.questionId) === q.id);
            if (userAns) {
                if (userAns.selectedOption === q.answer) {
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
        const totalMarks = test.questions.length;
        const negativeMarks = wrongAnswers * 0.25;
        const totalScore = correctAnswers - negativeMarks;
        try {
            this.logger.log(`Searching for existing score: otrId=${data.otrId}, testId=${testId}`);
            const existing = await this.prisma.careerReadinessTestScore.findFirst({
                where: {
                    otrId: data.otrId,
                    testId: testId,
                },
            });
            const scoreData = {
                totalScore,
                totalMarks,
                correctAnswers,
                wrongAnswers,
                negativeMarks,
                subjectBreakdown: subjectBreakdown,
            };
            if (existing) {
                this.logger.log(`EXISTING RECORD FOUND (id=${existing.id}). Updating...`);
                return await this.prisma.careerReadinessTestScore.update({
                    where: { id: existing.id },
                    data: scoreData,
                });
            }
            else {
                this.logger.log(`NO EXISTING RECORD FOUND. Creating new record...`);
                return await this.prisma.careerReadinessTestScore.create({
                    data: {
                        otrId: data.otrId,
                        testId: testId,
                        ...scoreData,
                    },
                });
            }
        }
        catch (error) {
            this.logger.error('CRITICAL ERROR in saveResult:', error.message);
            this.logger.error('Error Stack:', error.stack);
            throw error;
        }
    }
    async getByOtrId(otrId) {
        return this.prisma.careerReadinessTestScore.findFirst({
            where: { otrId },
            include: { test: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.CareerReadinessService = CareerReadinessService;
exports.CareerReadinessService = CareerReadinessService = CareerReadinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CareerReadinessService);
//# sourceMappingURL=career-readiness.service.js.map