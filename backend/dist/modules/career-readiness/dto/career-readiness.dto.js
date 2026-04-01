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
exports.SubmitCareerReadinessDto = exports.CareerReadinessAnswerDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CareerReadinessAnswerDto {
    questionId;
    selectedOption;
    timeTaken;
}
exports.CareerReadinessAnswerDto = CareerReadinessAnswerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45, description: 'Question ID' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CareerReadinessAnswerDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B', description: 'Selected option' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CareerReadinessAnswerDto.prototype, "selectedOption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30, description: 'Time taken in seconds' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CareerReadinessAnswerDto.prototype, "timeTaken", void 0);
class SubmitCareerReadinessDto {
    otrId;
    testId;
    answers;
}
exports.SubmitCareerReadinessDto = SubmitCareerReadinessDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OTR123456', description: 'User OTR ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitCareerReadinessDto.prototype, "otrId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID of the Career Readiness test' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SubmitCareerReadinessDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CareerReadinessAnswerDto],
        description: 'List of question attempts',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsObject)({ each: true }),
    __metadata("design:type", Array)
], SubmitCareerReadinessDto.prototype, "answers", void 0);
//# sourceMappingURL=career-readiness.dto.js.map