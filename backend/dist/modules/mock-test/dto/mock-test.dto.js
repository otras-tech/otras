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
exports.SubmitExamAttemptDto = exports.SubmitMockAttemptDto = exports.StartMockAttemptDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class StartMockAttemptDto {
    otrId;
    mockTestOrTestId;
}
exports.StartMockAttemptDto = StartMockAttemptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OTR123456', description: 'User OTR ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StartMockAttemptDto.prototype, "otrId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'ID of the MockTest' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], StartMockAttemptDto.prototype, "mockTestOrTestId", void 0);
class SubmitMockAttemptDto {
    otrId;
    mockTestId;
    score;
    totalMarks;
    attemptId;
}
exports.SubmitMockAttemptDto = SubmitMockAttemptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OTR123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitMockAttemptDto.prototype, "otrId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SubmitMockAttemptDto.prototype, "mockTestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 85, description: 'Total obtained score' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SubmitMockAttemptDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Max marks possible' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SubmitMockAttemptDto.prototype, "totalMarks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 123,
        description: 'Optional: ID of the attempt from /start-attempt',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitMockAttemptDto.prototype, "attemptId", void 0);
class SubmitExamAttemptDto {
    otrId;
    examId;
    score;
    totalMarks;
    attemptId;
    correctAnswers;
    subjectBreakdown;
}
exports.SubmitExamAttemptDto = SubmitExamAttemptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OTR123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitExamAttemptDto.prototype, "otrId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SubmitExamAttemptDto.prototype, "examId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 75.5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SubmitExamAttemptDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SubmitExamAttemptDto.prototype, "totalMarks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 123, description: 'Existing attempt ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitExamAttemptDto.prototype, "attemptId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 15,
        description: 'Number of correct answers',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitExamAttemptDto.prototype, "correctAnswers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { Quant: 10, Logical: 5 },
        description: 'JSON string or object for breakdown',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SubmitExamAttemptDto.prototype, "subjectBreakdown", void 0);
//# sourceMappingURL=mock-test.dto.js.map