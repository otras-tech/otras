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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const check_ownership_decorator_1 = require("../../common/decorators/check-ownership.decorator");
const ownership_guard_1 = require("../../common/guards/ownership.guard");
const user_service_1 = require("./user.service");
const update_user_dto_1 = require("./dto/update-user.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async findAll(cursor, take) {
        return this.userService.findAll(cursor, take);
    }
    async findOne(id) {
        return this.userService.findById(id);
    }
    async getDashboardData(id) {
        return this.userService.getDashboardData(id);
    }
    async update(id, data) {
        return this.userService.update(id, data);
    }
    async remove(id) {
        return this.userService.remove(id);
    }
    async getTierStatus(id) {
        return this.userService.getTierStatus(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Find all users (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all users' }),
    __param(0, (0, common_1.Query)('cursor', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('take', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, check_ownership_decorator_1.CheckOwnership)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID (Self or Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User record' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/dashboard'),
    (0, check_ownership_decorator_1.CheckOwnership)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get unified dashboard data (Results + Mock Attempts)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Aggregated dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Access denied' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDashboardData", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, check_ownership_decorator_1.CheckOwnership)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, swagger_1.ApiOperation)({ summary: 'Update your profile (Self or Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Access denied' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a user (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/tier-status'),
    (0, check_ownership_decorator_1.CheckOwnership)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get tier status for a user (Self or Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Access denied' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTierStatus", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, ownership_guard_1.OwnershipGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map