"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResultController", {
    enumerable: true,
    get: function() {
        return ResultController;
    }
});
const _common = require("@nestjs/common");
const _resultservice = require("./result.service");
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
let StartResultDto = class StartResultDto {
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], StartResultDto.prototype, "userId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], StartResultDto.prototype, "testId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], StartResultDto.prototype, "tier", void 0);
let SubmitResultDto = class SubmitResultDto {
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], SubmitResultDto.prototype, "userId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], SubmitResultDto.prototype, "testId", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    _ts_metadata("design:type", Array)
], SubmitResultDto.prototype, "answers", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], SubmitResultDto.prototype, "tier", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], SubmitResultDto.prototype, "resultId", void 0);
let ResultController = class ResultController {
    async start(body) {
        return this.resultService.startTest(body.userId, body.testId, body.tier);
    }
    async submit(body) {
        // In a real app, userId should come from JWT
        return this.resultService.calculateAndSave(body.userId, body.testId, body.answers, body.tier, body.resultId);
    }
    async getUserResults(userId) {
        return this.resultService.getUserResults(userId);
    }
    constructor(resultService){
        this.resultService = resultService;
    }
};
_ts_decorate([
    (0, _common.Post)('start'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof StartResultDto === "undefined" ? Object : StartResultDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ResultController.prototype, "start", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof SubmitResultDto === "undefined" ? Object : SubmitResultDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ResultController.prototype, "submit", null);
_ts_decorate([
    (0, _common.Get)('user/:userId'),
    _ts_param(0, (0, _common.Param)('userId', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], ResultController.prototype, "getUserResults", null);
ResultController = _ts_decorate([
    (0, _common.Controller)('results'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _resultservice.ResultService === "undefined" ? Object : _resultservice.ResultService
    ])
], ResultController);

//# sourceMappingURL=result.controller.js.map