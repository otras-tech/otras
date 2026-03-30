"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReferralService", {
    enumerable: true,
    get: function() {
        return ReferralService;
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
let ReferralService = class ReferralService {
    async createReferral(referrerId, refereeOtrId) {
        return this.prisma.referral.create({
            data: {
                referrerId,
                refereeOtrId,
                status: 'Joined'
            }
        });
    }
    async getReferralStats(referrerId) {
        const [referralsMade, referrer] = await Promise.all([
            this.prisma.referral.findMany({
                where: {
                    referrerId
                }
            }),
            this.prisma.user.findUnique({
                where: {
                    id: referrerId
                },
                select: {
                    credits: true,
                    referralCode: true,
                    otrId: true
                }
            })
        ]);
        // Also find if this user was a referee and got credits for joining
        const joinedViaReferral = referrer && referrer.otrId ? await this.prisma.referral.findFirst({
            where: {
                refereeOtrId: referrer.otrId
            }
        }) : null;
        const totalReferrals = referralsMade.length;
        const successReferrals = referralsMade.filter((r)=>r.status === 'Qualified Referral').length;
        // Credits earned = (credits from friends you referred) + (credits you got for joining)
        let creditsEarned = referralsMade.reduce((sum, r)=>sum + (r.creditsEarned || 0), 0);
        if (joinedViaReferral) {
            creditsEarned += 10; // The joining bonus
        }
        const mockTestsEarned = Math.floor(successReferrals / 10);
        const result = {
            totalReferrals,
            successReferrals,
            creditsEarned,
            mockTestsEarned,
            availableCredits: referrer?.credits ?? 0,
            referralCode: referrer?.referralCode ?? '',
            referrals: referralsMade
        };
        return result;
    }
    async getReferralHistory(referrerId) {
        const referrals = await this.prisma.referral.findMany({
            where: {
                referrerId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return referrals.map((r)=>({
                id: r.id,
                friendOtrId: r.refereeOtrId,
                signupDate: r.createdAt,
                status: r.status,
                creditsEarned: r.creditsEarned || 0
            }));
    }
    async getRewards(userId) {
        return this.prisma.referralReward.findMany({
            where: {
                userId
            },
            include: {
                mockTest: true
            }
        });
    }
    async getAllReferrals() {
        return this.prisma.referral.findMany({
            include: {
                referrer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        otrId: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
ReferralService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], ReferralService);

//# sourceMappingURL=referral.service.js.map