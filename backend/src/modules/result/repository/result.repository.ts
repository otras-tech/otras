import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ResultRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPlaceholder(userId: number, testId: number, tier?: number) {
    return this.prisma.result.create({
      data: { userId, testId, tier, score: 0, subjectBreakdown: {}, startTime: new Date() },
      select: { id: true, startTime: true },
    });
  }

  async findById(id: number) {
    return this.prisma.result.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
  }

  async findByUserId(userId: number, cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.prisma.result.findMany({
      where: { userId, isDeleted: false },
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        score: true,
        submitTime: true,
        subjectBreakdown: true,
        createdAt: true,
        test: {
          select: { name: true, _count: { select: { questions: true } } },
        },
      },
    });
  }

  async checkOwnership(resultId: number, userId: number): Promise<boolean> {
    const result = await this.prisma.result.findUnique({
      where: { id: resultId },
      select: { userId: true },
    });
    return result?.userId === userId;
  }
}
