"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const roadmap_service_1 = require("../modules/roadmap/roadmap.service");
const career_service_1 = require("../modules/career-guidance/career.service");
const eligibility_service_1 = require("../modules/eligibility-explainer/eligibility.service");
const performance_service_1 = require("../modules/performance/performance.service");
const burnout_service_1 = require("../modules/burnout/burnout.service");
const report_service_1 = require("../modules/report/report.service");
const intelligence_service_1 = require("../modules/artha/intelligence.service");
const runAIService_1 = require("../utils/runAIService");
let AiController = class AiController {
    constructor(roadmap, career, eligibility, performance, burnout, report, intelligence) {
        this.roadmap = roadmap;
        this.career = career;
        this.eligibility = eligibility;
        this.performance = performance;
        this.burnout = burnout;
        this.report = report;
        this.intelligence = intelligence;
    }
    roadmapGen(body) {
        return this.roadmap.generate(body);
    }
    careerGen(body) {
        return this.career.generate(body);
    }
    eligibilityGen(body) {
        return this.eligibility.generate(body);
    }
    performanceGen(body) {
        return this.performance.generate(body);
    }
    burnoutGen(body) {
        return this.burnout.generate(body);
    }
    reportGen(body) {
        return this.report.generate(body);
    }
    intelligenceGen(body) {
        console.log("AI_SERVICE: Incoming intelligence request", JSON.stringify(body, null, 2));
        return this.intelligence.generateFeedback(body.tier || 1, body.data || body);
    }
    async generateAI(body) {
        const lang = body.language || body.payload?.language || 'en-IN';
        return (0, runAIService_1.runAIService)(body.prompt, lang);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('roadmap'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "roadmapGen", null);
__decorate([
    (0, common_1.Post)('career'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "careerGen", null);
__decorate([
    (0, common_1.Post)('eligibility'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "eligibilityGen", null);
__decorate([
    (0, common_1.Post)('performance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "performanceGen", null);
__decorate([
    (0, common_1.Post)('burnout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "burnoutGen", null);
__decorate([
    (0, common_1.Post)('report'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "reportGen", null);
__decorate([
    (0, common_1.Post)('intelligence'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "intelligenceGen", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateAI", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [roadmap_service_1.RoadmapService,
        career_service_1.CareerService,
        eligibility_service_1.EligibilityService,
        performance_service_1.PerformanceService,
        burnout_service_1.BurnoutService,
        report_service_1.ReportService,
        intelligence_service_1.IntelligenceService])
], AiController);
//# sourceMappingURL=ai.controller.js.map