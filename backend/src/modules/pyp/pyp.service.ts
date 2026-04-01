import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PypService {
  constructor(private prisma: PrismaService) {}

  async create(data: { year: number; fileUrl: string; examId: number }) {
    const { examId, ...rest } = data;
    return this.prisma.pYP.create({
      data: {
        ...rest,
        exam: { connect: { id: examId } },
      },
    });
  }

  async findAll() {
    return this.prisma.pYP.findMany({
      include: { exam: true },
    });
  }

  async update(
    id: number,
    data: { year?: number; fileUrl?: string; examId?: number },
  ) {
    const { examId, ...rest } = data;
    const updateData: Prisma.PYPUpdateInput = { ...rest };
    if (examId) {
      updateData.exam = { connect: { id: examId } };
    }
    return this.prisma.pYP.update({ where: { id }, data: updateData });
  }

  async remove(id: number) {
    return this.prisma.pYP.delete({ where: { id } });
  }
}
