import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  async createReferral(referrerId: number, refereeOtrId: string) {
    return this.prisma.referral.create({
      data: {
        referrerId,
        refereeOtrId,
        status: 'Joined',
      },
    });
  }

  async getReferralStats(referrerId: number) {
    const [referralsMade, referrer] = await Promise.all([
      this.prisma.referral.findMany({ where: { referrerId } }),
      this.prisma.user.findUnique({
        where: { id: referrerId },
        select: { credits: true, referralCode: true, otrId: true },
      }),
    ]);

    // Also find if this user was a referee and got credits for joining
    const joinedViaReferral = referrer ? await this.prisma.referral.findFirst({
      where: { refereeOtrId: referrer.otrId }
    }) : null;

    const totalReferrals = referralsMade.length;
    const successReferrals = referralsMade.filter(r => r.status === 'Qualified Referral').length;
    
    // Credits earned = (credits from friends you referred) + (credits you got for joining)
    let creditsEarned = referralsMade.reduce((sum, r) => sum + (r.creditsEarned || 0), 0);
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
      referrals: referralsMade,
    };
    return result;
  }

  async getReferralHistory(referrerId: number) {
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

  async getRewards(userId: number) {
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
}
