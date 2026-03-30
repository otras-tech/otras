import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

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
      take: 50,
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
        const subjects = exam.subjects;
        const S = subjects.length;
        const N = exam.noOfQuestions || 100;

        if (N < S)
          throw new Error(
            'Total questions cannot be less than number of subjects',
          );

        const base = Math.floor(N / S);
        const remainder = N % S;

        // Shuffle for fair remainder distribution
        const shuffledSubjects = [...subjects].sort(() => 0.5 - Math.random());

        const selectedQuestions: { id: number }[] = [];
        const testSubjectsData: any[] = [];

        for (let i = 0; i < S; i++) {
          const sub = shuffledSubjects[i];
          let allocation = base;
          if (i < remainder) allocation += 1;

          const subQuestions = await this.prisma.question.findMany({
            where: { subjectId: sub.id },
            select: { id: true },
          });

          if (subQuestions.length < allocation) {
            throw new Error(
              `Insufficient questions in Bank for subject: ${sub.name}. Required: ${allocation}`,
            );
          }

          const picked = subQuestions
            .sort(() => 0.5 - Math.random())
            .slice(0, allocation);
          picked.forEach((q) => selectedQuestions.push({ id: q.id }));

          testSubjectsData.push({
            subjectId: sub.id,
            allocatedQuestions: allocation,
          });
        }

        if (selectedQuestions.length > 0) {
          const newTest = await this.prisma.test.create({
            data: {
              name: `${exam.name} Auto-Generated Test`,
              examId: exam.id,
              questions: {
                connect: selectedQuestions,
              },
              testSubjects: {
                create: testSubjectsData,
              },
            },
            include: {
              questions: {
                include: { subject: true },
              },
              testSubjects: { include: { subject: true } },
            },
          });

          const { tests, ...examInfo } = exam;
          return {
            test: newTest,
            exam: examInfo,
          };
        }
      }
      throw new NotFoundException(
        'No tests found for this exam and no questions available to generate one.',
      );
    }

    // Pick a random test
    const randomTest =
      exam.tests[Math.floor(Math.random() * exam.tests.length)];

    // Return both test and exam as expected by frontend ArthaTest component
    const { tests, ...examInfo } = exam;
    return {
      test: randomTest,
      exam: examInfo,
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
