"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const bullmq_1 = require("@nestjs/bullmq");
const throttler_1 = require("@nestjs/throttler");
const cache_manager_1 = require("@nestjs/cache-manager");
const throttler_storage_redis_1 = require("@nest-lab/throttler-storage-redis");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./database/prisma.module");
const logger_module_1 = require("./logger/logger.module");
const health_module_1 = require("./health/health.module");
const redis_module_1 = require("./common/redis/redis.module");
const cache_module_1 = require("./common/cache/cache.module");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const job_module_1 = require("./modules/job/job.module");
const exam_module_1 = require("./modules/exam/exam.module");
const test_module_1 = require("./modules/test/test.module");
const question_module_1 = require("./modules/question/question.module");
const result_module_1 = require("./modules/result/result.module");
const admin_module_1 = require("./modules/admin/admin.module");
const subscription_module_1 = require("./modules/subscription/subscription.module");
const pyp_module_1 = require("./modules/pyp/pyp.module");
const subject_module_1 = require("./modules/subject/subject.module");
const application_module_1 = require("./modules/application/application.module");
const category_module_1 = require("./modules/category/category.module");
const mock_test_module_1 = require("./modules/mock-test/mock-test.module");
const career_readiness_module_1 = require("./modules/career-readiness/career-readiness.module");
const payment_module_1 = require("./modules/payment/payment.module");
const referral_module_1 = require("./modules/referral/referral.module");
const study_plan_module_1 = require("./modules/study-plan/study-plan.module");
const ai_module_1 = require("./modules/ai/ai.module");
const artha_module_1 = require("./modules/artha/artha.module");
const career_ai_module_1 = require("./modules/career-ai/career-ai.module");
const language_middleware_1 = require("./middleware/language.middleware");
const validation_1 = require("./config/validation");
const configuration_1 = __importDefault(require("./config/configuration"));
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(language_middleware_1.LanguageMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                load: [configuration_1.default],
                validationSchema: validation_1.validationSchema,
            }),
            logger_module_1.LoggerModule,
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            job_module_1.JobModule,
            exam_module_1.ExamModule,
            test_module_1.TestModule,
            question_module_1.QuestionModule,
            result_module_1.ResultModule,
            admin_module_1.AdminModule,
            subscription_module_1.SubscriptionModule,
            pyp_module_1.PypModule,
            subject_module_1.SubjectModule,
            application_module_1.ApplicationModule,
            category_module_1.CategoryModule,
            mock_test_module_1.MockTestModule,
            career_readiness_module_1.CareerReadinessModule,
            payment_module_1.PaymentModule,
            referral_module_1.ReferralModule,
            study_plan_module_1.StudyPlanModule,
            ai_module_1.AiModule,
            artha_module_1.ArthaModule,
            career_ai_module_1.CareerAIModule,
            health_module_1.HealthModule,
            redis_module_1.RedisModule,
            cache_module_1.CustomCacheModule,
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const isRedisDisabled = config.get('DISABLE_REDIS') === 'true' || config.get('DISABLE_REDIS') === true;
                    const baseConfig = { throttlers: [{ ttl: 60000, limit: 100 }] };
                    if (isRedisDisabled) {
                        return baseConfig;
                    }
                    try {
                        const redisUrl = config.get('REDIS_URL') || 'redis://127.0.0.1:6379';
                        return {
                            ...baseConfig,
                            storage: new throttler_storage_redis_1.ThrottlerStorageRedisService(redisUrl),
                        };
                    }
                    catch (err) {
                        console.warn('ThrottlerModule: Redis storage failed, falling back to in-memory', err);
                        return baseConfig;
                    }
                },
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => {
                    const disableRedisVal = config.get('DISABLE_REDIS');
                    const isRedisDisabled = disableRedisVal === 'true' || disableRedisVal === true;
                    if (isRedisDisabled) {
                        return { ttl: 600 };
                    }
                    try {
                        const options = {
                            url: config.get('REDIS_URL') || 'redis://127.0.0.1:6379',
                            ttl: 600,
                            retryStrategy: (times) => Math.min(times * 100, 3000)
                        };
                        const store = await (0, cache_manager_redis_yet_1.redisStore)(options);
                        return {
                            store,
                        };
                    }
                    catch (err) {
                        console.warn('CacheModule: Redis Cache failed to initialize, falling back to memory store', err);
                        return { ttl: 600 };
                    }
                },
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const isRedisDisabled = config.get('DISABLE_REDIS') === 'true';
                    return {
                        connection: {
                            host: config.get('REDIS_HOST') || '127.0.0.1',
                            port: parseInt(config.get('REDIS_PORT') || '6379'),
                            enableOfflineQueue: false,
                            lazyConnect: true,
                            maxRetriesPerRequest: null,
                            retryStrategy: (times) => {
                                if (isRedisDisabled)
                                    return null;
                                if (times > 20)
                                    return null;
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
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map