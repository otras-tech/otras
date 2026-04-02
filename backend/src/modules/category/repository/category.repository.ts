import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string) {
    return this.prisma.mockTestCategory.create({ data: { name } });
  }

  async findAll() {
    return this.prisma.mockTestCategory.findMany({
      where: { isDeleted: false },
      take: 100,
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
