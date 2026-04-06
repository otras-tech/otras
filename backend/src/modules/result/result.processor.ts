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
        // 3a. Update Result (Legacy JSON)
        await tx.result.update({
          where: { id: resultId },
          data: {
            score: totalScore,
            subjectBreakdown:
              subjectBreakdown as unknown as Prisma.InputJsonValue,
            submitTime: new Date(),
          },
        });

        // 3b. Relational Analytics: Map Subject Names to IDs and Bulk Insert
        const finalResultId = resultId as number;
        const subjectNames = Object.keys(subjectBreakdown);
        const subjects = await tx.subject.findMany({
          where: {
            name: { in: subjectNames, mode: 'insensitive' },
            isDeleted: false,
          },
          select: { id: true, name: true },
        });

        const subjectMap = new Map(
          subjects.map((s) => [s.name.toLowerCase(), s.id]),
        );

        const scoreData = Object.entries(subjectBreakdown)
          .map(([name, data]) => ({
            resultId: finalResultId,
            subjectId: subjectMap.get(name.toLowerCase()) || 0,
            correct: data.correct,
            wrong: data.wrong,
            score: data.score,
          }))
          .filter((s) => s.subjectId !== 0);

        if (scoreData.length > 0) {
          // ENSURE IDEMPOTENCY: Delete existing scores for this result if any
          await tx.subjectScore.deleteMany({ where: { resultId: finalResultId } });
          await tx.subjectScore.createMany({ data: scoreData });
        }




        // 3c. Artha Profile Update
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
