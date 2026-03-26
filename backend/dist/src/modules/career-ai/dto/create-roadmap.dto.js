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
exports.CreateRoadmapDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateRoadmapDto {
    logicalScore;
    quantScore;
    verbalScore;
    interests;
    learningPattern;
    confidenceIndex;
    aspirations;
    userId;
}
exports.CreateRoadmapDto = CreateRoadmapDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 85 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRoadmapDto.prototype, "logicalScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 78 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRoadmapDto.prototype, "quantScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 92 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRoadmapDto.prototype, "verbalScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Data Science', 'Backend Engineering'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateRoadmapDto.prototype, "interests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Visual learner, prefers hands-on practice' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRoadmapDto.prototype, "learningPattern", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRoadmapDto.prototype, "confidenceIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Become a Lead Software Architect' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRoadmapDto.prototype, "aspirations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'OTR123456' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoadmapDto.prototype, "userId", void 0);
//# sourceMappingURL=create-roadmap.dto.js.map