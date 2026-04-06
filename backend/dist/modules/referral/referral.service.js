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
const referral_repository_1 = require("./repository/referral.repository");
let ReferralService = class ReferralService {
    referralRepository;
    constructor(referralRepository) {
        this.referralRepository = referralRepository;
    }
    async createReferral(requesterId, referrerId, refereeOtrId) {
        if (requesterId !== referrerId) {
            throw new common_1.ForbiddenException('You can only create referrals for yourself');
        }
        return this.referralRepository.create(referrerId, refereeOtrId);
    }
    async getReferralStats(requesterId, requesterRole, referrerId) {
        if (requesterId !== referrerId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        const [stats, referrer, recentReferrals] = await Promise.all([
            this.referralRepository.countReferralStats(referrerId),
            this.referralRepository.findUserByIdWithCredits(referrerId),
            this.referralRepository.findByReferrerId(referrerId, undefined, 10),
        ]);
        const joinedViaReferral = referrer
            ? await this.referralRepository.findFirstByRefereeOtrId(referrer.otrId)
            : null;
        let totalCreditsEarned = stats.creditsEarned;
        if (joinedViaReferral) {
            totalCreditsEarned += 10;
        }
        const mockTestsEarned = Math.floor(stats.success / 10);
        return {
            totalReferrals: stats.total,
            successReferrals: stats.success,
            creditsEarned: totalCreditsEarned,
            mockTestsEarned,
            availableCredits: referrer?.credits ?? 0,
            referralCode: referrer?.referralCode ?? '',
            referrals: recentReferrals,
        };
    }
    async getReferralHistory(requesterId, requesterRole, referrerId, query) {
        if (requesterId !== referrerId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        const referrals = await this.referralRepository.findByReferrerId(referrerId, query.cursor, query.take);
        return referrals.map((r) => ({
            id: r.id,
            friendOtrId: r.refereeOtrId,
            signupDate: r.createdAt,
            status: r.status,
            creditsEarned: r.creditsEarned || 0,
        }));
    }
    async getRewards(requesterId, requesterRole, userId) {
        if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.referralRepository.findReferralRewardsByUserId(userId);
    }
    async getAllReferrals(cursor, take) {
        return this.referralRepository.findAll(cursor, take);
    }
};
exports.ReferralService = ReferralService;
exports.ReferralService = ReferralService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [referral_repository_1.ReferralRepository])
], ReferralService);
//# sourceMappingURL=referral.service.js.map