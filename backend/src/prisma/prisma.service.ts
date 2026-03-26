import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    // ✅ Production: Monitor slow queries (> 200ms)
    (this as any).$on('query', (e: any) => {
      if (e.duration >= 200) {
        this.logger.warn(`Slow Query: ${e.query} [${e.duration}ms]`);
      }
    });

    // ⚠️ Scalability Hint: For 1M+ users, use PgBouncer for connection pooling
    // ⚠️ Scalability Hint: Implement Read Replicas and use a separate Prisma client for read-only queries
    console.log('PrismaService initialized with DATABASE_URL:', process.env.DATABASE_URL ? (process.env.DATABASE_URL.substring(0, 15) + '...') : 'undefined');
  }

    async onModuleInit() {
        console.log('PrismaService connecting...');
        try {
            await this.$connect();
            console.log('PrismaService connected!');
        } catch (error) {
            console.error('PrismaService connection failed:', error);
            throw error;
        }
    }
}
