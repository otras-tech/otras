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
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generateRoadmap(dto) {
        return this.aiService.generate(dto);
    }
    async getStatus(id) {
        return this.aiService.getStatus(id);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('roadmap'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a personalized AI-driven study roadmap' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Roadmap generated successfully' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ai_request_dto_1.AiRequestDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateRoadmap", null);
__decorate([
    (0, common_1.Get)('status/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Check status of a roadmap generation' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getStatus", null);
exports.AiController = AiController = __decorate([
    (0, swagger_1.ApiTags)('AI Engine'),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map