import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string) {
    return this.prisma.mockTestCategory.create({ data: { name } });
  }

  async findAll(cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.prisma.mockTestCategory.findMany({
      where: { isDeleted: false },
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
  }

  async findById(id: number) {
    return this.prisma.mockTestCategory.findUnique({ where: { id } });
  }

  async update(id: number, name: string) {
    return this.prisma.mockTestCategory.update({ where: { id }, data: { name } });
  }

  async softDelete(id: number) {
    return this.prisma.mockTestCategory.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
