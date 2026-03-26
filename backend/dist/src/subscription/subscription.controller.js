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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const subscription_service_1 = require("./subscription.service");
const admin_auth_guard_1 = require("../auth/guards/admin-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const subscription_dto_1 = require("./dto/subscription.dto");
let SubscriptionController = class SubscriptionController {
    subscriptionService;
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    create(createSubscriptionDto) {
        return this.subscriptionService.create(createSubscriptionDto);
    }
    findAll() {
        return this.subscriptionService.findAll();
    }
    findOne(id) {
        return this.subscriptionService.findOne(id);
    }
    update(id, data) {
        return this.subscriptionService.update(id, data);
    }
    remove(id) {
        return this.subscriptionService.remove(id);
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new subscription plan (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subscription plan created' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active subscription plans' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of subscription plans' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subscription plan by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription plan details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscription plan not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a subscription plan (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription plan updated' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a subscription plan (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription plan deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "remove", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, swagger_1.ApiTags)('Subscriptions'),
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionController);
//# sourceMappingURL=subscription.controller.js.map