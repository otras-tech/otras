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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_request_dto_1 = require("./dto/ai-request.dto");
const ai_service_1 = require("./ai.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generateRoadmap(dto, req) {
        return this.aiService.generate(req.user.otrId, req.user.role, dto);
    }
    async getStatus(id, req) {
        return this.aiService.getStatus(req.user.otrId, req.user.role, id);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('roadmap'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a personalized AI-driven study roadmap' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Roadmap generation started' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_request_dto_1.AiRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateRoadmap", null);
__decorate([
    (0, common_1.Get)('status/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Check status of a roadmap generation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getStatus", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI Engine'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map