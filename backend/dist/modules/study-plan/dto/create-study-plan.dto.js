"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateStudyPlanDto", {
    enumerable: true,
    get: function() {
        return CreateStudyPlanDto;
    }
});
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
let CreateStudyPlanDto = class CreateStudyPlanDto {
};
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "userId", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "examId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateStudyPlanDto.prototype, "targetExam", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateStudyPlanDto.prototype, "examDate", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "tier1Score", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "tier2Score", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateStudyPlanDto.prototype, "currentLevel", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], CreateStudyPlanDto.prototype, "weakAreas", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "dailyStudyHours", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateStudyPlanDto.prototype, "mockFrequency", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateStudyPlanDto.prototype, "revisionStrategy", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateStudyPlanDto.prototype, "preferredStudyTimes", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateStudyPlanDto.prototype, "language", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "planDurationDays", void 0);

//# sourceMappingURL=create-study-plan.dto.js.map