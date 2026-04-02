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
exports.CareerAiController = void 0;
const common_1 = require("@nestjs/common");
const career_ai_service_1 = require("../service/career-ai.service");
const create_roadmap_dto_1 = require("../dto/create-roadmap.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let CareerAiController = class CareerAiController {
    service;
    constructor(service) {
        this.service = service;
    }
    async generateRoadmap(body) {
        return this.service.generateRoadmap(body);
    }
};
exports.CareerAiController = CareerAiController;
__decorate([
    (0, common_1.Post)('generate-roadmap'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a personalized AI-driven career roadmap' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Career roadmap generated successfully',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_roadmap_dto_1.CreateRoadmapDto]),
    __metadata("design:returntype", Promise)
], CareerAiController.prototype, "generateRoadmap", null);
exports.CareerAiController = CareerAiController = __decorate([
    (0, swagger_1.ApiTags)('AI Career Guidance'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('career-ai'),
    __metadata("design:paramtypes", [career_ai_service_1.CareerAIService])
], CareerAiController);
//# sourceMappingURL=career-ai.controller.js.map