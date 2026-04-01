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
exports.ApplicationController = void 0;
const common_1 = require("@nestjs/common");
const application_service_1 = require("./application.service");
const swagger_1 = require("@nestjs/swagger");
const application_dto_1 = require("./dto/application.dto");
let ApplicationController = class ApplicationController {
    applicationService;
    constructor(applicationService) {
        this.applicationService = applicationService;
    }
    create(dto) {
        return this.applicationService.create(dto.userId, dto.examId);
    }
    findByOtrId(otrId) {
        return this.applicationService.findByOtrId(otrId);
    }
    findByUser(userId) {
        return this.applicationService.findByUser(userId);
    }
    findAll() {
        return this.applicationService.findAll();
    }
    updateStatus(id, statusData) {
        return this.applicationService.updateStatus(id, statusData);
    }
};
exports.ApplicationController = ApplicationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a new exam application' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Application submitted' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [application_dto_1.CreateApplicationDto]),
    __metadata("design:returntype", void 0)
], ApplicationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('user/otr/:otrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get applications by OTR ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of applications for the user',
    }),
    __param(0, (0, common_1.Param)('otrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicationController.prototype, "findByOtrId", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get applications by User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of applications for the user',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ApplicationController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all applications (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all applications' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApplicationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update application status phases (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application status updated' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, application_dto_1.UpdateApplicationStatusDto]),
    __metadata("design:returntype", void 0)
], ApplicationController.prototype, "updateStatus", null);
exports.ApplicationController = ApplicationController = __decorate([
    (0, swagger_1.ApiTags)('Applications'),
    (0, common_1.Controller)('applications'),
    __metadata("design:paramtypes", [application_service_1.ApplicationService])
], ApplicationController);
//# sourceMappingURL=application.controller.js.map