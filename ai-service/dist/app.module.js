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
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const openai_config_1 = require("./config/openai.config");
const mistral_config_1 = require("./config/mistral.config");
const llama_config_1 = require("./config/llama.config");
const ai_config_1 = require("./config/ai.config");
const ai_module_1 = require("./ai/ai.module");
const career_ai_module_1 = require("./modules/career-ai/career-ai.module");
const study_plan_module_1 = require("./modules/study-plan/study-plan.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    openai_config_1.default,
                    mistral_config_1.default,
                    llama_config_1.default,
                    ai_config_1.default
                ],
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 10,
                }]),
            ai_module_1.AiModule,
            career_ai_module_1.CareerAiModule,
            study_plan_module_1.StudyPlanModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map