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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStudyPlanDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateStudyPlanDto {
    userId;
    examId;
    targetExam;
    examDate;
    tier1Score;
    tier2Score;
    currentLevel;
    weakAreas;
    dailyStudyHours;
    mockFrequency;
    revisionStrategy;
    preferredStudyTimes;
    language;
    planDurationDays;
}
exports.CreateStudyPlanDto = CreateStudyPlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID of the User' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'ID of the target Exam' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "examId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SSC CGL', description: 'Name of the target examination' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyPlanDto.prototype, "targetExam", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-10-15', description: 'Expected date of the exam' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyPlanDto.prototype, "examDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 120 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "tier1Score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 350 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "tier2Score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Intermediate', description: 'Current preparation level' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyPlanDto.prototype, "currentLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Geometry', 'Grammar'], description: 'List of weak subject areas' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateStudyPlanDto.prototype, "weakAreas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, description: 'Daily hours available for study' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "dailyStudyHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'One per week', description: 'How often to take mock tests' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyPlanDto.prototype, "mockFrequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Focus on weak areas first', description: 'Strategy for revision' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyPlanDto.prototype, "revisionStrategy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Morning', description: 'Preferred time segments for studying' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyPlanDto.prototype, "preferredStudyTimes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'en', enum: ['en', 'hi', 'te'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStudyPlanDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30, description: 'Duration of the study plan in days' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateStudyPlanDto.prototype, "planDurationDays", void 0);
//# sourceMappingURL=create-study-plan.dto.js.map