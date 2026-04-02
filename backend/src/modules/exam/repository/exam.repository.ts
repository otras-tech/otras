import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ExamCreateInput) {
    return this.prisma.exam.create({ data, include: { subjects: true } });
  }

  async update(id: number, data: Prisma.ExamUpdateInput) {
    return this.prisma.exam.update({ where: { id }, data, include: { subjects: true } });
  }

  async findAll(cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    return this.prisma.exam.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        cutoff: true,
        syllabus: true,
        noOfQuestions: true,
        subjects: { select: { id: true, name: true } },
      },
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.exam.findFirst({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        cutoff: true,
        syllabus: true,
        eligibility: true,
        longDescription: true,
        noOfQuestions: true,
        pattern: true,
        shortDescription: true,
        applicationStatus: true,
        createdAt: true,
        subjects: { select: { id: true, name: true } },
      },
    });
  }

  async findWithTests(examId: number) {
    return this.prisma.exam.findFirst({
      where: { id: examId, isDeleted: false },
      select: {
        id: true,
        name: true,
        noOfQuestions: true,
        tests: {
          where: { isDeleted: false },
          take: 10,
          select: {
            id: true,
            name: true,
            questions: {
              select: { id: true, subject: { select: { id: true, name: true } } },
            },
          },
        },
      },
    });
  }

  async findForTestGeneration(examId: number) {
    return this.prisma.exam.findFirst({
      where: { id: examId, isDeleted: false },
      select: {
        id: true,
        name: true,
        noOfQuestions: true,
        subjects: { select: { id: true } },
      },
    });
  }

  async countQuestions(subjectIds: number[]) {
    return this.prisma.question.count({
      where: { subjectId: { in: subjectIds }, isDeleted: false },
    });
  }

  async findAllQuestionIds(subjectIds: number[]) {
    return this.prisma.question.findMany({
      where: { subjectId: { in: subjectIds }, isDeleted: false },
      select: { id: true },
      take: 1000, // Safety limit for IDs
    });
  }

  async findQuestionAtOffset(subjectIds: number[], skip: number) {
    return this.prisma.question.findMany({
      where: { subjectId: { in: subjectIds }, isDeleted: false },
      select: { id: true },
      take: 1,
      skip,
    });
  }

  async createTest(data: Prisma.TestCreateInput) {
    return this.prisma.test.create({
      data,
      select: {
        id: true,
        name: true,
        createdAt: true,
        questions: { select: { id: true, subject: { select: { id: true, name: true } } } },
      },
    });
  }

  async findByTier(tier: string) {
    return this.prisma.exam.findMany({
      where: {
        isDeleted: false,
        name: { contains: `Tier ${tier}`, mode: 'insensitive' },
      },
      select: {
        id: true,
        name: true,
        shortDescription: true,
        subjects: { select: { id: true, name: true } },
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.exam.update({ where: { id }, data: { isDeleted: true } });
  }
}
