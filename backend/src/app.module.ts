import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { ArthaModule } from './modules/artha/artha.module';
import { CareerAIModule } from './modules/career-ai/career-ai.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-yet';
import { BullModule } from '@nestjs/bullmq';
import { LoggerModule } from './logger/logger.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrometheusModule.register(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      store: redisStore.redisStore as any,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      ttl: 600, // 10 minutes cache
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
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
    LoggerModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
