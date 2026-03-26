"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const ai_controller_1 = require("./ai.controller");
const provider_factory_1 = require("../providers/provider.factory");
const openai_provider_1 = require("../providers/openai.provider");
const mistral_provider_1 = require("../providers/mistral.provider");
const llama_provider_1 = require("../providers/llama.provider");
const roadmap_service_1 = require("../modules/roadmap/roadmap.service");
const career_service_1 = require("../modules/career-guidance/career.service");
const eligibility_service_1 = require("../modules/eligibility-explainer/eligibility.service");
const performance_service_1 = require("../modules/performance/performance.service");
const burnout_service_1 = require("../modules/burnout/burnout.service");
const report_service_1 = require("../modules/report/report.service");
const intelligence_service_1 = require("../modules/artha/intelligence.service");
const model_router_service_1 = require("../orchestrator/model-router.service");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        providers: [
            ai_service_1.AiService,
            model_router_service_1.ModelRouterService,
            roadmap_service_1.RoadmapService,
            career_service_1.CareerService,
            eligibility_service_1.EligibilityService,
            performance_service_1.PerformanceService,
            burnout_service_1.BurnoutService,
            report_service_1.ReportService,
            intelligence_service_1.IntelligenceService,
            openai_provider_1.OpenAIProvider,
            mistral_provider_1.MistralProvider,
            llama_provider_1.LlamaProvider,
            provider_factory_1.ProviderFactory,
        ],
        controllers: [ai_controller_1.AiController],
        exports: [ai_service_1.AiService, model_router_service_1.ModelRouterService],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map