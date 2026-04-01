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
exports.UpdateApplicationStatusDto = exports.CreateApplicationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateApplicationDto {
    userId;
    examId;
}
exports.CreateApplicationDto = CreateApplicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID of the User applying' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateApplicationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID of the Exam being applied for' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateApplicationDto.prototype, "examId", void 0);
class UpdateApplicationStatusDto {
    status;
    applicationStatus;
    admitCardStatus;
    examKeyStatus;
    resultStatus;
}
exports.UpdateApplicationStatusDto = UpdateApplicationStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Approved',
        description: 'New status for the application',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Success' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "applicationStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Released' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "admitCardStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pending' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "examKeyStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Declared' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateApplicationStatusDto.prototype, "resultStatus", void 0);
//# sourceMappingURL=application.dto.js.map