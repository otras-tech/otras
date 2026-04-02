import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSubscriptionById(id: number) {
    return this.prisma.subscription.findUnique({
      where: { id, isDeleted: false },
    });
  }

  async createPayment(data: Prisma.PaymentCreateInput) {
    return this.prisma.payment.create({ data });
  }

  async findPaymentByOrderId(razorpayOrderId: string) {
    return this.prisma.payment.findUnique({
      where: { razorpayOrderId, isDeleted: false },
    });
  }

  async findByIdempotencyKey(idempotencyKey: string) {
    return this.prisma.payment.findUnique({
      where: { idempotencyKey, isDeleted: false },
    });
  }

  async updateStatusAtomic(
    razorpayOrderId: string,
    newStatus: string,
    incomingStatus: string,
    additionalData: Prisma.PaymentUpdateInput = {},
  ) {
    return this.prisma.payment.updateMany({
      where: { razorpayOrderId, status: incomingStatus, isDeleted: false },
      data: { ...additionalData, status: newStatus },
    });
  }

  async updatePayment(id: number, data: Prisma.PaymentUpdateInput) {
    return this.prisma.payment.update({
      where: { id },
      data,
      include: { subscription: true },
    });
  }

  async findPaymentsByUserId(userId: number, cursor?: number, take?: number) {
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

  async findAllPayments(cursor?: number, take?: number) {
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

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
