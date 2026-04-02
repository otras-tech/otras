import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.QuestionCreateInput) {
    return this.prisma.question.create({ data, include: { subject: true } });
  }

  async findAll(where: Prisma.QuestionWhereInput) {
    return this.prisma.question.findMany({
      where: { ...where, isDeleted: false },
      include: { subject: true },
    });
  }

  async findById(id: number) {
    return this.prisma.question.findUnique({
      where: { id },
      include: { subject: true },
    });
  }

  async update(id: number, data: Prisma.QuestionUpdateInput) {
    return this.prisma.question.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    return this.prisma.question.update({ where: { id }, data: { isDeleted: true } });
  }
}
