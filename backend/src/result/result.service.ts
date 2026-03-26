import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitTestDto, StartTestDto } from './dto/result.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ResultProcessor } from './result.processor';

@Injectable()
export class ResultService {
  private readonly logger = new Logger(ResultService.name);

  constructor(
    @InjectQueue('result-calculation') private readonly resultQueue: Queue,
    private readonly prisma: PrismaService,
    private readonly resultProcessor: ResultProcessor,
  ) { }

  // ✅ Optimized: Using select and basic start tracking
  async startTest(userId: number, testId: number, tier?: number) {
    try {
      return await this.prisma.result.create({
        data: {
          userId,
          testId,
          tier,
          startTime: new Date(),
          score: 0,
          subjectBreakdown: {},
        },
        select: { id: true, startTime: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to start test');
    }
  }

  // ✅ Production: Offload to background queue (or sync if Redis disabled)
  async calculateAndSave(dto: SubmitTestDto) {
    const { userId, testId, answers, tier, resultId } = dto;

    try {
      // 1. Create a placeholder result if it doesn't exist (e.g. direct submission)
      let finalResultId = resultId;
      if (!finalResultId) {
        const placeholder = await this.prisma.result.create({
          data: {
            userId,
            testId,
            tier,
            score: 0,
            subjectBreakdown: {},
            startTime: new Date(),
          },
          select: { id: true },
        });
        finalResultId = placeholder.id;
      }

      // 2. Handle resilience: Synchronous fallback for local development
      if (process.env.DISABLE_REDIS === 'true') {
        this.logger.log(`Processing result sync for User: ${userId}, Result ID: ${finalResultId}`);
        await this.resultProcessor.calculateAndSave({ ...dto, resultId: finalResultId });
        return {
          message: 'Result processed synchronously (Redis disabled).',
          resultId: finalResultId,
        };
      }

      // 3. ⚠️ Heavy task moved to queue for background processing
      await this.resultQueue.add(
        'processResult',
        { ...dto, resultId: finalResultId },
        { 
          attempts: 3, 
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: true 
        },
      );

      this.logger.log(`Result submission queued for User: ${userId}, Result ID: ${finalResultId}`);

      return {
        message: 'Your submission is being processed. Results will be available shortly.',
        resultId: finalResultId,
      };
    } catch (error) {
      this.logger.error(`Error processing result: ${error.message}`);
      throw new InternalServerErrorException('Error processing test submission');
    }
  }

  // ✅ Optimized: Paginated and lean fetching
  async getUserResults(userId: number, cursor?: number) {
    try {
      return await this.prisma.result.findMany({
        where: { userId, isDeleted: false },
        take: 20,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          score: true,
          submitTime: true,
          subjectBreakdown: true,
          createdAt: true,
          test: {
            select: {
              name: true,
              _count: { select: { questions: true } },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Could not fetch results');
    }
  }

  // ✅ Production: Authorization Helper
  async checkOwnership(resultId: number, userId: number): Promise<boolean> {
    const result = await this.prisma.result.findUnique({
      where: { id: resultId },
      select: { userId: true },
    });
    return result?.userId === userId;
  }
}
