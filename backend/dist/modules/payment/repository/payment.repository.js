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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let PaymentRepository = class PaymentRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findSubscriptionById(id) {
        return this.prisma.subscription.findUnique({
            where: { id, isDeleted: false },
        });
    }
    async createPayment(data) {
        return this.prisma.payment.create({ data });
    }
    async findPaymentByOrderId(razorpayOrderId) {
        return this.prisma.payment.findUnique({
            where: { razorpayOrderId, isDeleted: false },
        });
    }
    async findByIdempotencyKey(idempotencyKey) {
        return this.prisma.payment.findUnique({
            where: { idempotencyKey, isDeleted: false },
        });
    }
    async updateStatusAtomic(razorpayOrderId, newStatus, incomingStatus, additionalData = {}) {
        return this.prisma.payment.updateMany({
            where: { razorpayOrderId, status: incomingStatus, isDeleted: false },
            data: { ...additionalData, status: newStatus },
        });
    }
    async updatePayment(id, data) {
        return this.prisma.payment.update({
            where: { id },
            data,
            include: { subscription: true },
        });
    }
    async findPaymentsByUserId(userId, cursor, take) {
        const safeTake = Math.min(take || 20, 100);
        return this.prisma.payment.findMany({
            where: { userId, isDeleted: false },
            include: { subscription: true },
            take: safeTake,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllPayments(cursor, take) {
        const safeTake = Math.min(take || 20, 100);
        return this.prisma.payment.findMany({
            where: { isDeleted: false },
            include: { user: true, subscription: true },
            take: safeTake,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async $transaction(fn) {
        return this.prisma.$transaction(fn);
    }
};
exports.PaymentRepository = PaymentRepository;
exports.PaymentRepository = PaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentRepository);
//# sourceMappingURL=payment.repository.js.map