import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Daily Cleanup of Expired Refresh Tokens
   * Runs at midnight every day.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredTokensCleanup() {
    this.logger.log('Starting daily cleanup of expired refresh tokens...');

    try {
      const now = new Date();
      const result = await this.prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      });

      this.logger.log(
        `Cleanup completed. Removed ${result.count} expired tokens.`,
      );
    } catch (error: any) {
      this.logger.error(`Error during token cleanup: ${error.message}`);
    }
  }

  /**
   * Weekly Cleanup of Deleted Records (Soft Delete Maintenance)
   * Runs at 3 AM every Sunday.
   * Only deletes records marked as isDeleted: true that are older than 30 days.
   */
  @Cron(CronExpression.EVERY_WEEKEND)
  async handleSoftDeleteCleanup() {
    this.logger.log('Starting weekly cleanup of soft-deleted records...');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      // Example for Results table (high growth)
      const results = await this.prisma.result.deleteMany({
        where: {
          isDeleted: true,
          updatedAt: { lt: thirtyDaysAgo },
        },
      });

      this.logger.log(
        `Cleanup completed. Removed ${results.count} soft-deleted results.`,
      );
    } catch (error: any) {
      this.logger.error(`Error during soft-delete cleanup: ${error.message}`);
    }
  }
}
