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
exports.ReferralService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReferralService = class ReferralService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReferral(referrerId, refereeOtrId) {
        return this.prisma.referral.create({
            data: {
                referrerId,
                refereeOtrId,
                status: 'Joined',
            },
        });
    }
    async getReferralStats(referrerId) {
        const [referralsMade, referrer] = await Promise.all([
            this.prisma.referral.findMany({ where: { referrerId } }),
            this.prisma.user.findUnique({
                where: { id: referrerId },
                select: { credits: true, referralCode: true, otrId: true },
            }),
        ]);
        const joinedViaReferral = referrer ? await this.prisma.referral.findFirst({
            where: { refereeOtrId: referrer.otrId }
        }) : null;
        const totalReferrals = referralsMade.length;
        const successReferrals = referralsMade.filter(r => r.status === 'Qualified Referral').length;
        let creditsEarned = referralsMade.reduce((sum, r) => sum + (r.creditsEarned || 0), 0);
        if (joinedViaReferral) {
            creditsEarned += 10;
        }
        const mockTestsEarned = Math.floor(successReferrals / 10);
        const result = {
            totalReferrals,
            successReferrals,
            creditsEarned,
            mockTestsEarned,
            availableCredits: referrer?.credits ?? 0,
            referralCode: referrer?.referralCode ?? '',
            referrals: referralsMade,
        };
        return result;
    }
    async getReferralHistory(referrerId) {
        const referrals = await this.prisma.referral.findMany({
            where: { referrerId },
            orderBy: { createdAt: 'desc' },
        });
        return referrals.map(r => ({
            id: r.id,
            friendOtrId: r.refereeOtrId,
            signupDate: r.createdAt,
            status: r.status,
            creditsEarned: r.creditsEarned || 0,
        }));
    }
    async getRewards(userId) {
        return this.prisma.referralReward.findMany({
            where: { userId },
            include: { mockTest: true },
        });
    }
    async getAllReferrals() {
        return this.prisma.referral.findMany({
            include: {
                referrer: {
                    select: { firstName: true, lastName: true, otrId: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ReferralService = ReferralService;
exports.ReferralService = ReferralService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReferralService);
//# sourceMappingURL=referral.service.js.map