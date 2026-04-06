import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ResultRepository } from './repository/result.repository';
import { SubmitTestDto, StartTestDto } from './dto/result.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ResultProcessor } from './result.processor';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class ResultService {
  private readonly logger = new Logger(ResultService.name);

  constructor(
    @InjectQueue('result-calculation') private readonly resultQueue: Queue,
    private readonly resultRepository: ResultRepository,
    private readonly resultProcessor: ResultProcessor,
    private readonly cacheService: CacheService,
  ) {}


  /**
   * Ownership enforced: user can only start tests for themselves.
   */
  async startTest(requesterId: number, userId: number, testId: number, tier?: number) {
    if (requesterId !== userId) {
      throw new ForbiddenException('Cannot start test for another user');
    }
    try {
      return await this.resultRepository.createPlaceholder(userId, testId, tier);
    } catch {
      throw new InternalServerErrorException('Failed to start test');
    }
  }

  /**
   * Ownership enforced: user can only submit for themselves.
   */
  async calculateAndSave(requesterId: number, dto: SubmitTestDto) {
    if (requesterId !== dto.userId) {
      throw new ForbiddenException('Cannot submit test for another user');
    }

    const { userId, testId, answers, tier, resultId } = dto;

    try {
      let finalResultId = resultId;
      if (!finalResultId) {
        const placeholder = await this.resultRepository.createPlaceholder(userId, testId, tier);
        finalResultId = placeholder.id;
      }

      if (process.env.DISABLE_REDIS === 'true') {
        this.logger.log(
          `Processing result sync for User: ${userId}, Result ID: ${finalResultId}`,
        );
        await this.resultProcessor.calculateAndSave({ ...dto, resultId: finalResultId });
        return {
          message: 'Result processed synchronously (Redis disabled).',
          resultId: finalResultId,
        };
      }

      await this.resultQueue.add(
        'processResult',
        { ...dto, resultId: finalResultId },
        {
          jobId: `result_${finalResultId}`,
          attempts: 5,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 1000 },
        },
      );

      this.logger.log(
        `Result submission queued for User: ${userId}, Result ID: ${finalResultId}`,
      );

      return {
        message:
          'Your submission is being processed. Results will be available shortly.',
        resultId: finalResultId,
      };
    } catch (error: any) {
      if (error instanceof ForbiddenException) throw error;
      this.logger.error(`Error processing result: ${error.message}`);
      throw new InternalServerErrorException('Error processing test submission');
    }
  }

  /**
   * Ownership enforced: user can only view their own results
   * (except when called internally from UserService).
   */
  async getUserResults(userId: number, cursor?: number, take?: number) {
    const cacheKey = `user_results:${userId}:${cursor || 'start'}:${take || 20}`;
    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        try {
          return await this.resultRepository.findByUserId(userId, cursor, take);
        } catch {
          throw new InternalServerErrorException('Could not fetch results');
        }
      },
      60000, // 1 minute cache (short lived as these are high-impact)
    );
  }


  async checkOwnership(resultId: number, userId: number): Promise<boolean> {
    return this.resultRepository.checkOwnership(resultId, userId);
  }
}
