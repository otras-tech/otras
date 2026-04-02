import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MockTestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    categoryId: number | undefined,
    cursor: number | undefined,
    take: number,
  ) {
    const safeTake = Math.min(take || 20, 100);
    return this.prisma.mockTest.findMany({
      where: { categoryId: categoryId || undefined, isDeleted: false },
      select: {
        id: true,
        title: true,
        duration: true,
        category: { select: { name: true } },
      },
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.mockTest.findFirst({
      where: { id, isDeleted: false },
      select: {
        id: true,
        title: true,
        duration: true,
        category: { select: { name: true } },
        exam: { select: { name: true } },
      },
    });
  }

  async findAttemptById(id: number) {
    return this.prisma.mockTestAttempt.findFirst({
      where: { id, isDeleted: false },
      select: { otrId: true },
    });
  }

  async findUserByOtrId(otrId: string) {
    return this.prisma.user.findFirst({
      where: { otrId, isDeleted: false },
      select: { id: true },
    });
  }

  async findMockTestByIdActive(id: number) {
    return this.prisma.mockTest.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
  }

  async findTestByIdActive(id: number) {
    return this.prisma.test.findFirst({
      where: { id, isDeleted: false },
      select: { examId: true },
    });
  }

  async findExamByIdActive(id: number) {
    return this.prisma.exam.findFirst({
      where: { id, isDeleted: false },
      select: { name: true },
    });
  }

  async findMockTestByExamAndCategory(examId: number, categoryId: number) {
    return this.prisma.mockTest.findFirst({
      where: { examId, categoryId, isDeleted: false },
      select: { id: true },
    });
  }

  async upsertCategory(name: string) {
    return this.prisma.mockTestCategory.upsert({
      where: { name },
      update: { isDeleted: false },
      create: { name },
      select: { id: true },
    });
  }

  async getUserMockAttempts(otrId: string, cursor?: number) {
    return this.prisma.mockTestAttempt.findMany({
      where: {
        otrId,
        isDeleted: false,
        OR: [{ submitTime: { not: null } }, { score: { gt: 0 } }],
      },
      select: {
        id: true,
        score: true,
        totalMarks: true,
        correctAnswers: true,
        subjectBreakdown: true,
        attemptedAt: true,
        mockTest: { select: { title: true } },
      },
      orderBy: { attemptedAt: 'desc' },
      take: 20,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
  }

  async findBestAttempt(mockTestId: number, otrId: string) {
    return this.prisma.mockTestAttempt.findFirst({
      where: { mockTestId, otrId, isDeleted: false },
      orderBy: { score: 'desc' },
      select: { score: true, attemptedAt: true },
    });
  }

  async countBetterAttempts(
    mockTestId: number,
    score: number,
    beforeDate: Date,
  ) {
    return this.prisma.mockTestAttempt.count({
      where: {
        mockTestId,
        isDeleted: false,
        OR: [
          { score: { gt: score } },
          { score, attemptedAt: { lt: beforeDate } },
        ],
      },
    });
  }

  async countAttempts(mockTestId: number) {
    return this.prisma.mockTestAttempt.count({
      where: { mockTestId, isDeleted: false },
    });
  }

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
