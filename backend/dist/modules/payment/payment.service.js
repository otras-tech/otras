"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const payment_repository_1 = require("./repository/payment.repository");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const Razorpay = require('razorpay');
let PaymentService = PaymentService_1 = class PaymentService {
    paymentRepository;
    configService;
    razorpay;
    logger = new common_1.Logger(PaymentService_1.name);
    constructor(paymentRepository, configService) {
        this.paymentRepository = paymentRepository;
        this.configService = configService;
        this.razorpay = new Razorpay({
            key_id: this.configService.get('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
        });
    }
    async createOrder(requesterId, dto, idempotencyKey) {
        if (idempotencyKey) {
            const existing = await this.paymentRepository.findByIdempotencyKey(idempotencyKey);
            if (existing)
                return { orderId: existing.razorpayOrderId, amount: existing.amount, currency: existing.currency, paymentId: existing.id, keyId: this.configService.get('RAZORPAY_KEY_ID') };
        }
        if (requesterId !== dto.userId) {
            throw new common_1.ForbiddenException('You can only create orders for yourself');
        }
        const subscription = await this.paymentRepository.findSubscriptionById(dto.subscriptionId);
        if (!subscription)
            throw new common_1.NotFoundException('Subscription not found');
        const amountInPaise = Math.round(subscription.price * 100);
        if (amountInPaise < 100) {
            throw new common_1.BadRequestException('Order amount is less than the minimum amount allowed (₹1)');
        }
        let razorpayOrder;
        try {
            razorpayOrder = await this.razorpay.orders.create({
                amount: amountInPaise,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.error?.description || 'Failed to create Razorpay order');
        }
        const payment = await this.paymentRepository.createPayment({
            user: { connect: { id: dto.userId } },
            subscription: { connect: { id: dto.subscriptionId } },
            razorpayOrderId: razorpayOrder.id,
            amount: subscription.price,
            currency: 'INR',
            status: 'created',
            idempotencyKey,
        });
        return {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            paymentId: payment.id,
            keyId: this.configService.get('RAZORPAY_KEY_ID'),
        };
    }
    async verifyPayment(dto, idempotencyKey) {
        if (idempotencyKey) {
            const existing = await this.paymentRepository.findByIdempotencyKey(idempotencyKey);
            if (existing && existing.status === 'paid')
                return { message: 'Payment verified successfully (idempotent)', payment: existing };
        }
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = dto;
        const body = dto.razorpayOrderId + '|' + dto.razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', this.configService.get('RAZORPAY_KEY_SECRET') || '')
            .update(body)
            .digest('hex');
        this.logger.log(`Razorpay Debug: OrderId=${dto.razorpayOrderId}, PaymentId=${dto.razorpayPaymentId}`);
        const isValid = expectedSignature === dto.razorpaySignature;
        const status = isValid ? 'paid' : 'failed';
        const updateResult = await this.paymentRepository.updateStatusAtomic(razorpayOrderId, status, 'created', { razorpayPaymentId, razorpaySignature, idempotencyKey });
        if (updateResult.count === 0) {
            const existing = await this.paymentRepository.findPaymentByOrderId(razorpayOrderId);
            if (existing?.status === 'paid')
                return { message: 'Payment verified successfully (concurrent)', payment: existing };
            throw new common_1.BadRequestException('Payment already processed or not found');
        }
        const updatedPayment = await this.paymentRepository.findPaymentByOrderId(razorpayOrderId);
        if (!isValid)
            throw new common_1.BadRequestException('Payment verification failed');
        return { message: 'Payment verified successfully', payment: updatedPayment };
    }
    async payWithCredits(requesterId, userId, subscriptionId, idempotencyKey) {
        if (idempotencyKey) {
            const existing = await this.paymentRepository.findByIdempotencyKey(idempotencyKey);
            if (existing && existing.status === 'paid')
                return { message: 'Subscription activated using credits (idempotent)', payment: existing };
        }
        if (requesterId !== userId) {
            throw new common_1.ForbiddenException('You can only use your own credits');
        }
        return await this.paymentRepository.$transaction(async (tx) => {
            const subscription = await tx.subscription.findUnique({
                where: { id: subscriptionId },
            });
            if (!subscription)
                throw new common_1.NotFoundException('Subscription not found');
            const { price } = subscription;
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: { id: true, otrId: true },
            });
            if (!user)
                throw new common_1.NotFoundException('User not found');
            const referrals = await tx.referral.findMany({
                where: { refereeOtrId: user.otrId, creditsEarned: { gt: 0 } },
                orderBy: { createdAt: 'asc' },
            });
            const totalCredits = referrals.reduce((sum, r) => sum + (r.creditsEarned || 0), 0);
            if (totalCredits < price) {
                throw new common_1.BadRequestException(`Insufficient credits. Required: ${price}, Available: ${totalCredits}`);
            }
            let remainingToDeduct = price;
            for (const referral of referrals) {
                if (remainingToDeduct <= 0)
                    break;
                const deduct = Math.min(referral.creditsEarned, remainingToDeduct);
                const updateResult = await tx.referral.updateMany({
                    where: { id: referral.id, creditsEarned: { gte: deduct } },
                    data: { creditsEarned: { decrement: deduct } },
                });
                if (updateResult.count === 0) {
                    throw new common_1.InternalServerErrorException('Concurrency error: Credits were modified by another request. Please retry.');
                }
                remainingToDeduct -= deduct;
            }
            const newPayment = await tx.payment.create({
                data: {
                    userId,
                    subscriptionId,
                    amount: price,
                    currency: 'INR',
                    paymentMethod: 'credits',
                    status: 'paid',
                    razorpayOrderId: `credit_${user.otrId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    idempotencyKey,
                },
            });
            return {
                message: 'Subscription activated using credits',
                payment: newPayment,
                remainingCredits: totalCredits - price,
            };
        });
    }
    async getPaymentsByUser(requesterId, requesterRole, userId, cursor, take) {
        if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('You can only view your own payments');
        }
        return this.paymentRepository.findPaymentsByUserId(userId, cursor, take);
    }
    async getAllPayments(cursor, take) {
        return this.paymentRepository.findAllPayments(cursor, take);
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payment_repository_1.PaymentRepository,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map