import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
  }

  async findByOtrId(otrId: string) {
    return this.prisma.user.findFirst({
      where: { otrId, isDeleted: false },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async findByIdActive(id: number) {
    return this.prisma.user.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        otrId: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async findByReferralCode(referralCode: string) {
    return this.prisma.user.findUnique({
      where: { referralCode, isDeleted: false },
    });
  }

  async findAll(cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.prisma.user.findMany({
      where: { isDeleted: false },
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
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

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async getArthaProfile(userId: string) {
    return this.prisma.arthaProfile.findFirst({
      where: { userId, isDeleted: false },
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

  async getActivePayment(userId: number, since: Date) {
    return this.prisma.payment.findFirst({
      where: {
        userId,
        status: 'paid',
        createdAt: { gte: since },
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
  }

  async getAnyPastPayment(userId: number) {
    return this.prisma.payment.findFirst({
      where: { userId, status: 'paid', isDeleted: false },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
  }

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  async incrementCredits(tx: Prisma.TransactionClient, userId: number, amount: number) {
    return tx.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    });
  }

  async createReferral(
    tx: Prisma.TransactionClient,
    data: { referrerId: number; refereeOtrId: string; creditsEarned: number; status: string },
  ) {
    return tx.referral.create({ data });
  }
}
