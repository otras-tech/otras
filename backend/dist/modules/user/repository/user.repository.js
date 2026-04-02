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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let UserRepository = class UserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.user.findFirst({
            where: { email, isDeleted: false },
        });
    }
    async findByOtrId(otrId) {
        return this.prisma.user.findFirst({
            where: { otrId, isDeleted: false },
        });
    }
    async findById(id) {
        return this.prisma.user.findFirst({
            where: { id, isDeleted: false },
        });
    }
    async findByIdActive(id) {
        return this.prisma.user.findUnique({
            where: { id, isDeleted: false },
            select: {
                id: true,
                otrId: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        });
    }
    async findByReferralCode(referralCode) {
        return this.prisma.user.findUnique({
            where: { referralCode, isDeleted: false },
        });
    }
    async findAll(cursor, take) {
        const safeTake = Math.min(take || 20, 100);
        return this.prisma.user.findMany({
            where: { isDeleted: false },
            take: safeTake,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                otrId: true,
                role: true,
                isDeleted: true,
                createdAt: true,
            },
        });
    }
    async create(data) {
        return this.prisma.user.create({ data });
    }
    async update(id, data) {
        return this.prisma.user.update({ where: { id }, data });
    }
    async softDelete(id) {
        return this.prisma.user.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
    async getArthaProfile(userId) {
        return this.prisma.arthaProfile.findFirst({
            where: { userId, isDeleted: false },
            select: {
                id: true,
                userId: true,
                logicalScore: true,
                quantScore: true,
                verbalScore: true,
                percentile: true,
                readinessIndex: true,
                tier1Progress: true,
                tier2Progress: true,
                tier3Progress: true,
                feedback: {
                    select: {
                        id: true,
                        logicalFoundation: true,
                        readinessInsight: true,
                        preparationAdvice: true,
                        createdAt: true,
                    },
                },
            },
        });
    }
    async getActivePayment(userId, since) {
        return this.prisma.payment.findFirst({
            where: {
                userId,
                status: 'paid',
                createdAt: { gte: since },
                isDeleted: false,
            },
            orderBy: { createdAt: 'desc' },
            select: { id: true },
        });
    }
    async getAnyPastPayment(userId) {
        return this.prisma.payment.findFirst({
            where: { userId, status: 'paid', isDeleted: false },
            orderBy: { createdAt: 'desc' },
            select: { id: true },
        });
    }
    async $transaction(fn) {
        return this.prisma.$transaction(fn);
    }
    async incrementCredits(tx, userId, amount) {
        return tx.user.update({
            where: { id: userId },
            data: { credits: { increment: amount } },
        });
    }
    async createReferral(tx, data) {
        return tx.referral.create({ data });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map