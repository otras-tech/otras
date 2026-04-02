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
exports.ExamController = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_service_1 = require("../../common/cache/cache.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const exam_service_1 = require("./exam.service");
const swagger_1 = require("@nestjs/swagger");
const create_exam_dto_1 = require("./dto/create-exam.dto");
let ExamController = class ExamController {
    examService;
    cacheService;
    constructor(examService, cacheService) {
        this.examService = examService;
        this.cacheService = cacheService;
    }
    async create(createExamDto) {
        const result = await this.examService.create(createExamDto);
        await this.examService.invalidateCache();
        return result;
    }
    async update(id, updateData) {
        const result = await this.examService.update(id, updateData);
        await this.examService.invalidateCache();
        await this.cacheService.del(`exam_details_${id}`);
        return result;
    }
    async remove(id) {
        const result = await this.examService.remove(id);
        await this.examService.invalidateCache();
        await this.cacheService.del(`exam_details_${id}`);
        return result;
    }
    findAll() {
        return this.examService.findAll();
    }
    findOne(id) {
        return this.examService.findOne(id);
    }
    getTest(id) {
        return this.examService.getTest(id);
    }
    generateTest(id) {
        return this.examService.generateTest(id);
    }
    findByTier(tier) {
        return this.examService.findByTier(tier);
    }
};
exports.ExamController = ExamController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new exam (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Exam created successfully' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing exam (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exam updated' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete an exam (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exam deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    (0, cache_manager_1.CacheKey)('exams_all'),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiOperation)({ summary: 'Get all exams' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of exams' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiOperation)({ summary: 'Get exam details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exam details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exam not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'USER'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Get)(':id/test'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a random existing test for this exam (No side effects)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Existing test details' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "getTest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)(':id/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a new test for this exam (Side effects)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'New test generated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "generateTest", null);
__decorate([
    (0, common_1.Get)('tier/:tier'),
    (0, swagger_1.ApiOperation)({ summary: 'Filter exams by tier' }),
    __param(0, (0, common_1.Param)('tier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findByTier", null);
exports.ExamController = ExamController = __decorate([
    (0, swagger_1.ApiTags)('Exams'),
    (0, common_1.Controller)('exams'),
    __metadata("design:paramtypes", [exam_service_1.ExamService,
        cache_service_1.CacheService])
], ExamController);
//# sourceMappingURL=exam.controller.js.map