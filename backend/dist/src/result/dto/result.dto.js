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
exports.SubmitTestDto = exports.AnswerDto = exports.StartTestDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class StartTestDto {
    userId;
    testId;
    tier;
}
exports.StartTestDto = StartTestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'User ID of the student' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], StartTestDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 101, description: 'ID of the test to start' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], StartTestDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Artha Tier (1, 2, or 3)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StartTestDto.prototype, "tier", void 0);
class AnswerDto {
    questionId;
    selectedOption;
}
exports.AnswerDto = AnswerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5001, description: 'Question ID' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AnswerDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A', description: 'Selected option (A, B, C, D)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AnswerDto.prototype, "selectedOption", void 0);
class SubmitTestDto {
    userId;
    testId;
    answers;
    tier;
    resultId;
}
exports.SubmitTestDto = SubmitTestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SubmitTestDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 101 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SubmitTestDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AnswerDto], description: 'List of user answers' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AnswerDto),
    __metadata("design:type", Array)
], SubmitTestDto.prototype, "answers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitTestDto.prototype, "tier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1234, description: 'Existing result ID to update' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitTestDto.prototype, "resultId", void 0);
//# sourceMappingURL=result.dto.js.map