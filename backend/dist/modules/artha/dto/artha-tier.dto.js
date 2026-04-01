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
exports.ArthaQuestionAttemptDto = exports.ArthaTierResultDto = exports.StartTierDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class StartTierDto {
    userId;
}
exports.StartTierDto = StartTierDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OTR123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StartTierDto.prototype, "userId", void 0);
class ArthaTierResultDto {
    userId;
    assessmentId;
    language;
    attemptedCount;
    totalQuestions;
}
exports.ArthaTierResultDto = ArthaTierResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OTR123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ArthaTierResultDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-1234' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArthaTierResultDto.prototype, "assessmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'English' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArthaTierResultDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ArthaTierResultDto.prototype, "attemptedCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ArthaTierResultDto.prototype, "totalQuestions", void 0);
class ArthaQuestionAttemptDto {
    assessmentId;
    questionId;
    selectedOption;
    isCorrect;
    timeTaken;
}
exports.ArthaQuestionAttemptDto = ArthaQuestionAttemptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-1234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ArthaQuestionAttemptDto.prototype, "assessmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 101 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ArthaQuestionAttemptDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ArthaQuestionAttemptDto.prototype, "selectedOption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], ArthaQuestionAttemptDto.prototype, "isCorrect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45, description: 'Time taken in seconds' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ArthaQuestionAttemptDto.prototype, "timeTaken", void 0);
//# sourceMappingURL=artha-tier.dto.js.map