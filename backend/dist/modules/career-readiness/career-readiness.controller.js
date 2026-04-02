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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const swagger_1 = require("@nestjs/swagger");
let CareerReadinessController = class CareerReadinessController {
    careerReadinessService;
    constructor(careerReadinessService) {
        this.careerReadinessService = careerReadinessService;
    }
    saveResult(data, req) {
        return this.careerReadinessService.saveResult(req.user.otrId, data);
    }
    getByOtrId(otrId, req) {
        return this.careerReadinessService.getByOtrId(req.user.otrId, otrId);
    }
};
exports.CareerReadinessController = CareerReadinessController;
__decorate([
    (0, common_1.Post)('save'),
    (0, swagger_1.ApiOperation)({ summary: 'Save results for a career readiness assessment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Result saved' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CareerReadinessController.prototype, "saveResult", null);
__decorate([
    (0, common_1.Get)('result/:otrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest career readiness result for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User result' }),
    __param(0, (0, common_1.Param)('otrId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CareerReadinessController.prototype, "getByOtrId", null);
exports.CareerReadinessController = CareerReadinessController = __decorate([
    (0, swagger_1.ApiTags)('Career Readiness'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('career-readiness'),
    __metadata("design:paramtypes", [career_readiness_service_1.CareerReadinessService])
], CareerReadinessController);
//# sourceMappingURL=career-readiness.controller.js.map