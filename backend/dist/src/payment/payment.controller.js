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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const payment_service_1 = require("./payment.service");
const swagger_1 = require("@nestjs/swagger");
const create_order_dto_1 = require("./dto/create-order.dto");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    createOrder(req, createOrderDto) {
        createOrderDto.userId = req.user.id;
        return this.paymentService.createOrder(createOrderDto);
    }
    verifyPayment(verifyPaymentDto) {
        return this.paymentService.verifyPayment(verifyPaymentDto);
    }
    payWithCredits(req, dto) {
        return this.paymentService.payWithCredits(req.user.id, dto.subscriptionId);
    }
    getPaymentsByUser(userId) {
        return this.paymentService.getPaymentsByUser(+userId);
    }
    getAllPayments() {
        return this.paymentService.getAllPayments();
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)('create-order'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a Razorpay order for a subscription' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a Razorpay payment signature' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment verified and subscription activated' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.VerifyPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)('pay-with-credits'),
    (0, swagger_1.ApiOperation)({ summary: 'Pay for a subscription using user credits' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment successful with credits' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "payWithCredits", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getPaymentsByUser", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getAllPayments", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map