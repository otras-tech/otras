import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ReferralRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(referrerId: number, refereeOtrId: string) {
    return this.prisma.referral.create({
      data: { referrerId, refereeOtrId, status: 'Joined' },
    });
  }

  async findByReferrerId(referrerId: number, cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.prisma.referral.findMany({
      where: { referrerId },
      select: {
        id: true,
        status: true,
        creditsEarned: true,
        refereeOtrId: true,
        createdAt: true,
      },
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countReferralStats(referrerId: number) {
    const [total, success, totalCredits] = await Promise.all([
      this.prisma.referral.count({ where: { referrerId } }),
      this.prisma.referral.count({
        where: { referrerId, status: 'Qualified Referral' },
      }),
      this.prisma.referral.aggregate({
        where: { referrerId },
        _sum: { creditsEarned: true },
      }),
    ]);

    return {
      total,
      success,
      creditsEarned: totalCredits._sum.creditsEarned || 0,
    };
  }

  async findFirstByRefereeOtrId(refereeOtrId: string) {
    return this.prisma.referral.findFirst({ where: { refereeOtrId } });
  }

  async findReferralRewardsByUserId(userId: number) {
    return this.prisma.referralReward.findMany({
      where: { userId },
      include: { mockTest: true },
    });
  }

  async findAll(cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.prisma.referral.findMany({
      select: {
        id: true,
        refereeOtrId: true,
        status: true,
        createdAt: true,
        referrer: { select: { firstName: true, lastName: true, otrId: true } },
      },
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserByIdWithCredits(referrerId: number) {
    return this.prisma.user.findUnique({
      where: { id: referrerId },
      select: { credits: true, referralCode: true, otrId: true },
    });
  }
}
