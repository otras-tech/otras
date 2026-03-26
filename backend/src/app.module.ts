import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { ExamModule } from './exam/exam.module';
import { TestModule } from './test/test.module';
import { QuestionModule } from './question/question.module';
import { ResultModule } from './result/result.module';
import { AdminModule } from './admin/admin.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PypModule } from './pyp/pyp.module';
import { SubjectModule } from './subject/subject.module';
import { ApplicationModule } from './application/application.module';
import { CategoryModule } from './category/category.module';
import { MockTestModule } from './mock-test/mock-test.module';
import { CareerReadinessModule } from './career-readiness/career-readiness.module';
import { PaymentModule } from './payment/payment.module';
import { ReferralModule } from './referral/referral.module';
import { StudyPlanModule } from './modules/study-plan/study-plan.module';
import { AiModule } from './ai/ai.module';
import { LanguageMiddleware } from './middleware/language.middleware';
import { ArthaModule } from './modules/artha/artha.module'
import { CareerAIModule } from './modules/career-ai/career-ai.module'
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { BullModule } from '@nestjs/bullmq';


@Module({
  imports: [
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
    // ✅ Production: Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20,
    }]),
    // ✅ Production: Redis Caching with Resilience
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        try {
          // ⚠️ Resilience: Check if we should disable Redis for local dev
          if (process.env.DISABLE_REDIS === 'true') {
            return { ttl: 600 };
          }
          return {
            store: await redisStore({
              url: process.env.REDIS_URL || 'redis://localhost:6379',
              ttl: 600,
            }),
          };
        } catch (err) {
          console.error('Redis Cache Initialization Failed, falling back to in-memory:', err.message);
          return { ttl: 600 }; // Fallback to memory store
        }
      },
    }),
    // ✅ Production: Background Queues (BullMQ)
    // ⚠️ Note: BullMQ requires a running Redis instance to function.
    // ⚠️ Resilience: Skip BullMQ for local development if DISABLE_REDIS is true
    ...(process.env.DISABLE_REDIS === 'true' ? [] : [
      BullModule.forRoot({
        connection: {
          host: (process.env.REDIS_HOST as string) || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      }),
    ]),
  ],

  controllers: [AppController],
  providers: [AppService],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
