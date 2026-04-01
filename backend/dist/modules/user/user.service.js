"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const result_service_1 = require("../result/result.service");
const mock_test_service_1 = require("../mock-test/mock-test.service");
const bcrypt = __importStar(require("bcrypt"));
let UserService = class UserService {
    prisma;
    resultService;
    mockTestService;
    constructor(prisma, resultService, mockTestService) {
        this.prisma = prisma;
        this.resultService = resultService;
        this.mockTestService = mockTestService;
    }
    async create(data) {
        const { referralCode, ...userData } = data;
        if (userData.pincode != null) {
            userData.pincode = userData.pincode.toString();
        }
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const otrId = this.generateOtrId(userData.domicile || '', userData.pincode || '');
        try {
            const tempCode = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const newUser = await this.prisma.user.create({
                data: {
                    ...userData,
                    password: hashedPassword,
                    otrId,
                    referralCode: tempCode,
                },
            });
            let currentReferralCode = null;
            let batchAttempts = 0;
            while (!currentReferralCode && batchAttempts < 5) {
                const batch = Array.from({ length: 10 }, () => 'REF' + Math.floor(100000 + Math.random() * 900000));
                const collisions = await this.prisma.user.findMany({
                    where: { referralCode: { in: batch } },
                    select: { referralCode: true }
                });
                const collisionSet = new Set(collisions.map(c => c.referralCode));
                const available = batch.find(code => !collisionSet.has(code));
                if (available) {
                    currentReferralCode = available;
                }
                batchAttempts++;
            }
            const finalReferralCode = currentReferralCode || 'REF' + Date.now().toString().slice(-6);
            await this.prisma.user.update({
                where: { id: newUser.id },
                data: { referralCode: finalReferralCode },
            });
            if (referralCode) {
                const referrer = await this.prisma.user.findUnique({
                    where: { referralCode },
                });
                if (referrer && referrer.id !== newUser.id) {
                    const existingReferral = await this.prisma.referral.findFirst({
                        where: { refereeOtrId: newUser.otrId },
                    });
                    if (!existingReferral) {
                        await this.prisma.$transaction(async (tx) => {
                            await tx.user.update({
                                where: { id: referrer.id },
                                data: { credits: { increment: 10 } },
                            });
                            await tx.user.update({
                                where: { id: newUser.id },
                                data: { credits: { increment: 10 } },
                            });
                            await tx.referral.create({
                                data: {
                                    referrerId: referrer.id,
                                    refereeOtrId: newUser.otrId,
                                    creditsEarned: 10,
                                    status: 'Joined',
                                },
                            });
                        });
                    }
                }
            }
            return await this.prisma.user.findUnique({ where: { id: newUser.id } });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Email or Referral Code constraint failed');
            }
            throw error;
        }
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findByOtrId(otrId) {
        return this.prisma.user.findUnique({ where: { otrId } });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user || null;
    }
    async findAll() {
        return this.prisma.user.findMany({
            take: 100,
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
    async update(id, data) {
        const { password, ...updateData } = data;
        const finalData = { ...updateData };
        if (password) {
            finalData.password = await bcrypt.hash(password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: finalData,
        });
    }
    async remove(id) {
        return this.prisma.user.delete({ where: { id } });
    }
    async getDashboardData(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const [results, mockAttempts, arthaProfile] = await Promise.all([
            this.resultService.getUserResults(id),
            this.mockTestService.getUserMockAttempts(user.otrId),
            this.getArthaProfile(id.toString()),
        ]);
        const mergedAttempts = [
            ...results.map((r) => {
                const testData = r.test;
                const totalQs = testData?._count?.questions || 1;
                return {
                    id: `res_${r.id}`,
                    score: r.score,
                    percentage: Math.min(Math.round((r.score / totalQs) * 100), 100),
                    createdAt: r.createdAt,
                    testName: testData?.name || 'Artha Assessment',
                    type: 'artha',
                    subjectBreakdown: r.subjectBreakdown,
                };
            }),
            ...mockAttempts.map((m) => ({
                id: `mock_${m.id}`,
                score: m.score,
                percentage: m.totalMarks > 0
                    ? m.correctAnswers != null
                        ? Math.min(Math.round((m.correctAnswers / m.totalMarks) * 100), 100)
                        : Math.max(0, Math.min(Math.round((m.score / m.totalMarks) * 100), 100))
                    : 0,
                createdAt: m.attemptedAt,
                testName: m.mockTest?.title || 'Official Mock Test',
                type: 'mock',
                subjectBreakdown: m.subjectBreakdown,
            })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        let readinessIndex = 0;
        if (arthaProfile && arthaProfile.readinessIndex > 0) {
            readinessIndex = Math.round(arthaProfile.readinessIndex);
        }
        else if (arthaProfile && arthaProfile.percentile > 0) {
            readinessIndex = Math.round(arthaProfile.percentile);
        }
        else {
            const latestAttempt = mergedAttempts[0];
            readinessIndex = latestAttempt ? latestAttempt.percentage : 0;
        }
        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                otrId: user.otrId,
                email: user.email,
            },
            stats: {
                readinessIndex,
                testsCompleted: mergedAttempts.length,
                recentTend: mergedAttempts
                    .slice(0, 7)
                    .reverse()
                    .map((r) => r.percentage),
                percentile: arthaProfile?.percentile || 0,
                logicalScore: arthaProfile?.logicalScore || 0,
                quantScore: arthaProfile?.quantScore || 0,
                verbalScore: arthaProfile?.verbalScore || 0,
            },
            mockTests: mergedAttempts.map((a) => ({
                score: a.percentage,
                createdAt: a.createdAt,
                subjectBreakdown: a.subjectBreakdown,
            })),
            recentResults: mergedAttempts.slice(0, 3).map((a) => ({
                id: a.id,
                score: a.score,
                percentage: a.percentage,
                createdAt: a.createdAt,
                test: { name: a.testName },
            })),
        };
    }
    generateOtrId(state, pincode) {
        const stateMapping = {
            'andhra pradesh': 'AP',
            'arunachal pradesh': 'AR',
            assam: 'AS',
            bihar: 'BR',
            chhattisgarh: 'CG',
            goa: 'GA',
            gujarat: 'GJ',
            haryana: 'HR',
            'himachal pradesh': 'HP',
            jharkhand: 'JH',
            karnataka: 'KA',
            kerala: 'KL',
            'madhya pradesh': 'MP',
            maharashtra: 'MH',
            manipur: 'MN',
            meghalaya: 'ML',
            mizoram: 'MZ',
            nagaland: 'NL',
            odisha: 'OR',
            punjab: 'PB',
            rajasthan: 'RJ',
            sikkim: 'SK',
            'tamil nadu': 'TN',
            telangana: 'TG',
            tripura: 'TR',
            'uttar pradesh': 'UP',
            uttarakhand: 'UK',
            'west bengal': 'WB',
            'andaman and nicobar islands': 'AN',
            chandigarh: 'CH',
            'dadra and nagar haveli': 'DN',
            'daman and diu': 'DD',
            delhi: 'DL',
            'jammu and kashmir': 'JK',
            ladakh: 'LA',
            lakshadweep: 'LD',
            puducherry: 'PY',
        };
        const normalizedState = (state || '').trim().toLowerCase();
        let stateCode = stateMapping[normalizedState];
        if (!stateCode) {
            stateCode = (state || 'XX')
                .replace(/[^a-zA-Z]/g, '')
                .substring(0, 2)
                .toUpperCase();
            if (stateCode.length < 2)
                stateCode = stateCode.padEnd(2, 'X');
        }
        const year = new Date().getFullYear().toString().slice(-2);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomAlphabets = '';
        for (let i = 0; i < 3; i++) {
            randomAlphabets += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const randomNumbers = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0');
        return `${stateCode}${year}${randomAlphabets}${randomNumbers}`;
    }
    async getArthaProfile(userId) {
        return this.prisma.arthaProfile.findFirst({
            where: { userId },
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
    async getTierStatus(userId) {
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);
        const [profile, activePayment, anyPastPayment] = await Promise.all([
            this.prisma.arthaProfile.findFirst({
                where: { userId: userId.toString() },
            }),
            this.prisma.payment.findFirst({
                where: {
                    userId,
                    status: 'paid',
                    createdAt: { gte: oneYearAgo },
                },
                orderBy: { createdAt: 'desc' },
                select: { id: true },
            }),
            this.prisma.payment.findFirst({
                where: {
                    userId,
                    status: 'paid',
                },
                orderBy: { createdAt: 'desc' },
                select: { id: true },
            }),
        ]);
        const hasActiveSubscription = !!activePayment;
        const hasExpiredSubscription = !hasActiveSubscription && !!anyPastPayment;
        const t1Prog = profile?.tier1Progress || 0;
        const t2Prog = profile?.tier2Progress || 0;
        const t3Prog = profile?.tier3Progress || 0;
        return {
            tier1: {
                unlocked: true,
                completed: t1Prog === 100,
            },
            tier2: {
                unlocked: t1Prog === 100,
                completed: t2Prog === 100,
                subscriptionRequired: t1Prog === 100 && !hasActiveSubscription,
                subscriptionExpired: t1Prog === 100 && hasExpiredSubscription,
            },
            tier3: {
                unlocked: t2Prog === 100,
                completed: t3Prog === 100,
                subscriptionRequired: t2Prog === 100 && !hasActiveSubscription,
                subscriptionExpired: t2Prog === 100 && hasExpiredSubscription,
            },
            hasActiveSubscription,
            hasExpiredSubscription,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        result_service_1.ResultService,
        mock_test_service_1.MockTestService])
], UserService);
//# sourceMappingURL=user.service.js.map