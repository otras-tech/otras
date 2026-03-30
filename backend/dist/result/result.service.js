"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResultService", {
    enumerable: true,
    get: function() {
        return ResultService;
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
let ResultService = class ResultService {
    async startTest(userId, testId, tier) {
        return this.prisma.result.create({
            data: {
                userId,
                testId,
                tier,
                startTime: new Date(),
                score: 0,
                subjectBreakdown: {}
            }
        });
    }
    async calculateAndSave(userId, testId, answers, tier, resultId) {
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
            throw new _common.NotFoundException('Test not found');
        }
        let correctAnswers = 0;
        let wrongAnswers = 0;
        const subjectBreakdown = {};
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
            const userAns = answers.find((a)=>a.questionId === q.id);
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
        const totalScore = correctAnswers - wrongAnswers * 0.25;
        let result;
        if (resultId) {
            result = await this.prisma.result.update({
                where: {
                    id: resultId
                },
                data: {
                    score: totalScore,
                    subjectBreakdown: subjectBreakdown,
                    submitTime: new Date()
                },
                include: {
                    test: true
                }
            });
        } else {
            // Fallback for direct submission without start
            result = await this.prisma.result.create({
                data: {
                    userId,
                    testId,
                    tier,
                    score: totalScore,
                    subjectBreakdown: subjectBreakdown,
                    startTime: new Date(),
                    submitTime: new Date()
                },
                include: {
                    test: true
                }
            });
        }
        const newResult = result;
        // Update ARTHA Engine progress if tier is specified
        if (tier === 2 || tier === 3) {
            const profile = await this.prisma.arthaProfile.findFirst({
                where: {
                    userId: userId.toString()
                }
            });
            if (profile) {
                await this.prisma.arthaProfile.update({
                    where: {
                        id: profile.id
                    },
                    data: {
                        [`tier${tier}Progress`]: 100
                    }
                });
            }
        }
        return newResult;
    }
    async getUserResults(userId) {
        return this.prisma.result.findMany({
            where: {
                userId
            },
            include: {
                test: {
                    include: {
                        _count: {
                            select: {
                                questions: true
                            }
                        }
                    }
                }
            },
            take: 20,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
ResultService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], ResultService);

//# sourceMappingURL=result.service.js.map