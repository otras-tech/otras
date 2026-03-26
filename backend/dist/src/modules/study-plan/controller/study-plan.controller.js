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
exports.StudyPlanController = void 0;
const common_1 = require("@nestjs/common");
const study_plan_service_1 = require("../service/study-plan.service");
const create_study_plan_dto_1 = require("../dto/create-study-plan.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateActivityStatusDto {
    completed;
    missed;
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    __metadata("design:type", Boolean)
], UpdateActivityStatusDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    __metadata("design:type", Boolean)
], UpdateActivityStatusDto.prototype, "missed", void 0);
let StudyPlanController = class StudyPlanController {
    studyPlanService;
    constructor(studyPlanService) {
        this.studyPlanService = studyPlanService;
    }
    generate(dto) {
        return this.studyPlanService.generate(dto);
    }
    save(body) {
        return this.studyPlanService.save(body.dto, body.aiData);
    }
    findByUserId(userId) {
        return this.studyPlanService.findByUserId(userId);
    }
    findOne(id) {
        return this.studyPlanService.findOne(id);
    }
    updateActivityStatus(activityId, userId, data) {
        return this.studyPlanService.updateActivityStatus(activityId, userId, data);
    }
    async simulateDayPassed(id) {
        return this.studyPlanService.simulateDayPassed(id);
    }
    async simulateDateChange(id) {
        console.log("Simulate date change triggered for:", id);
        return this.studyPlanService.moveMissedTasks(id);
    }
    async delete(id) {
        return this.studyPlanService.delete(id);
    }
};
exports.StudyPlanController = StudyPlanController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a study plan (Step 1: AI Analysis)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'AI generated plan summary' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_study_plan_dto_1.CreateStudyPlanDto]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('save'),
    (0, swagger_1.ApiOperation)({ summary: 'Save the generated study plan to database' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Plan saved successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "save", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all study plans for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of plans' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get study plan by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plan details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('activity/:activityId/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update status of a specific study activity' }),
    __param(0, (0, common_1.Param)('activityId')),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, UpdateActivityStatusDto]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "updateActivityStatus", null);
__decorate([
    (0, common_1.Post)(':id/simulate-day-passed'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudyPlanController.prototype, "simulateDayPassed", null);
__decorate([
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudyPlanController.prototype, "simulateDateChange", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudyPlanController.prototype, "delete", null);
exports.StudyPlanController = StudyPlanController = __decorate([
    (0, swagger_1.ApiTags)('Study Plans'),
    (0, common_1.Controller)('study-plan'),
    __metadata("design:paramtypes", [study_plan_service_1.StudyPlanService])
], StudyPlanController);
//# sourceMappingURL=study-plan.controller.js.map