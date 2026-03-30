"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _appcontroller = require("./app.controller");
const _appservice = require("./app.service");
const _prismamodule = require("./prisma/prisma.module");
const _authmodule = require("./auth/auth.module");
const _usermodule = require("./user/user.module");
const _jobmodule = require("./job/job.module");
const _exammodule = require("./exam/exam.module");
const _testmodule = require("./test/test.module");
const _questionmodule = require("./question/question.module");
const _resultmodule = require("./result/result.module");
const _adminmodule = require("./admin/admin.module");
const _subscriptionmodule = require("./subscription/subscription.module");
const _pypmodule = require("./pyp/pyp.module");
const _subjectmodule = require("./subject/subject.module");
const _applicationmodule = require("./application/application.module");
const _categorymodule = require("./category/category.module");
const _mocktestmodule = require("./mock-test/mock-test.module");
const _careerreadinessmodule = require("./career-readiness/career-readiness.module");
const _paymentmodule = require("./payment/payment.module");
const _referralmodule = require("./referral/referral.module");
const _studyplanmodule = require("./modules/study-plan/study-plan.module");
const _aimodule = require("./ai/ai.module");
const _languagemiddleware = require("./middleware/language.middleware");
const _arthamodule = require("./modules/artha/artha.module");
const _careeraimodule = require("./modules/career-ai/career-ai.module");
const _cachemanager = require("@nestjs/cache-manager");
const _cachemanagerredisyet = /*#__PURE__*/ _interop_require_wildcard(require("cache-manager-redis-yet"));
const _bullmq = require("@nestjs/bullmq");
const _loggermodule = require("./logger/logger.module");
const _nestjsprometheus = require("@willsoto/nestjs-prometheus");
const _throttler = require("@nestjs/throttler");
const _core = require("@nestjs/core");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(_languagemiddleware.LanguageMiddleware).forRoutes('*');
    }
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                isGlobal: true
            }),
            _nestjsprometheus.PrometheusModule.register(),
            _throttler.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100
                }
            ]),
            _cachemanager.CacheModule.register({
                isGlobal: true,
                store: _cachemanagerredisyet.redisStore,
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                ttl: 600
            }),
            _bullmq.BullModule.forRoot({
                connection: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379')
                }
            }),
            _prismamodule.PrismaModule,
            _authmodule.AuthModule,
            _usermodule.UserModule,
            _jobmodule.JobModule,
            _exammodule.ExamModule,
            _testmodule.TestModule,
            _questionmodule.QuestionModule,
            _resultmodule.ResultModule,
            _adminmodule.AdminModule,
            _subscriptionmodule.SubscriptionModule,
            _pypmodule.PypModule,
            _subjectmodule.SubjectModule,
            _applicationmodule.ApplicationModule,
            _categorymodule.CategoryModule,
            _mocktestmodule.MockTestModule,
            _careerreadinessmodule.CareerReadinessModule,
            _paymentmodule.PaymentModule,
            _referralmodule.ReferralModule,
            _studyplanmodule.StudyPlanModule,
            _aimodule.AiModule,
            _arthamodule.ArthaModule,
            _careeraimodule.CareerAIModule,
            _loggermodule.LoggerModule
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService,
            {
                provide: _core.APP_GUARD,
                useClass: _throttler.ThrottlerGuard
            }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map