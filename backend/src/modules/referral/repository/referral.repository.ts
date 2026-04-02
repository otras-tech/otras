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

  async findByReferrerId(referrerId: number) {
    return this.prisma.referral.findMany({ where: { referrerId } });
  }

  async findByReferreerIdOrdered(referrerId: number) {
    return this.prisma.referral.findMany({
      where: { referrerId },
      orderBy: { createdAt: 'desc' },
    });
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

  async findAll() {
    return this.prisma.referral.findMany({
      include: {
        referrer: { select: { firstName: true, lastName: true, otrId: true } },
      },
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
