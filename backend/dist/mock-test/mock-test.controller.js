"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MockTestController", {
    enumerable: true,
    get: function() {
        return MockTestController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
const _mocktestservice = require("./mock-test.service");
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
let StartAttemptDto = class StartAttemptDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], StartAttemptDto.prototype, "otrId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], StartAttemptDto.prototype, "mockTestId", void 0);
let AttemptDto = class AttemptDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AttemptDto.prototype, "otrId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], AttemptDto.prototype, "mockTestId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], AttemptDto.prototype, "score", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], AttemptDto.prototype, "totalMarks", void 0);
let ExamAttemptDto = class ExamAttemptDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ExamAttemptDto.prototype, "otrId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], ExamAttemptDto.prototype, "examId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], ExamAttemptDto.prototype, "score", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], ExamAttemptDto.prototype, "totalMarks", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ExamAttemptDto.prototype, "attemptId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], ExamAttemptDto.prototype, "correctAnswers", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], ExamAttemptDto.prototype, "subjectBreakdown", void 0);
let MockTestController = class MockTestController {
    findAll(categoryId) {
        return this.mockTestService.findAll(categoryId ? +categoryId : undefined);
    }
    startAttempt(dto) {
        return this.mockTestService.startAttempt(dto.otrId, dto.mockTestId);
    }
    submitAttempt(dto) {
        return this.mockTestService.submitAttempt(dto);
    }
    submitExamAttempt(dto) {
        return this.mockTestService.submitExamAttempt(dto);
    }
    getRecentAttempt(otrId) {
        return this.mockTestService.getRecentAttempt(otrId);
    }
    calculateRank(mockTestId, otrId) {
        return this.mockTestService.calculateRank(+mockTestId, otrId);
    }
    findOne(id) {
        return this.mockTestService.findOne(+id);
    }
    constructor(mockTestService){
        this.mockTestService = mockTestService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Query)('categoryId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], MockTestController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)('start-attempt'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof StartAttemptDto === "undefined" ? Object : StartAttemptDto
    ]),
    _ts_metadata("design:returntype", void 0)
], MockTestController.prototype, "startAttempt", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)('attempts'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AttemptDto === "undefined" ? Object : AttemptDto
    ]),
    _ts_metadata("design:returntype", void 0)
], MockTestController.prototype, "submitAttempt", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)('exam-attempts'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof ExamAttemptDto === "undefined" ? Object : ExamAttemptDto
    ]),
    _ts_metadata("design:returntype", void 0)
], MockTestController.prototype, "submitExamAttempt", null);
_ts_decorate([
    (0, _common.Get)('attempts/recent/:otrId'),
    _ts_param(0, (0, _common.Param)('otrId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], MockTestController.prototype, "getRecentAttempt", null);
_ts_decorate([
    (0, _common.Get)('rank/:mockTestId/:otrId'),
    _ts_param(0, (0, _common.Param)('mockTestId')),
    _ts_param(1, (0, _common.Param)('otrId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], MockTestController.prototype, "calculateRank", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], MockTestController.prototype, "findOne", null);
MockTestController = _ts_decorate([
    (0, _common.Controller)('mock-test'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mocktestservice.MockTestService === "undefined" ? Object : _mocktestservice.MockTestService
    ])
], MockTestController);

//# sourceMappingURL=mock-test.controller.js.map