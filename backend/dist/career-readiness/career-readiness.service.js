"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CareerReadinessService", {
    enumerable: true,
    get: function() {
        return CareerReadinessService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CareerReadinessService = class CareerReadinessService {
    async saveResult(data) {
        const testId = Number(data.testId);
        if (isNaN(testId)) {
            throw new Error(`Invalid testId: ${data.testId}`);
        }
        this.logger.log(`Saving career readiness result for user ${data.otrId}, test ${testId}`);
        // Fetch the test with questions and subjects
        const test = await this.prisma.test.findUnique({
            where: {
                id: testId
            },
            include: {
                questions: {
                    include: {
                        subject: true
                    }
                }
            }
        });
        if (!test) {
            this.logger.error(`Test ${testId} not found`);
            throw new _common.NotFoundException(`Test with ID ${testId} not found`);
        }
        // Calculate subject-wise scores with +1 correct, -0.25 wrong
        const subjectBreakdown = {};
        let correctAnswers = 0;
        let wrongAnswers = 0;
        test.questions.forEach((q)=>{
            const subjectName = q.subject?.name || 'General';
            if (!subjectBreakdown[subjectName]) {
                subjectBreakdown[subjectName] = {
                    correct: 0,
                    wrong: 0,
                    unanswered: 0,
                    total: 0,
                    score: 0
                };
            }
            subjectBreakdown[subjectName].total++;
            const userAns = data.answers.find((a)=>Number(a.questionId) === q.id);
            if (userAns) {
                if (userAns.selectedOption === q.answer) {
                    correctAnswers++;
                    subjectBreakdown[subjectName].correct++;
                    subjectBreakdown[subjectName].score += 1;
                } else {
                    wrongAnswers++;
                    subjectBreakdown[subjectName].wrong++;
                    subjectBreakdown[subjectName].score -= 0.25;
                }
            } else {
                subjectBreakdown[subjectName].unanswered++;
            }
        });
        const totalMarks = test.questions.length;
        const negativeMarks = wrongAnswers * 0.25;
        const totalScore = correctAnswers - negativeMarks;
        // Safer check-then-act approach to avoid Prisma upsert naming issues
        try {
            this.logger.log(`Searching for existing score: otrId=${data.otrId}, testId=${testId}`);
            const existing = await this.prisma.careerReadinessTestScore.findFirst({
                where: {
                    otrId: data.otrId,
                    testId: testId
                }
            });
            const scoreData = {
                totalScore,
                totalMarks,
                correctAnswers,
                wrongAnswers,
                negativeMarks,
                subjectBreakdown: subjectBreakdown
            };
            if (existing) {
                this.logger.log(`EXISTING RECORD FOUND (id=${existing.id}). Updating...`);
                return await this.prisma.careerReadinessTestScore.update({
                    where: {
                        id: existing.id
                    },
                    data: scoreData
                });
            } else {
                this.logger.log(`NO EXISTING RECORD FOUND. Creating new record...`);
                return await this.prisma.careerReadinessTestScore.create({
                    data: {
                        otrId: data.otrId,
                        testId: testId,
                        ...scoreData
                    }
                });
            }
        } catch (error) {
            this.logger.error('CRITICAL ERROR in saveResult:', error.message);
            this.logger.error('Error Stack:', error.stack);
            throw error;
        }
    }
    async getByOtrId(otrId) {
        return this.prisma.careerReadinessTestScore.findFirst({
            where: {
                otrId
            },
            include: {
                test: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(CareerReadinessService.name);
    }
};
CareerReadinessService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], CareerReadinessService);

//# sourceMappingURL=career-readiness.service.js.map