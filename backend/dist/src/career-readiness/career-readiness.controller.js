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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerReadinessController = void 0;
const common_1 = require("@nestjs/common");
const career_readiness_service_1 = require("./career-readiness.service");
const swagger_1 = require("@nestjs/swagger");
const career_readiness_dto_1 = require("./dto/career-readiness.dto");
let CareerReadinessController = class CareerReadinessController {
    careerReadinessService;
    constructor(careerReadinessService) {
        this.careerReadinessService = careerReadinessService;
    }
    async saveResult(body) {
        console.log('Received submission request:', JSON.stringify(body, null, 2));
        try {
            const result = await this.careerReadinessService.saveResult(body);
            console.log('Successfully saved result');
            return result;
        }
        catch (error) {
            console.error('Error in saveResult:', error);
            throw error;
        }
    }
    async getByOtrId(otrId) {
        return this.careerReadinessService.getByOtrId(otrId);
    }
};
exports.CareerReadinessController = CareerReadinessController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit answers for a career readiness assessment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Results calculated and saved' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [career_readiness_dto_1.SubmitCareerReadinessDto]),
    __metadata("design:returntype", Promise)
], CareerReadinessController.prototype, "saveResult", null);
__decorate([
    (0, common_1.Get)(':otrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get career readiness assessment history by OTR ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of assessment scores' }),
    __param(0, (0, common_1.Param)('otrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CareerReadinessController.prototype, "getByOtrId", null);
exports.CareerReadinessController = CareerReadinessController = __decorate([
    (0, swagger_1.ApiTags)('Career Readiness'),
    (0, common_1.Controller)('career-readiness'),
    __metadata("design:paramtypes", [career_readiness_service_1.CareerReadinessService])
], CareerReadinessController);
//# sourceMappingURL=career-readiness.controller.js.map