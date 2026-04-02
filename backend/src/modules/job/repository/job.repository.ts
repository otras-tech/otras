import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.JobUncheckedCreateInput) {
    return this.prisma.job.create({ data });
  }

  async findAll(cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.prisma.job.findMany({
      where: { status: 'Open', isDeleted: false },
      orderBy: { deadline: 'asc' },
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
  }

  async findById(id: number) {
    return this.prisma.job.findUnique({
      where: { id, isDeleted: false },
    });
  }

  async update(id: number, data: Prisma.JobUpdateInput) {
    return this.prisma.job.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prisma.job.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
