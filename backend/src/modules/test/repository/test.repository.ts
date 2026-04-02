import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findQuestionsByIds(ids: number[]) {
    return this.prisma.question.findMany({
      where: { id: { in: ids }, isDeleted: false as any },
      select: { id: true },
    });
  }

  async findExamWithSubjects(examId: number) {
    return this.prisma.exam.findUnique({
      where: { id: examId, isDeleted: false },
      include: { subjects: { where: { isDeleted: false as any } } },
    });
  }

  async findQuestionsBySubjectIds(subjectIds: number[]) {
    return this.prisma.question.findMany({
      where: { subjectId: { in: subjectIds }, isDeleted: false as any },
      select: { id: true },
    });
  }

  async createTest(data: Prisma.TestUncheckedCreateInput, questionIds: number[]) {
    return this.prisma.test.create({
      data: {
        ...data,
        questions: {
          connect: questionIds.map((id) => ({ id })),
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        exam: {
          select: { id: true, name: true },
        },
        _count: {
          select: { questions: true },
        },
      },
    });
  }

  async findAll(cursor?: number, take?: number) {
    return this.prisma.test.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        createdAt: true,
        exam: {
          select: { id: true, name: true },
        },
        _count: {
          select: { questions: true },
        },
      },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.test.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        createdAt: true,
        exam: {
          select: { id: true, name: true, noOfQuestions: true },
        },
        questions: {
          where: { isDeleted: false as any },
          select: {
            id: true,
            text: true,
            options: true,
            subject: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async updateTest(id: number, data: Prisma.TestUncheckedUpdateInput) {
    return this.prisma.test.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return this.prisma.test.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
