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
exports.CareerAIController = void 0;
const common_1 = require("@nestjs/common");
const career_ai_service_1 = require("../service/career-ai.service");
let CareerAIController = class CareerAIController {
    careerAIService;
    constructor(careerAIService) {
        this.careerAIService = careerAIService;
    }
    async generateRoadmap(dto) {
        return this.careerAIService.generateRoadmap(dto);
    }
    async getStatus(jobId) {
        return this.careerAIService.getJobStatus(jobId);
    }
};
exports.CareerAIController = CareerAIController;
__decorate([
    (0, common_1.Post)('generate-roadmap'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CareerAIController.prototype, "generateRoadmap", null);
__decorate([
    (0, common_1.Get)('status/:jobId'),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CareerAIController.prototype, "getStatus", null);
exports.CareerAIController = CareerAIController = __decorate([
    (0, common_1.Controller)('career-ai'),
    __metadata("design:paramtypes", [career_ai_service_1.CareerAIService])
], CareerAIController);
//# sourceMappingURL=career-ai.controller.js.map