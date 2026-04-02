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
exports.ReferralRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let ReferralRepository = class ReferralRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(referrerId, refereeOtrId) {
        return this.prisma.referral.create({
            data: { referrerId, refereeOtrId, status: 'Joined' },
        });
    }
    async findByReferrerId(referrerId) {
        return this.prisma.referral.findMany({ where: { referrerId } });
    }
    async findByReferreerIdOrdered(referrerId) {
        return this.prisma.referral.findMany({
            where: { referrerId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findFirstByRefereeOtrId(refereeOtrId) {
        return this.prisma.referral.findFirst({ where: { refereeOtrId } });
    }
    async findReferralRewardsByUserId(userId) {
        return this.prisma.referralReward.findMany({
            where: { userId },
            include: { mockTest: true },
        });
    }
    async findAll() {
        return this.prisma.referral.findMany({
            include: {
                referrer: { select: { firstName: true, lastName: true, otrId: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findUserByIdWithCredits(referrerId) {
        return this.prisma.user.findUnique({
            where: { id: referrerId },
            select: { credits: true, referralCode: true, otrId: true },
        });
    }
};
exports.ReferralRepository = ReferralRepository;
exports.ReferralRepository = ReferralRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReferralRepository);
//# sourceMappingURL=referral.repository.js.map