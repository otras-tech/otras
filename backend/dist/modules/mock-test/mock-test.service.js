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
var MockTestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockTestService = void 0;
const common_1 = require("@nestjs/common");
const mock_test_repository_1 = require("./repository/mock-test.repository");
const cache_service_1 = require("../../common/cache/cache.service");
const redis_service_1 = require("../../common/redis/redis.service");
let MockTestService = MockTestService_1 = class MockTestService {
    mockTestRepository;
    cacheService;
    redisService;
    logger = new common_1.Logger(MockTestService_1.name);
    constructor(mockTestRepository, cacheService, redisService) {
        this.mockTestRepository = mockTestRepository;
        this.cacheService = cacheService;
        this.redisService = redisService;
    }
    async findAll(categoryId, cursor, take) {
        const safeTake = Math.min(take || 20, 100);
        const cacheKey = cache_service_1.CacheService.buildKey('mock_tests', {
            categoryId,
            cursor,
            take: safeTake,
        });
        if (cacheKey) {
            try {
                const cached = await this.cacheService.get(cacheKey);
                if (cached)
                    return cached;
            }
            catch (err) { }
        }
        try {
            const results = await this.mockTestRepository.findAll(categoryId, cursor, safeTake);
            if (cacheKey) {
                await this.cacheService.set(cacheKey, results, 600000);
            }
            return results;
        }
        catch (error) {
            this.logger.error(`FindAll error: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error fetching mock tests');
        }
    }
    async findOne(id) {
        const cacheKey = `mock_test_id_${id}`;
        try {
            const cached = await this.cacheService.get(cacheKey);
            if (cached)
                return cached;
        }
        catch (err) { }
        const mockTest = await this.mockTestRepository.findById(id);
        if (!mockTest)
            throw new common_1.NotFoundException('Mock test not found');
        await this.cacheService.set(cacheKey, mockTest, 3600000);
        return mockTest;
    }
    async startAttempt(requesterOtrId, dto) {
        const { otrId, mockTestOrTestId } = dto;
        if (requesterOtrId !== otrId) {
            throw new common_1.ForbiddenException('Cannot start attempt for another user');
        }
        try {
            return await this.mockTestRepository.$transaction(async (tx) => {
                const user = await tx.user.findFirst({
                    where: { otrId, isDeleted: false },
                    select: { id: true },
                });
                if (!user)
                    throw new common_1.NotFoundException('User not found');
                const mockTestId = await this.resolveMockTestId(tx, mockTestOrTestId);
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
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException)
                throw error;
            this.logger.error(`StartAttempt error: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error starting attempt');
        }
    }
    async submitAttempt(requesterOtrId, dto) {
        if (requesterOtrId !== dto.otrId) {
            throw new common_1.ForbiddenException('Cannot submit for another user');
        }
        try {
            return await this.mockTestRepository.$transaction(async (tx) => {
                const attemptData = {
                    score: dto.score,
                    totalMarks: dto.totalMarks,
                    submitTime: new Date(),
                };
                if (dto.attemptId) {
                    const existing = await tx.mockTestAttempt.findFirst({
                        where: { id: dto.attemptId, isDeleted: false },
                        select: { otrId: true },
                    });
                    if (!existing)
                        throw new common_1.NotFoundException('Attempt not found');
                    if (existing.otrId !== dto.otrId)
                        throw new common_1.ForbiddenException("Cannot update another user's attempt");
                    const result = await tx.mockTestAttempt.update({
                        where: { id: dto.attemptId },
                        data: attemptData,
                        select: { id: true, score: true, otrId: true, mockTestId: true },
                    });
                    this.syncToLeaderboard(result.mockTestId, result.otrId, result.score);
                    return result;
                }
                const user = await tx.user.findFirst({
                    where: { otrId: dto.otrId, isDeleted: false },
                    select: { id: true },
                });
                if (!user)
                    throw new common_1.NotFoundException('User not found');
                const mockTestId = await this.resolveMockTestId(tx, dto.mockTestId);
                const result = await tx.mockTestAttempt.create({
                    data: {
                        otrId: dto.otrId,
                        mockTestId,
                        ...attemptData,
                    },
                    select: { id: true, score: true, otrId: true, mockTestId: true },
                });
                this.syncToLeaderboard(result.mockTestId, result.otrId, result.score);
                return result;
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException)
                throw error;
            this.logger.error(`Submission error: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error submitting attempt');
        }
    }
    async calculateRank(requesterOtrId, mockTestId, otrId) {
        if (requesterOtrId !== otrId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        try {
            const rankKey = `ranks:mockTest:${mockTestId}`;
            const [redisRank, redisTotal] = await Promise.all([
                this.redisService.zRevRank(rankKey, otrId),
                this.redisService.zCard(rankKey),
            ]);
            if (redisRank !== null) {
                const percentile = redisTotal > 1 ? ((redisTotal - redisRank) / redisTotal) * 100 : 100;
                return {
                    rank: redisRank + 1,
                    total: redisTotal,
                    topPercentage: Math.ceil(((redisRank + 1) / redisTotal) * 100),
                    percentile: Math.round(percentile * 10) / 10,
                    source: 'cache',
                };
            }
            const userAttempt = await this.mockTestRepository.findBestAttempt(mockTestId, otrId);
            if (!userAttempt) {
                const total = await this.mockTestRepository.countAttempts(mockTestId);
                return { msg: 'User has not attempted this test yet', total };
            }
            const betterAttemptsCount = await this.mockTestRepository.countBetterAttempts(mockTestId, userAttempt.score, userAttempt.attemptedAt);
            const total = await this.mockTestRepository.countAttempts(mockTestId);
            const rank = betterAttemptsCount + 1;
            const percentile = total > 1 ? ((total - rank) / total) * 100 : 100;
            this.syncToLeaderboard(mockTestId, otrId, userAttempt.score);
            return {
                rank,
                total,
                topPercentage: Math.ceil((rank / total) * 100),
                percentile: Math.round(percentile * 10) / 10,
                source: 'db',
            };
        }
        catch (error) {
            this.logger.error(`Rank error: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error calculating rank');
        }
    }
    async submitExamAttempt(requesterOtrId, dto) {
        if (requesterOtrId !== dto.otrId) {
            throw new common_1.ForbiddenException('Cannot submit for another user');
        }
        try {
            return await this.mockTestRepository.$transaction(async (tx) => {
                const user = await tx.user.findFirst({
                    where: { otrId: dto.otrId, isDeleted: false },
                    select: { id: true },
                });
                if (!user)
                    throw new common_1.NotFoundException('User not found');
                const mockTest = await this.getOrCreateOfficialMockTest(tx, dto.examId);
                const attemptData = {
                    score: dto.score,
                    totalMarks: dto.totalMarks,
                    correctAnswers: dto.correctAnswers ?? null,
                    subjectBreakdown: dto.subjectBreakdown ?? {},
                    submitTime: new Date(),
                };
                if (dto.attemptId) {
                    const result = await tx.mockTestAttempt.update({
                        where: { id: dto.attemptId },
                        data: attemptData,
                        select: { id: true, score: true, otrId: true, mockTestId: true },
                    });
                    this.syncToLeaderboard(result.mockTestId, result.otrId, result.score);
                    return result;
                }
                const result = await tx.mockTestAttempt.create({
                    data: {
                        otrId: dto.otrId,
                        mockTestId: mockTest.id,
                        startTime: new Date(),
                        ...attemptData,
                    },
                    select: { id: true, score: true, otrId: true, mockTestId: true },
                });
                this.syncToLeaderboard(result.mockTestId, result.otrId, result.score);
                return result;
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException)
                throw error;
            this.logger.error(`Exam submission error: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error processing exam attempt');
        }
    }
    async getUserMockAttempts(requesterOtrId, otrId, cursor) {
        if (requesterOtrId !== otrId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        try {
            return await this.mockTestRepository.getUserMockAttempts(otrId, cursor);
        }
        catch (error) {
            this.logger.error(`GetUserAttempts error: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error fetching user attempts');
        }
    }
    async resolveMockTestId(tx, id) {
        const mockTest = await tx.mockTest.findFirst({
            where: { id, isDeleted: false },
            select: { id: true },
        });
        if (mockTest)
            return mockTest.id;
        const test = await tx.test.findFirst({
            where: { id, isDeleted: false },
            select: { examId: true },
        });
        if (test) {
            const official = await this.getOrCreateOfficialMockTest(tx, test.examId);
            return official.id;
        }
        throw new common_1.NotFoundException('Target test resource not found');
    }
    async getOrCreateOfficialMockTest(tx, examId) {
        const categoryName = 'Official Assessment';
        const category = await tx.mockTestCategory.upsert({
            where: { name: categoryName },
            update: { isDeleted: false },
            create: { name: categoryName },
            select: { id: true },
        });
        let mockTest = await tx.mockTest.findFirst({
            where: { examId, categoryId: category.id, isDeleted: false },
            select: { id: true },
        });
        if (!mockTest) {
            const exam = await tx.exam.findFirst({
                where: { id: examId, isDeleted: false },
                select: { name: true },
            });
            if (!exam)
                throw new common_1.NotFoundException(`Active exam with ID ${examId} not found`);
            mockTest = await tx.mockTest.create({
                data: {
                    title: `${exam.name} - Official Assessment`,
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
    async syncToLeaderboard(mockTestId, otrId, score) {
        const rankKey = `ranks:mockTest:${mockTestId}`;
        try {
            await this.redisService.zAdd(rankKey, score, otrId);
        }
        catch (err) {
            this.logger.error(`Failed to sync leaderboard for test ${mockTestId}: ${err.message}`);
        }
    }
};
exports.MockTestService = MockTestService;
exports.MockTestService = MockTestService = MockTestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mock_test_repository_1.MockTestRepository,
        cache_service_1.CacheService,
        redis_service_1.RedisService])
], MockTestService);
//# sourceMappingURL=mock-test.service.js.map