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
exports.CreateExamDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateExamDto {
    name;
    cutoff;
    syllabus;
    eligibility;
    pattern;
    shortDescription;
    longDescription;
    noOfQuestions;
    subjectIds;
}
exports.CreateExamDto = CreateExamDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SSC CGL 2024', description: 'Name of the examination' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 120.5, description: 'Expected cutoff marks' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "cutoff", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Arithmetic, Algebra, Geometry...', description: 'Brief syllabus summary' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "syllabus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Graduation in any discipline', description: 'Eligibility criteria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "eligibility", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '100 Questions, 60 Minutes', description: 'Exam pattern details' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "pattern", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Short summary for listing' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Detailed description for exam page' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "longDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "noOfQuestions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: [1, 2], description: 'List of Subject IDs to associate' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateExamDto.prototype, "subjectIds", void 0);
//# sourceMappingURL=create-exam.dto.js.map