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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockTestRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let MockTestRepository = class MockTestRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(categoryId, cursor, take) {
        const safeTake = Math.min(take || 20, 100);
        return this.prisma.mockTest.findMany({
            where: { categoryId: categoryId || undefined, isDeleted: false },
            select: {
                id: true,
                title: true,
                duration: true,
                category: { select: { name: true } },
            },
            take: safeTake,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.mockTest.findFirst({
            where: { id, isDeleted: false },
            select: {
                id: true,
                title: true,
                duration: true,
                category: { select: { name: true } },
                exam: { select: { name: true } },
            },
        });
    }
    async findAttemptById(id) {
        return this.prisma.mockTestAttempt.findFirst({
            where: { id, isDeleted: false },
            select: { otrId: true },
        });
    }
    async findUserByOtrId(otrId) {
        return this.prisma.user.findFirst({
            where: { otrId, isDeleted: false },
            select: { id: true },
        });
    }
    async findMockTestByIdActive(id) {
        return this.prisma.mockTest.findFirst({
            where: { id, isDeleted: false },
            select: { id: true },
        });
    }
    async findTestByIdActive(id) {
        return this.prisma.test.findFirst({
            where: { id, isDeleted: false },
            select: { examId: true },
        });
    }
    async findExamByIdActive(id) {
        return this.prisma.exam.findFirst({
            where: { id, isDeleted: false },
            select: { name: true },
        });
    }
    async findMockTestByExamAndCategory(examId, categoryId) {
        return this.prisma.mockTest.findFirst({
            where: { examId, categoryId, isDeleted: false },
            select: { id: true },
        });
    }
    async upsertCategory(name) {
        return this.prisma.mockTestCategory.upsert({
            where: { name },
            update: { isDeleted: false },
            create: { name },
            select: { id: true },
        });
    }
    async getUserMockAttempts(otrId, cursor) {
        return this.prisma.mockTestAttempt.findMany({
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
    async findBestAttempt(mockTestId, otrId) {
        return this.prisma.mockTestAttempt.findFirst({
            where: { mockTestId, otrId, isDeleted: false },
            orderBy: { score: 'desc' },
            select: { score: true, attemptedAt: true },
        });
    }
    async countBetterAttempts(mockTestId, score, beforeDate) {
        return this.prisma.mockTestAttempt.count({
            where: {
                mockTestId,
                isDeleted: false,
                OR: [
                    { score: { gt: score } },
                    { score, attemptedAt: { lt: beforeDate } },
                ],
            },
        });
    }
    async countAttempts(mockTestId) {
        return this.prisma.mockTestAttempt.count({
            where: { mockTestId, isDeleted: false },
        });
    }
    async $transaction(fn) {
        return this.prisma.$transaction(fn);
    }
};
exports.MockTestRepository = MockTestRepository;
exports.MockTestRepository = MockTestRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MockTestRepository);
//# sourceMappingURL=mock-test.repository.js.map