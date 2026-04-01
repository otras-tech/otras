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
exports.CreatePypDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePypDto {
    year;
    fileUrl;
    examId;
}
exports.CreatePypDto = CreatePypDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2023,
        description: 'The year of the previous year paper',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreatePypDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/ssc-cgl-2023.pdf',
        description: 'URL to the PDF file',
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePypDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID of the associated exam' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreatePypDto.prototype, "examId", void 0);
//# sourceMappingURL=pyp.dto.js.map