"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MockTestService", {
    enumerable: true,
    get: function() {
        return MockTestService;
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
let MockTestService = class MockTestService {
    async findAll(categoryId) {
        return this.prisma.mockTest.findMany({
            where: categoryId ? {
                categoryId
            } : undefined,
            include: {
                category: true
            },
            take: 50
        });
    }
    async findOne(id) {
        return this.prisma.mockTest.findUnique({
            where: {
                id
            },
            include: {
                category: true
            }
        });
    }
    async startAttempt(otrId, mockTestOrTestId) {
        const user = await this.prisma.user.findUnique({
            where: {
                otrId
            }
        });
        if (!user) throw new _common.NotFoundException('User with this OTR ID not found');
        // 1. Try to find a direct MockTest
        let mockTest = await this.prisma.mockTest.findUnique({
            where: {
                id: mockTestOrTestId
            }
        });
        // 2. If not found, it might be a Test ID from an Exam
        if (!mockTest) {
            const test = await this.prisma.test.findUnique({
                where: {
                    id: mockTestOrTestId
                }
            });
            if (test) {
                // Find or create "Official Assessment" MockTest for this exam
                const categoryName = 'Official Assessment';
                let category = await this.prisma.mockTestCategory.findUnique({
                    where: {
                        name: categoryName
                    }
                });
                if (!category) {
                    category = await this.prisma.mockTestCategory.create({
                        data: {
                            name: categoryName
                        }
                    });
                }
                mockTest = await this.prisma.mockTest.findFirst({
                    where: {
                        examId: test.examId,
                        categoryId: category.id
                    }
                });
                if (!mockTest) {
                    const exam = await this.prisma.exam.findUnique({
                        where: {
                            id: test.examId
                        }
                    });
                    mockTest = await this.prisma.mockTest.create({
                        data: {
                            title: `${exam?.name || 'Exam'} - Official Assessment`,
                            duration: 60,
                            sectionType: 'Full Length',
                            categoryId: category.id,
                            examId: test.examId
                        }
                    });
                }
            }
        }
        if (!mockTest) throw new _common.NotFoundException('MockTest or Test not found');
        return this.prisma.mockTestAttempt.create({
            data: {
                otrId,
                mockTestId: mockTest.id,
                score: 0,
                totalMarks: 0,
                startTime: new Date()
            }
        });
    }
    async submitAttempt(dto) {
        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: {
                otrId: dto.otrId
            }
        });
        if (!user) throw new _common.NotFoundException('User with this OTR ID not found');
        return this.prisma.mockTestAttempt.create({
            data: {
                otrId: dto.otrId,
                mockTestId: dto.mockTestId,
                score: dto.score,
                totalMarks: dto.totalMarks
            }
        });
    }
    async getRecentAttempt(otrId) {
        return this.prisma.mockTestAttempt.findFirst({
            where: {
                otrId
            },
            orderBy: {
                attemptedAt: 'desc'
            },
            include: {
                mockTest: {
                    include: {
                        category: true
                    }
                }
            }
        });
    }
    async calculateRank(mockTestId, otrId) {
        const userAttempt = await this.prisma.mockTestAttempt.findFirst({
            where: {
                mockTestId,
                otrId
            },
            orderBy: {
                score: 'desc'
            }
        });
        if (!userAttempt) {
            const total = await this.prisma.mockTestAttempt.count({
                where: {
                    mockTestId
                }
            });
            return {
                msg: 'User has not attempted this test yet',
                total
            };
        }
        const betterAttemptsCount = await this.prisma.mockTestAttempt.count({
            where: {
                mockTestId,
                OR: [
                    {
                        score: {
                            gt: userAttempt.score
                        }
                    },
                    {
                        score: userAttempt.score,
                        attemptedAt: {
                            lt: userAttempt.attemptedAt
                        }
                    }
                ]
            }
        });
        const total = await this.prisma.mockTestAttempt.count({
            where: {
                mockTestId
            }
        });
        const rank = betterAttemptsCount + 1;
        const percentile = total > 1 ? (total - rank) / total * 100 : 100;
        const topPercentage = rank / total * 100;
        return {
            rank,
            total,
            topPercentage: Math.ceil(topPercentage),
            percentile: Math.round(percentile * 10) / 10
        };
    }
    async submitExamAttempt(dto) {
        this.logger.log(`Antigravity Debug - submitExamAttempt called with: ${JSON.stringify(dto)}`);
        // 1. Ensure user exists
        const user = await this.prisma.user.findUnique({
            where: {
                otrId: dto.otrId
            }
        });
        if (!user) throw new _common.NotFoundException('User with this OTR ID not found');
        // 2. Ensure "Official Assessment" category exists
        const categoryName = 'Official Assessment';
        let category = await this.prisma.mockTestCategory.findUnique({
            where: {
                name: categoryName
            }
        });
        if (!category) {
            category = await this.prisma.mockTestCategory.create({
                data: {
                    name: categoryName
                }
            });
        }
        // 3. Ensure a MockTest record exists for this exam
        let mockTest = await this.prisma.mockTest.findFirst({
            where: {
                examId: dto.examId,
                categoryId: category.id
            }
        });
        if (!mockTest) {
            const exam = await this.prisma.exam.findUnique({
                where: {
                    id: dto.examId
                }
            });
            mockTest = await this.prisma.mockTest.create({
                data: {
                    title: `${exam?.name || 'Exam'} - Official Assessment`,
                    duration: 60,
                    sectionType: 'Full Length',
                    categoryId: category.id,
                    examId: dto.examId
                }
            });
        }
        // 4. Create or update the attempt
        if (dto.attemptId) {
            return this.prisma.mockTestAttempt.update({
                where: {
                    id: dto.attemptId
                },
                data: {
                    score: dto.score,
                    totalMarks: dto.totalMarks,
                    correctAnswers: dto.correctAnswers ?? null,
                    subjectBreakdown: dto.subjectBreakdown ?? undefined,
                    submitTime: new Date()
                }
            });
        }
        return this.prisma.mockTestAttempt.create({
            data: {
                otrId: dto.otrId,
                mockTestId: mockTest.id,
                score: dto.score,
                totalMarks: dto.totalMarks,
                correctAnswers: dto.correctAnswers ?? null,
                subjectBreakdown: dto.subjectBreakdown ?? undefined,
                startTime: new Date(),
                submitTime: new Date()
            }
        });
    }
    async getUserMockAttempts(otrId) {
        // Only return SUBMITTED attempts (submitTime is set at submission)
        // score > 0 is an additional safety net for tests that didn't answer any questions
        const attempts = await this.prisma.mockTestAttempt.findMany({
            where: {
                otrId,
                OR: [
                    {
                        submitTime: {
                            not: null
                        }
                    },
                    {
                        score: {
                            gt: 0
                        }
                    }
                ]
            },
            include: {
                mockTest: true
            },
            orderBy: {
                attemptedAt: 'desc'
            },
            take: 30
        });
        this.logger.log(`getUserMockAttempts: Found ${attempts.length} submitted attempts for ${otrId}`);
        return attempts;
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(MockTestService.name);
    }
};
MockTestService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], MockTestService);

//# sourceMappingURL=mock-test.service.js.map