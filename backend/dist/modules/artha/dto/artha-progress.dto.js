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
exports.ArthaProgressDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ArthaProgressDto {
    userId;
    logicalScore;
    quantScore;
    verbalScore;
    language;
    totalQuestions;
    attemptedCount;
}
exports.ArthaProgressDto = ArthaProgressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OTR123456', description: 'User OTR ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ArthaProgressDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 85.5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ArthaProgressDto.prototype, "logicalScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 78.0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ArthaProgressDto.prototype, "quantScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 92.0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ArthaProgressDto.prototype, "verbalScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'English' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArthaProgressDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ArthaProgressDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ArthaProgressDto.prototype, "attemptedCount", void 0);
//# sourceMappingURL=artha-progress.dto.js.map