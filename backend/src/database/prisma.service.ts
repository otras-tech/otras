import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });

    // ✅ Production: Monitor slow queries (> 200ms)
    // ✅ Production: Monitor slow queries (> 200ms) with structured logging
    this.$on('query' as never, (e: { duration: number; query: string; params: string; target: string }) => {
      if (e.duration >= 200) {
        this.logger.warn({
          msg: `Slow Query Detected`,
          duration: `${e.duration}ms`,
          query: e.query,
          params: e.params,
        });
      }
    });
  }

  async onModuleInit() {
    this.logger.log('PrismaService connecting...');
    try {
      await this.$connect();
      this.logger.log('PrismaService connected successfully');
    } catch (error: any) {
      this.logger.error('PrismaService connection failed', error.stack);
      throw error;
    }
  }
}
