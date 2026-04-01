import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);
  private readonly BATCH_SIZE = 1000;

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  /**
   * Daily job to clean up expired refresh tokens.
   * Runs every day at midnight.
   *
   * Production safety features:
   * 1. Distributed lock — only one instance runs cleanup across cluster
   * 2. Batch deletion — processes 1000 records per loop to avoid DB load spikes
   * 3. Index-backed — uses @@index([expiresAt]) on RefreshToken model
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleTokenCleanup() {
    const lockKey = 'cron:token-cleanup';
    const lockTtl = 300_000; // 5 minutes — enough for large tables

    // Acquire distributed lock so only one instance runs this cron
    const lockValue = await this.redisService.acquireLock(lockKey, lockTtl);
    if (!lockValue) {
      this.logger.log(
        'Token cleanup already running on another instance. Skipping.',
      );
      return;
    }

    this.logger.log('Starting expired token cleanup job (batch mode)...');
    let totalDeleted = 0;

    try {
      const now = new Date();

      // Loop: find and delete in batches to avoid table-locking mega-DELETEs
      while (true) {
        const expiredBatch = await this.prisma.refreshToken.findMany({
          where: { expiresAt: { lt: now } },
          select: { id: true },
          take: this.BATCH_SIZE,
        });

        if (expiredBatch.length === 0) break;

        const ids = expiredBatch.map((t) => t.id);
        const result = await this.prisma.refreshToken.deleteMany({
          where: { id: { in: ids } },
        });

        totalDeleted += result.count;
        this.logger.log(
          `Batch deleted ${result.count} tokens (total: ${totalDeleted})`,
        );

        // If batch was smaller than limit, we're done
        if (expiredBatch.length < this.BATCH_SIZE) break;
      }

      this.logger.log(
        `Cleanup complete. Total deleted: ${totalDeleted} expired tokens.`,
      );
    } catch (error) {
      this.logger.error(
        `Error during token cleanup job (deleted ${totalDeleted} before failure):`,
        error,
      );
    } finally {
      await this.redisService.releaseLock(lockKey, lockValue);
    }
  }
}
