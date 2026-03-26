import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) { }

  async create(createTestDto: CreateTestDto) {
    const { name, examId, questionIds: manualQuestionIds } = createTestDto;

    let questionIdsToConnect: { id: number }[] = [];

    if (manualQuestionIds && manualQuestionIds.length > 0) {
      // Manual assignment (verify existence)
      const existingQuestions = await this.prisma.question.findMany({
        where: { id: { in: manualQuestionIds } },
        select: { id: true }
      });

      if (existingQuestions.length !== manualQuestionIds.length) {
        const existingIds = existingQuestions.map(q => q.id);
        const missingIds = manualQuestionIds.filter(id => !existingIds.includes(id));
        throw new BadRequestException(`Some question IDs do not exist: ${missingIds.join(', ')}`);
      }

      questionIdsToConnect = manualQuestionIds.map(id => ({ id }));
    } else {
      // Auto-generation logic (fetch subjects associated with this exam)
      const exam = await this.prisma.exam.findUnique({
        where: { id: examId },
        include: { subjects: true }
      });

      if (!exam) throw new BadRequestException('Exam not found');

      if (!exam.subjects || exam.subjects.length === 0) {
        throw new BadRequestException('This exam has no associated subjects and no manual questionIds provided. Please add subjects to the exam or provide questionIds.');
      }

      // Get all subjects associated with this exam
      const subjectIds = exam.subjects.map(s => s.id);

      // Fetch all questions for these subjects
      const questions = await this.prisma.question.findMany({
        where: { subjectId: { in: subjectIds } },
        select: { id: true }
      });

      if (questions.length === 0) {
        throw new BadRequestException('No questions found for the subjects associated with this exam. Please add questions to the subjects first.');
      }

      // Target count: exam.noOfQuestions or default to 100
      const targetCount = exam.noOfQuestions || 100;
      
      // Shuffle and pick
      questionIdsToConnect = questions
        .sort(() => 0.5 - Math.random())
        .slice(0, targetCount)
        .map(q => ({ id: q.id }));
    }

    if (questionIdsToConnect.length === 0) {
      throw new BadRequestException('Cannot create a test with zero questions. Please provide questionIds or ensure the exam subjects have questions.');
    }

    return this.prisma.test.create({
      data: {
        name,
        examId,
        questions: {
          connect: questionIdsToConnect
        }
      },
      include: {
        questions: {
          select: { id: true }
        },
        exam: true
      }
    });
  }

  findAll() {
    return this.prisma.test.findMany({
      include: {
        exam: true,
        _count: {
          select: { questions: true }
        }
      },
      take: 50,
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: number) {
    return this.prisma.test.findUnique({
      where: { id },
      include: {
        exam: true,
        questions: true
      }
    });
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return this.prisma.test.update({
      where: { id },
      data: updateTestDto as any
    });
  }

  remove(id: number) {
    return this.prisma.test.delete({
      where: { id }
    });
  }
}
