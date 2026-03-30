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
    (this as any).$on('query', (e: any) => {
      if (e.duration >= 200) {
        this.logger.warn(`Slow Query: ${e.query} [${e.duration}ms]`);
      }
    });
  }

  async onModuleInit() {
    this.logger.log('PrismaService connecting...');
    try {
      await this.$connect();
      this.logger.log('PrismaService connected successfully');
    } catch (error) {
      this.logger.error('PrismaService connection failed', error.stack);
      throw error;
    }
  }
}
