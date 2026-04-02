import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SubjectCreateInput) {
    return this.prisma.subject.create({ data });
  }

  async findAll(cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.prisma.subject.findMany({
      where: { isDeleted: false },
      include: { exams: { where: { isDeleted: false } } },
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
  }

  async findById(id: number) {
    return this.prisma.subject.findUnique({
      where: { id, isDeleted: false },
      include: { exams: { where: { isDeleted: false } } },
    });
  }

  async update(id: number, data: Prisma.SubjectUpdateInput) {
    return this.prisma.subject.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    return this.prisma.subject.update({ where: { id }, data: { isDeleted: true } });
  }
}
