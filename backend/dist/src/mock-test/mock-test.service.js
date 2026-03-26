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
var MockTestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockTestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_manager_1 = require("@nestjs/cache-manager");
let MockTestService = MockTestService_1 = class MockTestService {
    prisma;
    cacheManager;
    logger = new common_1.Logger(MockTestService_1.name);
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    async findAll(categoryId, cursor) {
        const cacheKey = `mock_tests_cat_${categoryId || 'all'}_cur_${cursor || 'start'}`;
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                this.logger.log(`Cache Hit: ${cacheKey}`);
                return cached;
            }
        }
        catch (err) {
            this.logger.error(`Redis error (findAll): ${err.message}`);
        }
        try {
            const results = await this.prisma.mockTest.findMany({
                where: {
                    categoryId: categoryId || undefined,
                    isDeleted: false,
                },
                select: {
                    id: true,
                    title: true,
                    duration: true,
                    category: { select: { name: true } },
                },
                take: 20,
                skip: cursor ? 1 : 0,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: { createdAt: 'desc' },
            });
            await this.cacheManager.set(cacheKey, results, 600000);
            return results;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching mock tests');
        }
    }
    async findOne(id) {
        const cacheKey = `mock_test_id_${id}`;
        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached)
                return cached;
        }
        catch (err) { }
        const mockTest = await this.prisma.mockTest.findUnique({
            where: { id, isDeleted: false },
            select: {
                id: true,
                title: true,
                duration: true,
                category: { select: { name: true } },
                exam: { select: { name: true } },
            },
        });
        if (!mockTest)
            throw new common_1.NotFoundException('Mock test not found');
        await this.cacheManager.set(cacheKey, mockTest, 3600000);
        return mockTest;
    }
    async startAttempt(dto) {
        const { otrId, mockTestOrTestId } = dto;
        try {
            return await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.findUnique({
                    where: { otrId },
                    select: { id: true },
                });
                if (!user)
                    throw new common_1.NotFoundException('User not found');
                let mockTestId = await this.resolveMockTestId(tx, mockTestOrTestId);
                return await tx.mockTestAttempt.create({
                    data: {
                        otrId,
                        mockTestId,
                        score: 0,
                        totalMarks: 0,
                        startTime: new Date(),
                    },
                    select: { id: true, startTime: true },
                });
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error starting attempt');
        }
    }
    async submitAttempt(dto) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const attemptData = {
                    score: dto.score,
                    totalMarks: dto.totalMarks,
                    submitTime: new Date(),
                };
                if (dto.attemptId) {
                    const existing = await tx.mockTestAttempt.findUnique({
                        where: { id: dto.attemptId },
                        select: { otrId: true }
                    });
                    if (!existing)
                        throw new common_1.NotFoundException('Attempt not found');
                    if (existing.otrId !== dto.otrId)
                        throw new common_1.ForbiddenException('Cannot update another user\'s attempt');
                    return await tx.mockTestAttempt.update({
                        where: { id: dto.attemptId },
                        data: attemptData,
                        select: { id: true, score: true },
                    });
                }
                const user = await tx.user.findUnique({
                    where: { otrId: dto.otrId },
                    select: { id: true },
                });
                if (!user)
                    throw new common_1.NotFoundException('User not found');
                const mockTestId = await this.resolveMockTestId(tx, dto.mockTestId);
                return await tx.mockTestAttempt.create({
                    data: {
                        otrId: dto.otrId,
                        mockTestId,
                        ...attemptData,
                    },
                    select: { id: true, score: true },
                });
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException)
                throw error;
            this.logger.error(`Submission error: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error submitting attempt');
        }
    }
    async calculateRank(mockTestId, otrId) {
        try {
            const userAttempt = await this.prisma.mockTestAttempt.findFirst({
                where: { mockTestId, otrId, isDeleted: false },
                orderBy: { score: 'desc' },
                select: { score: true, attemptedAt: true },
            });
            if (!userAttempt) {
                const total = await this.prisma.mockTestAttempt.count({ where: { mockTestId, isDeleted: false } });
                return { msg: 'User has not attempted this test yet', total };
            }
            const betterAttemptsCount = await this.prisma.mockTestAttempt.count({
                where: {
                    mockTestId,
                    isDeleted: false,
                    OR: [
                        { score: { gt: userAttempt.score } },
                        {
                            score: userAttempt.score,
                            attemptedAt: { lt: userAttempt.attemptedAt },
                        },
                    ],
                },
            });
            const total = await this.prisma.mockTestAttempt.count({ where: { mockTestId, isDeleted: false } });
            const rank = betterAttemptsCount + 1;
            const percentile = total > 1 ? ((total - rank) / total) * 100 : 100;
            return {
                rank,
                total,
                topPercentage: Math.ceil((rank / total) * 100),
                percentile: Math.round(percentile * 10) / 10,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error calculating rank');
        }
    }
    async submitExamAttempt(dto) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.findUnique({
                    where: { otrId: dto.otrId },
                    select: { id: true },
                });
                if (!user)
                    throw new common_1.NotFoundException('User not found');
                const mockTest = await this.getOrCreateOfficialMockTest(tx, dto.examId);
                const attemptData = {
                    score: dto.score,
                    totalMarks: dto.totalMarks,
                    correctAnswers: dto.correctAnswers ?? null,
                    subjectBreakdown: dto.subjectBreakdown ?? undefined,
                    submitTime: new Date(),
                };
                if (dto.attemptId) {
                    return await tx.mockTestAttempt.update({
                        where: { id: dto.attemptId },
                        data: attemptData,
                        select: { id: true, score: true },
                    });
                }
                return await tx.mockTestAttempt.create({
                    data: {
                        otrId: dto.otrId,
                        mockTestId: mockTest.id,
                        startTime: new Date(),
                        ...attemptData,
                    },
                    select: { id: true, score: true },
                });
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error processing exam attempt');
        }
    }
    async resolveMockTestId(tx, id) {
        let mockTest = await tx.mockTest.findUnique({ where: { id, isDeleted: false }, select: { id: true } });
        if (mockTest)
            return mockTest.id;
        const test = await tx.test.findUnique({ where: { id, isDeleted: false }, select: { examId: true } });
        if (test) {
            const official = await this.getOrCreateOfficialMockTest(tx, test.examId);
            return official.id;
        }
        throw new common_1.NotFoundException('Target test resource not found');
    }
    async getOrCreateOfficialMockTest(tx, examId) {
        const categoryName = 'Official Assessment';
        let category = await tx.mockTestCategory.findUnique({ where: { name: categoryName }, select: { id: true } });
        if (!category) {
            category = await tx.mockTestCategory.create({ data: { name: categoryName }, select: { id: true } });
        }
        let mockTest = await tx.mockTest.findFirst({
            where: { examId, categoryId: category.id, isDeleted: false },
            select: { id: true },
        });
        if (!mockTest) {
            const exam = await tx.exam.findUnique({ where: { id: examId }, select: { name: true } });
            mockTest = await tx.mockTest.create({
                data: {
                    title: `${exam?.name || 'Exam'} - Official Assessment`,
                    duration: 60,
                    sectionType: 'Full Length',
                    categoryId: category.id,
                    examId,
                },
                select: { id: true },
            });
        }
        return mockTest;
    }
    async getUserMockAttempts(otrId, cursor) {
        try {
            return await this.prisma.mockTestAttempt.findMany({
                where: {
                    otrId,
                    isDeleted: false,
                    OR: [{ submitTime: { not: null } }, { score: { gt: 0 } }],
                },
                select: {
                    id: true,
                    score: true,
                    totalMarks: true,
                    correctAnswers: true,
                    subjectBreakdown: true,
                    attemptedAt: true,
                    mockTest: { select: { title: true } },
                },
                orderBy: { attemptedAt: 'desc' },
                take: 20,
                skip: cursor ? 1 : 0,
                cursor: cursor ? { id: cursor } : undefined,
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching user attempts');
        }
    }
};
exports.MockTestService = MockTestService;
exports.MockTestService = MockTestService = MockTestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], MockTestService);
//# sourceMappingURL=mock-test.service.js.map