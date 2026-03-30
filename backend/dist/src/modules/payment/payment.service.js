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
const prisma_service_1 = require("../../database/prisma.service");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const Razorpay = require('razorpay');
let PaymentService = PaymentService_1 = class PaymentService {
    prisma;
    configService;
    razorpay;
    logger = new common_1.Logger(PaymentService_1.name);
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.razorpay = new Razorpay({
            key_id: this.configService.get('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
        });
    }
    async createOrder(dto) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: dto.subscriptionId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
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
        const payment = await this.prisma.payment.create({
            data: {
                userId: dto.userId,
                subscriptionId: dto.subscriptionId,
                razorpayOrderId: razorpayOrder.id,
                amount: subscription.price,
                currency: 'INR',
                status: 'created',
            },
        });
        return {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            paymentId: payment.id,
            keyId: this.configService.get('RAZORPAY_KEY_ID'),
        };
    }
    async verifyPayment(dto) {
        const body = dto.razorpayOrderId + '|' + dto.razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', this.configService.get('RAZORPAY_KEY_SECRET') || '')
            .update(body)
            .digest('hex');
        this.logger.log(`Razorpay Debug: OrderId=${dto.razorpayOrderId}, PaymentId=${dto.razorpayPaymentId}`);
        const isValid = expectedSignature === dto.razorpaySignature;
        const payment = await this.prisma.payment.findUnique({
            where: { razorpayOrderId: dto.razorpayOrderId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment record not found');
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                razorpayPaymentId: dto.razorpayPaymentId,
                razorpaySignature: dto.razorpaySignature,
                status: isValid ? 'paid' : 'failed',
            },
            include: {
                subscription: true,
            },
        });
        if (!isValid) {
            throw new common_1.BadRequestException('Payment verification failed');
        }
        return {
            message: 'Payment verified successfully',
            payment: updatedPayment,
        };
    }
    async payWithCredits(userId, subscriptionId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const { price } = subscription;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const referralsAsReferee = await this.prisma.referral.findMany({
            where: { refereeOtrId: user.otrId }
        });
        let totalRefereeCredits = 0;
        for (const r of referralsAsReferee) {
            totalRefereeCredits += (r.creditsEarned || 0);
        }
        if (totalRefereeCredits < price) {
            throw new common_1.BadRequestException('Not enough credits to purchase this plan');
        }
        let remainingToDeduct = price;
        const updates = [];
        for (const r of referralsAsReferee) {
            if (remainingToDeduct <= 0)
                break;
            if (r.creditsEarned > 0) {
                const deduct = Math.min(r.creditsEarned, remainingToDeduct);
                updates.push(this.prisma.referral.update({
                    where: { id: r.id },
                    data: { creditsEarned: { decrement: deduct } }
                }));
                remainingToDeduct -= deduct;
            }
        }
        const transactionResult = await this.prisma.$transaction([
            ...updates,
            this.prisma.payment.create({
                data: {
                    userId,
                    subscriptionId,
                    amount: price,
                    currency: 'INR',
                    paymentMethod: 'credits',
                    status: 'paid',
                    razorpayOrderId: `credit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                },
            }),
        ]);
        const newPayment = transactionResult[transactionResult.length - 1];
        const remainingCredits = totalRefereeCredits - price;
        return {
            message: 'Subscription activated using credits',
            payment: newPayment,
            remainingCredits: remainingCredits,
        };
    }
    async getPaymentsByUser(userId) {
        return this.prisma.payment.findMany({
            where: { userId },
            include: { subscription: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllPayments() {
        return this.prisma.payment.findMany({
            include: { user: true, subscription: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map