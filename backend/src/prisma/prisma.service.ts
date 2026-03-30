import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    console.log(
      'PrismaService initialized with DATABASE_URL:',
      process.env.DATABASE_URL
        ? process.env.DATABASE_URL.substring(0, 15) + '...'
        : 'undefined',
    );
  }

  async onModuleInit() {
    console.log('PrismaService connecting...');

    // Performance Logging Middleware
    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      console.log(
        `[PRISMA] Query: ${params.model}.${params.action} took ${after - before}ms`,
      );
      return result;
    });

    try {
      await this.$connect();
      console.log('PrismaService connected!');
    } catch (error) {
      console.error('PrismaService connection failed:', error);
      throw error;
    }
  }
}
