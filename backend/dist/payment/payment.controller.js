"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentController", {
    enumerable: true,
    get: function() {
        return PaymentController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
const _paymentservice = require("./payment.service");
const _createorderdto = require("./dto/create-order.dto");
const _verifypaymentdto = require("./dto/verify-payment.dto");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let PayWithCreditsDto = class PayWithCreditsDto {
    constructor(){
        this.subscriptionId = 0;
    }
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], PayWithCreditsDto.prototype, "subscriptionId", void 0);
let PaymentController = class PaymentController {
    createOrder(req, dto) {
        // Override userId from JWT token so it always refers to the authenticated user
        dto.userId = req.user.id;
        return this.paymentService.createOrder(dto);
    }
    verifyPayment(dto) {
        return this.paymentService.verifyPayment(dto);
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
    constructor(paymentService){
        this.paymentService = paymentService;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)('create-order'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _createorderdto.CreateOrderDto === "undefined" ? Object : _createorderdto.CreateOrderDto
    ]),
    _ts_metadata("design:returntype", void 0)
], PaymentController.prototype, "createOrder", null);
_ts_decorate([
    (0, _common.Post)('verify'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _verifypaymentdto.VerifyPaymentDto === "undefined" ? Object : _verifypaymentdto.VerifyPaymentDto
    ]),
    _ts_metadata("design:returntype", void 0)
], PaymentController.prototype, "verifyPayment", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)('pay-with-credits'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof PayWithCreditsDto === "undefined" ? Object : PayWithCreditsDto
    ]),
    _ts_metadata("design:returntype", void 0)
], PaymentController.prototype, "payWithCredits", null);
_ts_decorate([
    (0, _common.Get)('user/:userId'),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], PaymentController.prototype, "getPaymentsByUser", null);
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], PaymentController.prototype, "getAllPayments", null);
PaymentController = _ts_decorate([
    (0, _common.Controller)('payments'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paymentservice.PaymentService === "undefined" ? Object : _paymentservice.PaymentService
    ])
], PaymentController);

//# sourceMappingURL=payment.controller.js.map