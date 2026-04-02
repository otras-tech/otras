import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(userId: number, examId: number) {
    return this.prisma.application.upsert({
      where: { userId_examId: { userId, examId } },
      update: {},
      create: { userId, examId },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.application.findMany({
      where: { userId, isDeleted: false },
      include: { exam: { select: { id: true, name: true, applicationStatus: true } } },
    });
  }

  async findByUserIdRaw(userId: number) {
    return this.prisma.application.findMany({
      where: { userId },
      include: { exam: true },
    });
  }

  async findById(id: number) {
    return this.prisma.application.findUnique({ where: { id } });
  }

  async findByOtrId(otrId: string) {
    const user = await this.prisma.user.findUnique({
      where: { otrId },
      select: { id: true },
    });
    if (!user) return null;
    return this.prisma.application.findMany({
      where: { userId: user.id, isDeleted: false },
      include: { exam: true },
    });
  }

  async findAll() {
    return this.prisma.application.findMany({
      where: { isDeleted: false },
      include: { user: true, exam: true },
    });
  }

  async updateStatus(id: number, data: Prisma.ApplicationUpdateInput) {
    return this.prisma.application.update({ where: { id }, data });
  }
}
