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
var StudyPlanController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanController = void 0;
const common_1 = require("@nestjs/common");
const study_plan_service_1 = require("../service/study-plan.service");
const create_study_plan_dto_1 = require("../dto/create-study-plan.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
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
let StudyPlanController = StudyPlanController_1 = class StudyPlanController {
    studyPlanService;
    logger = new common_1.Logger(StudyPlanController_1.name);
    constructor(studyPlanService) {
        this.studyPlanService = studyPlanService;
    }
    generate(dto, req) {
        return this.studyPlanService.generate(req.user.id, req.user.role, dto);
    }
    save(body, req) {
        return this.studyPlanService.save(req.user.id, req.user.role, body.dto, body.aiData);
    }
    findByUserId(userId, req) {
        return this.studyPlanService.findByUserId(req.user.id, req.user.role, userId);
    }
    findOne(id, req) {
        return this.studyPlanService.findOne(req.user.id, req.user.role, id);
    }
    updateActivityStatus(activityId, userId, data, req) {
        return this.studyPlanService.updateActivityStatus(req.user.id, req.user.role, activityId, userId, data);
    }
    async simulateDayPassed(id, req) {
        return this.studyPlanService.simulateDayPassed(req.user.id, req.user.role, id);
    }
    async delete(id, req) {
        return this.studyPlanService.delete(req.user.id, req.user.role, id);
    }
};
exports.StudyPlanController = StudyPlanController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a study plan (Step 1: AI Analysis)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'AI generated plan summary' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_study_plan_dto_1.CreateStudyPlanDto, Object]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('save'),
    (0, swagger_1.ApiOperation)({ summary: 'Save the generated study plan to database' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Plan saved successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "save", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all study plans for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of plans' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get study plan by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plan details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('activity/:activityId/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update status of a specific study activity' }),
    __param(0, (0, common_1.Param)('activityId')),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, UpdateActivityStatusDto, Object]),
    __metadata("design:returntype", void 0)
], StudyPlanController.prototype, "updateActivityStatus", null);
__decorate([
    (0, common_1.Post)(':id/simulate-day-passed'),
    (0, swagger_1.ApiOperation)({ summary: 'Simulate time passage for automated rescheduling testing' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudyPlanController.prototype, "simulateDayPassed", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Hard-delete (soft-delete coming soon) a study plan' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudyPlanController.prototype, "delete", null);
exports.StudyPlanController = StudyPlanController = StudyPlanController_1 = __decorate([
    (0, swagger_1.ApiTags)('Study Plans'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('study-plan'),
    __metadata("design:paramtypes", [study_plan_service_1.StudyPlanService])
], StudyPlanController);
//# sourceMappingURL=study-plan.controller.js.map