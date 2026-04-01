import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async invalidateCache() {
    await this.cacheService.safeInvalidate(['tests_all'], ['test_details_*']);
  }

  async create(createTestDto: CreateTestDto) {
    const { name, examId, questionIds: manualQuestionIds } = createTestDto;

    let questionIdsToConnect: { id: number }[] = [];

    if (manualQuestionIds && manualQuestionIds.length > 0) {
      // Manual assignment (verify existence)
      const existingQuestions = await this.prisma.question.findMany({
        where: { id: { in: manualQuestionIds } },
        select: { id: true },
      });

      if (existingQuestions.length !== manualQuestionIds.length) {
        const existingIds = existingQuestions.map((q) => q.id);
        const missingIds = manualQuestionIds.filter(
          (id) => !existingIds.includes(id),
        );
        throw new BadRequestException(
          `Some question IDs do not exist: ${missingIds.join(', ')}`,
        );
      }

      questionIdsToConnect = manualQuestionIds.map((id) => ({ id }));
    } else {
      // Auto-generation logic (fetch subjects associated with this exam)
      const exam = await this.prisma.exam.findUnique({
        where: { id: examId },
        include: { subjects: true },
      });

      if (!exam) throw new BadRequestException('Exam not found');

      if (!exam.subjects || exam.subjects.length === 0) {
        throw new BadRequestException(
          'This exam has no associated subjects and no manual questionIds provided. Please add subjects to the exam or provide questionIds.',
        );
      }

      // Get all subjects associated with this exam
      const subjectIds = exam.subjects.map((s) => s.id);

      // Fetch all questions for these subjects
      const questions = await this.prisma.question.findMany({
        where: { subjectId: { in: subjectIds } },
        select: { id: true },
      });

      if (questions.length === 0) {
        throw new BadRequestException(
          'No questions found for the subjects associated with this exam. Please add questions to the subjects first.',
        );
      }

      // Target count: exam.noOfQuestions or default to 100
      const targetCount = exam.noOfQuestions || 100;

      // Shuffle and pick
      questionIdsToConnect = questions
        .sort(() => 0.5 - Math.random())
        .slice(0, targetCount)
        .map((q) => ({ id: q.id }));
    }

    if (questionIdsToConnect.length === 0) {
      throw new BadRequestException(
        'Cannot create a test with zero questions. Please provide questionIds or ensure the exam subjects have questions.',
      );
    }

    const test = await this.prisma.test.create({
      data: {
        name,
        examId,
        questions: {
          connect: questionIdsToConnect,
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

    await this.invalidateCache();
    return test;
  }

  findAll(cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
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
      take: safeTake,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
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

  async update(id: number, updateTestDto: UpdateTestDto) {
    const test = await this.prisma.test.update({
      where: { id },
      data: {
        name: updateTestDto.name,
        examId: updateTestDto.examId,
      },
    });
    await this.invalidateCache();
    return test;
  }

  async remove(id: number) {
    const test = await this.prisma.test.delete({
      where: { id },
    });
    await this.invalidateCache();
    return test;
  }
}
