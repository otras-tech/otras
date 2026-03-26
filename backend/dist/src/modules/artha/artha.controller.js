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
exports.ArthaController = void 0;
const common_1 = require("@nestjs/common");
const artha_service_1 = require("./artha.service");
const swagger_1 = require("@nestjs/swagger");
const artha_tier_dto_1 = require("./dto/artha-tier.dto");
let ArthaController = class ArthaController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getStatus(userId) {
        return this.service.getStatus(userId);
    }
    async startTier(body, tier) {
        return this.service.startTierAssessment(body.userId, tier);
    }
    async completeTier1(body) {
        return this.service.processTier1(body, body.assessmentId);
    }
    async completeTier2(body) {
        return this.service.processTier2(body.userId, body.assessmentId, body.language, body.attemptedCount, body.totalQuestions);
    }
    async completeTier3(body) {
        return this.service.processTier3(body.userId, body.assessmentId, body.language, body.attemptedCount, body.totalQuestions);
    }
    async attemptQuestion(body) {
        return this.service.recordQuestionAttempt(body);
    }
    async getRecentReports(userId) {
        return this.service.getStatus(userId);
    }
};
exports.ArthaController = ArthaController;
__decorate([
    (0, common_1.Get)("status/:userId"),
    (0, swagger_1.ApiOperation)({ summary: 'Get current Artha assessment status for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current status and readiness scores' }),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)("start-tier/:tier"),
    (0, swagger_1.ApiOperation)({ summary: 'Start a specific assessment tier' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Assessment session initialized' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("tier", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artha_tier_dto_1.StartTierDto, Number]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "startTier", null);
__decorate([
    (0, common_1.Post)("tier1"),
    (0, swagger_1.ApiOperation)({ summary: 'Complete Tier 1 assessment (Logical/Quant/Verbal)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tier 1 results processed' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "completeTier1", null);
__decorate([
    (0, common_1.Post)("tier2"),
    (0, swagger_1.ApiOperation)({ summary: 'Complete Tier 2 assessment (Domain specific)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tier 2 results processed' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artha_tier_dto_1.ArthaTierResultDto]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "completeTier2", null);
__decorate([
    (0, common_1.Post)("tier3"),
    (0, swagger_1.ApiOperation)({ summary: 'Complete Tier 3 assessment (Advanced/Case studies)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tier 3 results processed' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artha_tier_dto_1.ArthaTierResultDto]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "completeTier3", null);
__decorate([
    (0, common_1.Post)("attempt-question"),
    (0, swagger_1.ApiOperation)({ summary: 'Record an individual question attempt within an assessment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attempt recorded' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artha_tier_dto_1.ArthaQuestionAttemptDto]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "attemptQuestion", null);
__decorate([
    (0, common_1.Get)("recent-reports/:userId"),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent Artha assessment reports' }),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "getRecentReports", null);
exports.ArthaController = ArthaController = __decorate([
    (0, swagger_1.ApiTags)('Artha AI Assessment'),
    (0, common_1.Controller)("artha"),
    __metadata("design:paramtypes", [artha_service_1.ArthaService])
], ArthaController);
//# sourceMappingURL=artha.controller.js.map