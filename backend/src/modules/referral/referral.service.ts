import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ReferralRepository } from './repository/referral.repository';
import { GetReferralHistoryDto } from './dto/referral.dto';

@Injectable()
export class ReferralService {
  constructor(private readonly referralRepository: ReferralRepository) {}

  async createReferral(requesterId: number, referrerId: number, refereeOtrId: string) {
    if (requesterId !== referrerId) {
      throw new ForbiddenException('You can only create referrals for yourself');
    }
    return this.referralRepository.create(referrerId, refereeOtrId);
  }

  async getReferralStats(requesterId: number, requesterRole: string, referrerId: number) {
    if (requesterId !== referrerId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    // 🔥 HIGH-SCALE OPTIMIZATION:
    // Replaced .length and .reduce filters (O(N) in memory) with DB counts (O(1) index lookups)
    const [stats, referrer, recentReferrals] = await Promise.all([
      this.referralRepository.countReferralStats(referrerId),
      this.referralRepository.findUserByIdWithCredits(referrerId),
      this.referralRepository.findByReferrerId(referrerId, undefined, 10), // Only fetch top 10 for dashboard preview
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
      referrals: recentReferrals, // Limit sent data to preview size
    };
  }

  async getReferralHistory(
    requesterId: number,
    requesterRole: string,
    referrerId: number,
    query: GetReferralHistoryDto,
  ) {
    if (requesterId !== referrerId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    const referrals = await this.referralRepository.findByReferrerId(
      referrerId,
      query.cursor,
      query.take,
    );

    return referrals.map((r) => ({
      id: r.id,
      friendOtrId: r.refereeOtrId,
      signupDate: r.createdAt,
      status: r.status,
      creditsEarned: r.creditsEarned || 0,
    }));
  }


  async getRewards(requesterId: number, requesterRole: string, userId: number) {
    if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.referralRepository.findReferralRewardsByUserId(userId);
  }

  async getAllReferrals(cursor?: number, take?: number) {
    return this.referralRepository.findAll(cursor, take);
  }

}
