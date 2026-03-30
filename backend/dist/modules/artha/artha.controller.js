"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ArthaController", {
    enumerable: true,
    get: function() {
        return ArthaController;
    }
});
const _common = require("@nestjs/common");
const _arthaservice = require("./artha.service");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ArthaStartTierDto = class ArthaStartTierDto {
    constructor(){
        this.userId = '';
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ArthaStartTierDto.prototype, "userId", void 0);
let ArthaTierAssessmentDto = class ArthaTierAssessmentDto {
    constructor(){
        this.userId = '';
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ArthaTierAssessmentDto.prototype, "userId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ArthaTierAssessmentDto.prototype, "assessmentId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], ArthaTierAssessmentDto.prototype, "language", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ArthaTierAssessmentDto.prototype, "attemptedCount", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ArthaTierAssessmentDto.prototype, "totalQuestions", void 0);
let ArthaQuestionAttemptDto = class ArthaQuestionAttemptDto {
    constructor(){
        this.assessmentId = '';
        this.questionId = 0;
        this.selectedOption = '';
        this.isCorrect = false;
        this.timeTaken = 0;
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ArthaQuestionAttemptDto.prototype, "assessmentId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], ArthaQuestionAttemptDto.prototype, "questionId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ArthaQuestionAttemptDto.prototype, "selectedOption", void 0);
_ts_decorate([
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], ArthaQuestionAttemptDto.prototype, "isCorrect", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], ArthaQuestionAttemptDto.prototype, "timeTaken", void 0);
let ArthaController = class ArthaController {
    async getStatus(userId) {
        return this.service.getStatus(userId);
    }
    async startTier(body, tier) {
        return this.service.startTierAssessment(body.userId, parseInt(tier, 10));
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
        return this.service.getStatus(userId); // getStatus now includes recentReports
    }
    constructor(service){
        this.service = service;
    }
};
_ts_decorate([
    (0, _common.Get)('status/:userId'),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ArthaController.prototype, "getStatus", null);
_ts_decorate([
    (0, _common.Post)('start-tier/:tier'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Param)('tier')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof ArthaStartTierDto === "undefined" ? Object : ArthaStartTierDto,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ArthaController.prototype, "startTier", null);
_ts_decorate([
    (0, _common.Post)('tier1'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ArthaController.prototype, "completeTier1", null);
_ts_decorate([
    (0, _common.Post)('tier2'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof ArthaTierAssessmentDto === "undefined" ? Object : ArthaTierAssessmentDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ArthaController.prototype, "completeTier2", null);
_ts_decorate([
    (0, _common.Post)('tier3'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof ArthaTierAssessmentDto === "undefined" ? Object : ArthaTierAssessmentDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ArthaController.prototype, "completeTier3", null);
_ts_decorate([
    (0, _common.Post)('attempt-question'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof ArthaQuestionAttemptDto === "undefined" ? Object : ArthaQuestionAttemptDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ArthaController.prototype, "attemptQuestion", null);
_ts_decorate([
    (0, _common.Get)('recent-reports/:userId'),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ArthaController.prototype, "getRecentReports", null);
ArthaController = _ts_decorate([
    (0, _common.Controller)('artha'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _arthaservice.ArthaService === "undefined" ? Object : _arthaservice.ArthaService
    ])
], ArthaController);

//# sourceMappingURL=artha.controller.js.map