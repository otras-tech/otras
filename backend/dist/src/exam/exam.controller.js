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
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const exam_service_1 = require("./exam.service");
const swagger_1 = require("@nestjs/swagger");
const create_exam_dto_1 = require("./dto/create-exam.dto");
let ExamController = class ExamController {
    examService;
    constructor(examService) {
        this.examService = examService;
    }
    create(createExamDto) {
        return this.examService.create(createExamDto);
    }
    update(id, updateData) {
        return this.examService.update(id, updateData);
    }
    remove(id) {
        return this.examService.remove(id);
    }
    findAll() {
        return this.examService.findAll();
    }
    findOne(id) {
        return this.examService.findOne(id);
    }
    getRandomTest(id) {
        return this.examService.getRandomTest(id);
    }
    findByTier(tier) {
        return this.examService.findByTier(tier);
    }
};
exports.ExamController = ExamController;
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new exam (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Exam created successfully' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing exam (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exam updated' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete an exam (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exam deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all exams' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of exams' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get exam details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exam details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exam not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/random-test'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a random test from exam subjects' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Randomly generated test questions' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "getRandomTest", null);
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
    __metadata("design:paramtypes", [exam_service_1.ExamService])
], ExamController);
//# sourceMappingURL=exam.controller.js.map