"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentService", {
    enumerable: true,
    get: function() {
        return PaymentService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _crypto = /*#__PURE__*/ _interop_require_wildcard(require("crypto"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Razorpay = require('razorpay');
let PaymentService = class PaymentService {
    async createOrder(dto) {
        // Look up the subscription to get the price
        const subscription = await this.prisma.subscription.findUnique({
            where: {
                id: dto.subscriptionId
            }
        });
        if (!subscription) {
            throw new _common.NotFoundException('Subscription not found');
        }
        const amountInPaise = Math.round(subscription.price * 100);
        if (amountInPaise < 100) {
            throw new _common.BadRequestException('Order amount is less than the minimum amount allowed (₹1)');
        }
        let razorpayOrder;
        try {
            // Create Razorpay order (amount in paise = price * 100)
            razorpayOrder = await this.razorpay.orders.create({
                amount: amountInPaise,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            });
        } catch (error) {
            throw new _common.BadRequestException(error.error?.description || 'Failed to create Razorpay order');
        }
        // Save payment record in DB
        const payment = await this.prisma.payment.create({
            data: {
                userId: dto.userId,
                subscriptionId: dto.subscriptionId,
                razorpayOrderId: razorpayOrder.id,
                amount: subscription.price,
                currency: 'INR',
                status: 'created'
            }
        });
        return {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            paymentId: payment.id,
            keyId: process.env.RAZORPAY_KEY_ID
        };
    }
    async verifyPayment(dto) {
        // Generate expected signature
        const body = dto.razorpayOrderId + '|' + dto.razorpayPaymentId;
        const expectedSignature = _crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(body).digest('hex');
        console.log('--- RAZORPAY DEBUG LOG ---');
        console.log('Order ID:', dto.razorpayOrderId);
        console.log('Payment ID:', dto.razorpayPaymentId);
        console.log('Validating with Secret:', process.env.RAZORPAY_KEY_SECRET);
        console.log('Expected Signature:', expectedSignature);
        console.log('Received Signature:', dto.razorpaySignature);
        console.log('--------------------------');
        const isValid = expectedSignature === dto.razorpaySignature;
        // Find the payment record
        const payment = await this.prisma.payment.findUnique({
            where: {
                razorpayOrderId: dto.razorpayOrderId
            }
        });
        if (!payment) {
            throw new _common.NotFoundException('Payment record not found');
        }
        // Update payment status
        const updatedPayment = await this.prisma.payment.update({
            where: {
                id: payment.id
            },
            data: {
                razorpayPaymentId: dto.razorpayPaymentId,
                razorpaySignature: dto.razorpaySignature,
                status: isValid ? 'paid' : 'failed'
            },
            include: {
                subscription: true
            }
        });
        if (!isValid) {
            throw new _common.BadRequestException('Payment verification failed');
        }
        return {
            message: 'Payment verified successfully',
            payment: updatedPayment
        };
    }
    async payWithCredits(userId, subscriptionId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: {
                id: subscriptionId
            }
        });
        if (!subscription) {
            throw new _common.NotFoundException('Subscription not found');
        }
        const { price } = subscription;
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        // Find all Referral records where refereeOtrId === user.otrId
        const referralsAsReferee = await this.prisma.referral.findMany({
            where: {
                refereeOtrId: user.otrId
            }
        });
        let totalRefereeCredits = 0;
        for (const r of referralsAsReferee){
            totalRefereeCredits += r.creditsEarned || 0;
        }
        if (totalRefereeCredits < price) {
            throw new _common.BadRequestException('Not enough credits to purchase this plan');
        }
        // Deduct price explicitly from the matching Referral records
        let remainingToDeduct = price;
        const updates = [];
        for (const r of referralsAsReferee){
            if (remainingToDeduct <= 0) break;
            if (r.creditsEarned > 0) {
                const deduct = Math.min(r.creditsEarned, remainingToDeduct);
                updates.push(this.prisma.referral.update({
                    where: {
                        id: r.id
                    },
                    data: {
                        creditsEarned: {
                            decrement: deduct
                        }
                    }
                }));
                remainingToDeduct -= deduct;
            }
        }
        // Execute credit deduction from Referral table and payment creation in a transaction
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
                    razorpayOrderId: `credit_${Date.now()}_${Math.floor(Math.random() * 1000)}`
                }
            })
        ]);
        const newPayment = transactionResult[transactionResult.length - 1];
        const remainingCredits = totalRefereeCredits - price;
        return {
            message: 'Subscription activated using credits',
            payment: newPayment,
            remainingCredits: remainingCredits
        };
    }
    async getPaymentsByUser(userId) {
        return this.prisma.payment.findMany({
            where: {
                userId
            },
            include: {
                subscription: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async getAllPayments() {
        return this.prisma.payment.findMany({
            include: {
                user: true,
                subscription: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
};
PaymentService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], PaymentService);

//# sourceMappingURL=payment.service.js.map