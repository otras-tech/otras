import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('result-calculation')
export class ResultProcessor extends WorkerHost {
  private readonly logger = new Logger(ResultProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    return this.calculateAndSave(job.data, job.id);
  }

  async calculateAndSave(data: any, jobId?: string): Promise<any> {
    const { userId, testId, answers, tier, resultId } = data;
    this.logger.log(`Processing result for User: ${userId}, Test: ${testId}${jobId ? ` (Job: ${jobId})` : ' (Sync)'}`);

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
        answers.map((a: any) => [a.questionId, a.selectedOption]),
      );

      let correctAnswers = 0;
      let wrongAnswers = 0;
      const subjectBreakdown: Record<string, any> = {};

      test.questions.forEach((q) => {
        const subjectName = q.subject?.name || 'General';
        subjectBreakdown[subjectName] = subjectBreakdown[subjectName] || { correct: 0, wrong: 0, unanswered: 0, total: 0, score: 0 };
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
            subjectBreakdown,
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

      this.logger.log(`Successfully processed result${jobId ? ` for Job ID: ${jobId}` : ''}`);
    } catch (error) {
      this.logger.error(`Failed to process result: ${error.message}`);
      throw error; 
    }
  }
}

