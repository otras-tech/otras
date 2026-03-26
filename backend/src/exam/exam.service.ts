import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) { }

  async create(data: any) {
    const { subjects, subjectIds, id, ...examData } = data;
    // 'subjects' preferred from the payload as per my previous implementation
    const targetSubjects = subjects || subjectIds || [];

    return this.prisma.exam.create({
      data: {
        ...examData,
        subjects: {
          connect: targetSubjects.map((id: number) => ({ id })),
        },
      },
      include: { subjects: true },
    });
  }

  async update(id: number, updateData: any) {
    const { subjects, subjectIds, ...data } = updateData;
    const targetSubjects = subjects || subjectIds;

    if (targetSubjects) {
      return this.prisma.exam.update({
        where: { id },
        data: {
          ...data,
          subjects: {
            set: [], // Clear existing
            connect: targetSubjects.map((id: number) => ({ id })),
          },
        },
        include: { subjects: true },
      });
    }

    return this.prisma.exam.update({
      where: { id },
      data: data,
      include: { subjects: true },
    });
  }

  async findAll() {
    return this.prisma.exam.findMany({
      include: { subjects: true },
      take: 50
    });
  }

  async findOne(id: number) {
    return this.prisma.exam.findUnique({
      where: { id },
      include: { subjects: true }, // Keep it light
    });
  }

  async getRandomTest(examId: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: {
        tests: {
          take: 5, // Only need a few tests to pick from
          include: {
            questions: {
              include: { subject: true },
            },
          },
        },
        subjects: true,
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.tests.length === 0) {
      if (exam.subjects && exam.subjects.length > 0) {
        const subjectIds = exam.subjects.map(s => s.id);
        const questions = await this.prisma.question.findMany({
          where: { subjectId: { in: subjectIds } },
        });

        if (questions.length > 0) {
          const selectedQuestions = questions
            .sort(() => 0.5 - Math.random())
            .slice(0, exam.noOfQuestions || 100)
            .map(q => ({ id: q.id }));

          const newTest = await this.prisma.test.create({
            data: {
              name: `${exam.name} Auto-Generated Test`,
              examId: exam.id,
              questions: {
                connect: selectedQuestions,
              },
            },
            include: {
              questions: {
                include: { subject: true },
              },
            },
          });

          const { tests, ...examInfo } = exam;
          return {
            test: newTest,
            exam: examInfo,
          };
        }
      }
      throw new NotFoundException('No tests found for this exam and no questions available to generate one.');
    }

    // Pick a random test
    const randomTest = exam.tests[Math.floor(Math.random() * exam.tests.length)];

    // Return both test and exam as expected by frontend ArthaTest component
    const { tests, ...examInfo } = exam;
    return {
      test: randomTest,
      exam: examInfo
    };
  }

  async findByTier(tier: string) {
    return this.prisma.exam.findMany({
      where: {
        name: {
          contains: `Tier ${tier}`,
          mode: 'insensitive',
        },
      },
      include: { subjects: true },
    });
  }

  async remove(id: number) {
    return this.prisma.exam.delete({
      where: { id },
    });
  }
}
