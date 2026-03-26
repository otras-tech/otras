import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CareerReadinessService {
  private readonly logger = new Logger(CareerReadinessService.name);

  constructor(private prisma: PrismaService) {}

  async saveResult(data: {
    otrId: string;
    testId: any;
    answers: { questionId: any; selectedOption: string }[];
  }) {
    const testId = Number(data.testId);
    if (isNaN(testId)) {
      throw new Error(`Invalid testId: ${data.testId}`);
    }

    this.logger.log(`Saving career readiness result for user ${data.otrId}, test ${testId}`);

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
    const subjectBreakdown: Record<string, { correct: number; wrong: number; unanswered: number; total: number; score: number }> = {};

    let correctAnswers = 0;
    let wrongAnswers = 0;

    test.questions.forEach((q) => {
      const subjectName = q.subject?.name || 'General';
      if (!subjectBreakdown[subjectName]) {
        subjectBreakdown[subjectName] = { correct: 0, wrong: 0, unanswered: 0, total: 0, score: 0 };
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
      this.logger.log(`Searching for existing score: otrId=${data.otrId}, testId=${testId}`);
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
        subjectBreakdown: subjectBreakdown as any,
      };

      if (existing) {
        this.logger.log(`EXISTING RECORD FOUND (id=${(existing as any).id}). Updating...`);
        return await this.prisma.careerReadinessTestScore.update({
          where: { id: (existing as any).id } as any,
          data: scoreData,
        });
      } else {
        this.logger.log(`NO EXISTING RECORD FOUND. Creating new record...`);
        return await this.prisma.careerReadinessTestScore.create({
          data: {
            otrId: data.otrId,
            testId: testId,
            ...scoreData,
          },
        });
      }
    } catch (error) {
      this.logger.error('CRITICAL ERROR in saveResult:', error.message);
      this.logger.error('Error Stack:', error.stack);
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
