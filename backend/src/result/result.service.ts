import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService) {}

  async startTest(userId: number, testId: number, tier?: number) {
    return this.prisma.result.create({
      data: {
        userId,
        testId,
        tier,
        startTime: new Date(),
        score: 0, // Placeholder
        subjectBreakdown: {}, // Placeholder
      },
    });
  }

  async calculateAndSave(
    userId: number,
    testId: number,
    answers: any[],
    tier?: number,
    resultId?: number,
  ) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: { subject: true },
        },
      },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    const subjectBreakdown: any = {};

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

      const userAns = answers.find((a) => a.questionId === q.id);
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

    const totalScore = correctAnswers - wrongAnswers * 0.25;

    let result;
    if (resultId) {
      result = await this.prisma.result.update({
        where: { id: resultId },
        data: {
          score: totalScore,
          subjectBreakdown: subjectBreakdown,
          submitTime: new Date(),
        },
        include: { test: true },
      });
    } else {
      // Fallback for direct submission without start
      result = await this.prisma.result.create({
        data: {
          userId,
          testId,
          tier,
          score: totalScore,
          subjectBreakdown: subjectBreakdown,
          startTime: new Date(), // Set as now if no start recorded
          submitTime: new Date(),
        },
        include: { test: true },
      });
    }

    const newResult = result;

    // Update ARTHA Engine progress if tier is specified
    if (tier === 2 || tier === 3) {
      const profile = await this.prisma.arthaProfile.findFirst({
        where: { userId: userId.toString() },
      });
      if (profile) {
        await this.prisma.arthaProfile.update({
          where: { id: profile.id },
          data: {
            [`tier${tier}Progress`]: 100,
          },
        });
      }
    }

    return newResult;
  }

  async getUserResults(userId: number) {
    return this.prisma.result.findMany({
      where: { userId },
      include: {
        test: {
          include: {
            _count: {
              select: { questions: true },
            },
          },
        },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }
}
