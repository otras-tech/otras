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
exports.ResultRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let ResultRepository = class ResultRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPlaceholder(userId, testId, tier) {
        return this.prisma.result.create({
            data: { userId, testId, tier, score: 0, subjectBreakdown: {}, startTime: new Date() },
            select: { id: true, startTime: true },
        });
    }
    async findById(id) {
        return this.prisma.result.findUnique({
            where: { id },
            select: { id: true, userId: true },
        });
    }
    async findByUserId(userId, cursor, take) {
        const safeTake = Math.min(take || 20, 100);
        return this.prisma.result.findMany({
            where: { userId, isDeleted: false },
            take: safeTake,
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
                    select: { name: true, _count: { select: { questions: true } } },
                },
            },
        });
    }
    async checkOwnership(resultId, userId) {
        const result = await this.prisma.result.findUnique({
            where: { id: resultId },
            select: { userId: true },
        });
        return result?.userId === userId;
    }
};
exports.ResultRepository = ResultRepository;
exports.ResultRepository = ResultRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResultRepository);
//# sourceMappingURL=result.repository.js.map