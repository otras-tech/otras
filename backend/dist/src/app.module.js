"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const job_module_1 = require("./job/job.module");
const exam_module_1 = require("./exam/exam.module");
const test_module_1 = require("./test/test.module");
const question_module_1 = require("./question/question.module");
const result_module_1 = require("./result/result.module");
const admin_module_1 = require("./admin/admin.module");
const subscription_module_1 = require("./subscription/subscription.module");
const pyp_module_1 = require("./pyp/pyp.module");
const subject_module_1 = require("./subject/subject.module");
const application_module_1 = require("./application/application.module");
const category_module_1 = require("./category/category.module");
const mock_test_module_1 = require("./mock-test/mock-test.module");
const career_readiness_module_1 = require("./career-readiness/career-readiness.module");
const payment_module_1 = require("./payment/payment.module");
const referral_module_1 = require("./referral/referral.module");
const study_plan_module_1 = require("./modules/study-plan/study-plan.module");
const ai_module_1 = require("./ai/ai.module");
const language_middleware_1 = require("./middleware/language.middleware");
const artha_module_1 = require("./modules/artha/artha.module");
const career_ai_module_1 = require("./modules/career-ai/career-ai.module");
const throttler_1 = require("@nestjs/throttler");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const bullmq_1 = require("@nestjs/bullmq");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(language_middleware_1.LanguageMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
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
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 20,
                }]),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: async () => {
                    try {
                        if (process.env.DISABLE_REDIS === 'true') {
                            return { ttl: 600 };
                        }
                        return {
                            store: await (0, cache_manager_redis_yet_1.redisStore)({
                                url: process.env.REDIS_URL || 'redis://localhost:6379',
                                ttl: 600,
                            }),
                        };
                    }
                    catch (err) {
                        console.error('Redis Cache Initialization Failed, falling back to in-memory:', err.message);
                        return { ttl: 600 };
                    }
                },
            }),
            ...(process.env.DISABLE_REDIS === 'true' ? [] : [
                bullmq_1.BullModule.forRoot({
                    connection: {
                        host: process.env.REDIS_HOST || 'localhost',
                        port: parseInt(process.env.REDIS_PORT || '6379'),
                    },
                }),
            ]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map