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
exports.AiRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AiRequestDto {
    exam;
    score;
    weakAreas;
    language;
}
exports.AiRequestDto = AiRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SSC CGL', description: 'The target exam name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AiRequestDto.prototype, "exam", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 85, description: 'Current user score in assessment' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AiRequestDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Geometry', 'Verbal Reasoning'], description: 'List of weak subject areas' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], AiRequestDto.prototype, "weakAreas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'en', enum: ['en', 'hi', 'te'], description: 'Preferred language' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['en', 'hi', 'te']),
    __metadata("design:type", String)
], AiRequestDto.prototype, "language", void 0);
//# sourceMappingURL=ai-request.dto.js.map