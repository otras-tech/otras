import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
import { Logger } from '@nestjs/common';
import { SubjectBreakdown, ResultJobData } from '../../common/types/types';
import { Prisma } from '@prisma/client';

@Processor('result-calculation')
export class ResultProcessor extends WorkerHost {
  private readonly logger = new Logger(ResultProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<ResultJobData>): Promise<void> {
    return this.calculateAndSave(job.data, job.id);
  }

  async calculateAndSave(data: ResultJobData, jobId?: string): Promise<void> {
    const { userId, testId, answers, tier, resultId } = data;
    this.logger.log(
      `Processing result for User: ${userId}, Test: ${testId}${jobId ? ` (Job: ${jobId})` : ' (Sync)'}`,
    );

    const existing = await this.prisma.result.findUnique({
      where: { id: resultId },
      select: { submitTime: true },
    });

    if (existing?.submitTime) {
      this.logger.log(`Result ${resultId} already processed. Skipping.`);
      return;
    }

    try {
      // 1. Fetch test with minimal fields
      const test = await this.prisma.test.findUnique({
        where: { id: testId, isDeleted: false },
        select: {
          questions: {
            select: {
              id: true,
              answer: true,
              subject: { select: { name: true } },
            },
          },
        },
      });

      if (!test) throw new Error('Test not found');

      // 2. Optimized calculation: O(N+M)
      const answerMap = new Map<number, string>(
        answers.map((a) => [a.questionId, a.selectedOption]),
      );

      let correctAnswers = 0;
      let wrongAnswers = 0;
      const subjectBreakdown: SubjectBreakdown = {};

      test.questions.forEach((q) => {
        const subjectName = q.subject?.name || 'General';
        subjectBreakdown[subjectName] = subjectBreakdown[subjectName] || {
          correct: 0,
          wrong: 0,
          unanswered: 0,
          total: 0,
          score: 0,
        };
        subjectBreakdown[subjectName].total++;

        const userAns = answerMap.get(q.id);
        if (userAns !== undefined) {
          if (userAns === q.answer) {
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

      // 3. Update result and profile in a transaction
      await this.prisma.$transaction(async (tx) => {
        await tx.result.update({
          where: { id: resultId },
          data: {
            score: totalScore,
            subjectBreakdown:
              subjectBreakdown as unknown as Prisma.InputJsonValue,
            submitTime: new Date(),
          },
        });

        if (tier === 2 || tier === 3) {
          const profile = await tx.arthaProfile.findFirst({
            where: { userId: userId.toString() },
            select: { id: true },
          });
          if (profile) {
            await tx.arthaProfile.update({
              where: { id: profile.id },
              data: { [`tier${tier}Progress`]: 100 },
            });
          }
        }
      });

      this.logger.log(
        `Successfully processed result${jobId ? ` for Job ID: ${jobId}` : ''}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process result: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
