import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CareerReadinessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTestById(id: number) {
    return this.prisma.test.findUnique({
      where: { id, isDeleted: false },
      include: {
        questions: {
          include: { subject: true },
        },
      },
    });
  }

  async findExistingScore(otrId: string, testId: number) {
    return this.prisma.careerReadinessTestScore.findFirst({
      where: {
        otrId,
        testId,
        isDeleted: false,
      },
    });
  }

  async createScore(data: Prisma.CareerReadinessTestScoreUncheckedCreateInput) {
    return this.prisma.careerReadinessTestScore.create({ data });
  }

  async updateScore(id: number, data: Prisma.CareerReadinessTestScoreUncheckedUpdateInput) {
    return this.prisma.careerReadinessTestScore.update({
      where: { id },
      data,
    });
  }

  async findByOtrId(otrId: string) {
    return this.prisma.careerReadinessTestScore.findFirst({
      where: { otrId, isDeleted: false },
      include: { test: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
