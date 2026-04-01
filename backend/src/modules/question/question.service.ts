import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    text: string;
    options: string[];
    answer: string;
    explanation?: string;
    subjectId: number;
  }) {
    const { subjectId, ...rest } = data;
    return this.prisma.question.create({
      data: {
        ...rest,
        subject: { connect: { id: subjectId } },
      },
    });
  }

  findAll(query?: { examId?: number; subjectId?: number }) {
    const where: Prisma.QuestionWhereInput = {};
    if (query?.subjectId) where.subjectId = query.subjectId;
    if (query?.examId) {
      where.tests = {
        some: {
          examId: query.examId,
        },
      };
    }

    return this.prisma.question.findMany({
      where,
      include: { subject: true },
    });
  }

  findOne(id: number) {
    return this.prisma.question.findUnique({
      where: { id },
      include: { subject: true },
    });
  }

  update(
    id: number,
    data: {
      text?: string;
      options?: string[];
      answer?: string;
      explanation?: string;
      subjectId?: number;
    },
  ) {
    const { subjectId, ...rest } = data;
    const updateData: Prisma.QuestionUpdateInput = { ...rest };
    if (subjectId) {
      updateData.subject = { connect: { id: subjectId } };
    }
    return this.prisma.question.update({
      where: { id },
      data: updateData,
    });
  }

  remove(id: number) {
    return this.prisma.question.delete({
      where: { id },
    });
  }
}
