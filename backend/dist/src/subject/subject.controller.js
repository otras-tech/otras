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
exports.SubjectController = void 0;
const common_1 = require("@nestjs/common");
const subject_service_1 = require("./subject.service");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const create_subject_dto_1 = require("./dto/create-subject.dto");
let SubjectController = class SubjectController {
    subjectService;
    constructor(subjectService) {
        this.subjectService = subjectService;
    }
    create(createSubjectDto) {
        return this.subjectService.create(createSubjectDto);
    }
    findAll() {
        return this.subjectService.findAll();
    }
    findOne(id) {
        return this.subjectService.findOne(id);
    }
    update(id, data) {
        return this.subjectService.update(+id, data);
    }
    remove(id) {
        return this.subjectService.remove(+id);
    }
};
exports.SubjectController = SubjectController;
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new subject (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subject created' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subject_dto_1.CreateSubjectDto]),
    __metadata("design:returntype", void 0)
], SubjectController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subjects' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of subjects' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubjectController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subject by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subject details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subject not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SubjectController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubjectController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubjectController.prototype, "remove", null);
exports.SubjectController = SubjectController = __decorate([
    (0, swagger_1.ApiTags)('Subjects'),
    (0, common_1.Controller)('subjects'),
    __metadata("design:paramtypes", [subject_service_1.SubjectService])
], SubjectController);
//# sourceMappingURL=subject.controller.js.map