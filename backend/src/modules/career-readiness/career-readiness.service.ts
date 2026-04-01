import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SubjectBreakdown } from '../../common/types/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class CareerReadinessService {
  private readonly logger = new Logger(CareerReadinessService.name);

  constructor(private prisma: PrismaService) {}

  async saveResult(data: {
    otrId: string;
    testId: number | string;
    answers: { questionId: number | string; selectedOption: string }[];
  }) {
    const testId = Number(data.testId);
    if (isNaN(testId)) {
      throw new Error(`Invalid testId: ${data.testId}`);
    }

    this.logger.log(
      `Saving career readiness result for user ${data.otrId}, test ${testId}`,
    );

    // Fetch the test with questions and subjects
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: { subject: true },
        },
      },
    });

    if (!test) {
      this.logger.error(`Test ${testId} not found`);
      throw new NotFoundException(`Test with ID ${testId} not found`);
    }

    // Calculate subject-wise scores with +1 correct, -0.25 wrong
    const subjectBreakdown: SubjectBreakdown = {};

    let correctAnswers = 0;
    let wrongAnswers = 0;

    test.questions.forEach((q) => {
      const subjectName = q.subject?.name || 'General';
      if (!subjectBreakdown[subjectName]) {
        subjectBreakdown[subjectName] = {
          correct: 0,
          wrong: 0,
          unanswered: 0,
          total: 0,
          score: 0,
        };
      }
      subjectBreakdown[subjectName].total++;

      const userAns = data.answers.find((a) => Number(a.questionId) === q.id);
      if (userAns) {
        if (userAns.selectedOption === q.answer) {
          correctAnswers++;
          subjectBreakdown[subjectName].correct++;
          subjectBreakdown[subjectName].score += 1;
        } else {
          wrongAnswers++;
          subjectBreakdown[subjectName].wrong++;
          subjectBreakdown[subjectName].score -= 0.25;
        }
      } else {
        subjectBreakdown[subjectName].unanswered++;
      }
    });

    const totalMarks = test.questions.length;
    const negativeMarks = wrongAnswers * 0.25;
    const totalScore = correctAnswers - negativeMarks;

    // Safer check-then-act approach to avoid Prisma upsert naming issues
    try {
      this.logger.log(
        `Searching for existing score: otrId=${data.otrId}, testId=${testId}`,
      );
      const existing = await this.prisma.careerReadinessTestScore.findFirst({
        where: {
          otrId: data.otrId,
          testId: testId,
        },
      });

      const scoreData = {
        totalScore,
        totalMarks,
        correctAnswers,
        wrongAnswers,
        negativeMarks,
        subjectBreakdown: subjectBreakdown as unknown as Prisma.InputJsonValue,
      };

      if (existing) {
        this.logger.log(
          `EXISTING RECORD FOUND (id=${existing.id}). Updating...`,
        );
        return await this.prisma.careerReadinessTestScore.update({
          where: { id: existing.id },
          data: scoreData as Prisma.CareerReadinessTestScoreUpdateInput,
        });
      } else {
        this.logger.log(`NO EXISTING RECORD FOUND. Creating new record...`);
        return await this.prisma.careerReadinessTestScore.create({
          data: {
            otrId: data.otrId,
            testId: testId,
            ...scoreData,
          } as Prisma.CareerReadinessTestScoreUncheckedCreateInput,
        });
      }
    } catch (error) {
      this.logger.error(
        'CRITICAL ERROR in saveResult:',
        (error as Error).message,
      );
      this.logger.error('Error Stack:', (error as Error).stack);
      throw error;
    }
  }

  async getByOtrId(otrId: string) {
    return this.prisma.careerReadinessTestScore.findFirst({
      where: { otrId },
      include: { test: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
