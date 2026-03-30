import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { redisStore } from 'cache-manager-redis-yet';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { HealthModule } from './health/health.module';
import { RedisModule } from './common/redis/redis.module';
import { CustomCacheModule } from './common/cache/cache.module';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { JobModule } from './modules/job/job.module';
import { ExamModule } from './modules/exam/exam.module';
import { TestModule } from './modules/test/test.module';
import { QuestionModule } from './modules/question/question.module';
import { ResultModule } from './modules/result/result.module';
import { AdminModule } from './modules/admin/admin.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PypModule } from './modules/pyp/pyp.module';
import { SubjectModule } from './modules/subject/subject.module';
import { ApplicationModule } from './modules/application/application.module';
import { CategoryModule } from './modules/category/category.module';
import { MockTestModule } from './modules/mock-test/mock-test.module';
import { CareerReadinessModule } from './modules/career-readiness/career-readiness.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ReferralModule } from './modules/referral/referral.module';
import { StudyPlanModule } from './modules/study-plan/study-plan.module';
import { AiModule } from './modules/ai/ai.module';
import { ArthaModule } from './modules/artha/artha.module';
import { CareerAIModule } from './modules/career-ai/career-ai.module';

import { LanguageMiddleware } from './middleware/language.middleware';
import { validationSchema } from './config/validation';
import configuration from './config/configuration';

@Module({
  imports: [
    // ✅ Production: Configuration Management
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema,
    }),
    // ✅ Production: Logger Module (Extracted)
    LoggerModule,
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    JobModule,
    ExamModule,
    TestModule,
    QuestionModule,
    ResultModule,
    AdminModule,
    SubscriptionModule,
    PypModule,
    SubjectModule,
    ApplicationModule,
    CategoryModule,
    MockTestModule,
    CareerReadinessModule,
    PaymentModule,
    ReferralModule,
    StudyPlanModule,
    AiModule,
    ArthaModule,
    CareerAIModule,
    HealthModule,
    RedisModule,
    CustomCacheModule,
    // ✅ Production: Rate Limiting (Redis-backed for multi-instance consistency)
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isRedisDisabled = config.get('DISABLE_REDIS') === 'true' || config.get('DISABLE_REDIS') === true;
        const baseConfig = { throttlers: [{ ttl: 60000, limit: 100 }] };

        if (isRedisDisabled) {
          return baseConfig; // Default in-memory storage
        }

        try {
          const redisUrl = config.get('REDIS_URL') || 'redis://127.0.0.1:6379';
          return {
            ...baseConfig,
            storage: new ThrottlerStorageRedisService(redisUrl),
          };
        } catch (err) {
          console.warn('ThrottlerModule: Redis storage failed, falling back to in-memory', err);
          return baseConfig;
        }
      },
    }),
    // ✅ Production: Redis Caching with Resilience
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const disableRedisVal = config.get('DISABLE_REDIS');
        const isRedisDisabled = disableRedisVal === 'true' || disableRedisVal === true;
        if (isRedisDisabled) {
          return { ttl: 600 }; // In-memory fallback
        }
        try {
          const options: any = {
            url: config.get('REDIS_URL') || 'redis://127.0.0.1:6379',
            ttl: 600,
            retryStrategy: (times: number) => Math.min(times * 100, 3000)
          };
          const store = await redisStore(options);
          return {
            store,
          };
        } catch (err) {
          console.warn('CacheModule: Redis Cache failed to initialize, falling back to memory store', err);
          return { ttl: 600 };
        }
      },
    }),
    // ✅ Production: Background Queues (BullMQ) with Resilience
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isRedisDisabled = config.get('DISABLE_REDIS') === 'true';
        return {
          connection: {
            host: config.get('REDIS_HOST') || '127.0.0.1',
            port: parseInt(config.get('REDIS_PORT') || '6379'),
            enableOfflineQueue: false,
            lazyConnect: true,
            maxRetriesPerRequest: null, // Required for BullMQ
            retryStrategy: (times: number) => {
              if (isRedisDisabled) return null;
              if (times > 20) return null;
              return Math.min(times * 500, 5000);
            },
          },
          defaultJobOptions: {
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 50 },
            attempts: isRedisDisabled ? 0 : 5,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
