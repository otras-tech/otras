import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PypRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PYPCreateInput) {
    return this.prisma.pYP.create({ data });
  }

  async findAll() {
    return this.prisma.pYP.findMany({
      where: { isDeleted: false },
      include: { exam: true },
    });
  }

  async findById(id: number) {
    return this.prisma.pYP.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.PYPUpdateInput) {
    return this.prisma.pYP.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    return this.prisma.pYP.update({ where: { id }, data: { isDeleted: true } });
  }
}
