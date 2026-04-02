import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ReferralRepository } from './repository/referral.repository';

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

    const [referralsMade, referrer] = await Promise.all([
      this.referralRepository.findByReferrerId(referrerId),
      this.referralRepository.findUserByIdWithCredits(referrerId),
    ]);

    const joinedViaReferral = referrer
      ? await this.referralRepository.findFirstByRefereeOtrId(referrer.otrId)
      : null;

    const totalReferrals = referralsMade.length;
    const successReferrals = referralsMade.filter(
      (r) => r.status === 'Qualified Referral',
    ).length;

    let creditsEarned = referralsMade.reduce(
      (sum, r) => sum + (r.creditsEarned || 0),
      0,
    );
    if (joinedViaReferral) {
      creditsEarned += 10;
    }
    const mockTestsEarned = Math.floor(successReferrals / 10);

    return {
      totalReferrals,
      successReferrals,
      creditsEarned,
      mockTestsEarned,
      availableCredits: referrer?.credits ?? 0,
      referralCode: referrer?.referralCode ?? '',
      referrals: referralsMade,
    };
  }

  async getReferralHistory(requesterId: number, requesterRole: string, referrerId: number) {
    if (requesterId !== referrerId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    const referrals = await this.referralRepository.findByReferreerIdOrdered(referrerId);

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

  async getAllReferrals() {
    return this.referralRepository.findAll();
  }
}
