import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { CreateExamDto } from './dto/create-exam.dto';

@Injectable()
export class ExamService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) { }

  async invalidateCache() {
    await this.cacheService.safeInvalidate(
      ['exams_all'],
      ['exam_details_*'],
    );
  }

  async create(data: CreateExamDto) {
    const { subjectIds, ...examData } = data;
    const targetSubjects = subjectIds || [];

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

  async update(id: number, updateData: CreateExamDto) {
    const { subjectIds, ...data } = updateData;
    const targetSubjects = subjectIds;

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
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        cutoff: true,
        syllabus: true,
        noOfQuestions: true,
        subjects: { select: { id: true, name: true } },
      },
      take: 50
    });
  }

  async findOne(id: number) {
    return this.prisma.exam.findUnique({
      where: { id, isDeleted: false },
      include: { subjects: true }, // Keep it light
    });
  }

  /**
   * Retrieves an existing random test for an exam. Pure GET, no side effects.
   */
  async getTest(examId: number) {
    const exam = await this.prisma.exam.findUnique({
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
              select: {
                id: true,
                subject: { select: { id: true, name: true } }
              }
            }
          }
        }
      }
    });

    if (!exam) throw new NotFoundException('Exam not found');
    if (exam.tests.length === 0) throw new NotFoundException('No tests found for this exam. Use POST to generate one.');

    const randomTest = exam.tests[Math.floor(Math.random() * exam.tests.length)];
    const { tests, ...examInfo } = exam;
    return { test: randomTest, exam: examInfo };
  }

  /**
   * Generates a new test for an exam based on available questions.
   * POST operation with side effects.
   */
  async generateTest(examId: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId, isDeleted: false },
      select: {
        id: true,
        name: true,
        noOfQuestions: true,
        subjects: { select: { id: true } }
      }
    });

    if (!exam) throw new NotFoundException('Exam not found');
    if (!exam.subjects || exam.subjects.length === 0) {
      throw new InternalServerErrorException('No subjects associated with this exam to generate questions');
    }

    const subjectIds = exam.subjects.map(s => s.id);
    const questions = await this.prisma.question.findMany({
      where: { subjectId: { in: subjectIds } },
      select: { id: true }
    });

    if (questions.length === 0) {
      throw new NotFoundException('No questions available in associated subjects to generate a test');
    }

    const selectedQuestions = questions
      .sort(() => 0.5 - Math.random())
      .slice(0, exam.noOfQuestions || 100);

    const newTest = await this.prisma.test.create({
      data: {
        name: `${exam.name} Auto-Generated - ${new Date().toLocaleDateString()}`,
        examId: exam.id,
        questions: {
          connect: selectedQuestions.map(q => ({ id: q.id })),
        },
      },
      include: {
        questions: {
          include: { subject: true },
        },
      },
    });

    return { test: newTest, exam };
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

