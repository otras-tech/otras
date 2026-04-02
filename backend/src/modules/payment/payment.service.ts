import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PaymentRepository } from './repository/payment.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Razorpay = require('razorpay');

@Injectable()
export class PaymentService {
  private razorpay!: {
    orders: {
      create(options: {
        amount: number;
        currency: string;
        receipt: string;
      }): Promise<{ id: string; amount: number; currency: string }>;
    };
  };
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(requesterId: number, dto: CreateOrderDto, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.paymentRepository.findByIdempotencyKey(idempotencyKey);
      if (existing) return { orderId: existing.razorpayOrderId, amount: existing.amount, currency: existing.currency, paymentId: existing.id, keyId: this.configService.get('RAZORPAY_KEY_ID') };
    }
    // Ownership: user can only create orders for themselves
    if (requesterId !== dto.userId) {
      throw new ForbiddenException('You can only create orders for yourself');
    }

    const subscription = await this.paymentRepository.findSubscriptionById(dto.subscriptionId);
    if (!subscription) throw new NotFoundException('Subscription not found');

    const amountInPaise = Math.round(subscription.price * 100);
    if (amountInPaise < 100) {
      throw new BadRequestException(
        'Order amount is less than the minimum amount allowed (₹1)',
      );
    }

    let razorpayOrder;
    try {
      razorpayOrder = await this.razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });
    } catch (error: any) {
      throw new BadRequestException(
        error.error?.description || 'Failed to create Razorpay order',
      );
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

  async verifyPayment(dto: VerifyPaymentDto, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.paymentRepository.findByIdempotencyKey(idempotencyKey);
      if (existing && existing.status === 'paid') return { message: 'Payment verified successfully (idempotent)', payment: existing };
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = dto;
    const body = dto.razorpayOrderId + '|' + dto.razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', this.configService.get('RAZORPAY_KEY_SECRET') || '')
      .update(body)
      .digest('hex');

    this.logger.log(
      `Razorpay Debug: OrderId=${dto.razorpayOrderId}, PaymentId=${dto.razorpayPaymentId}`,
    );

    const isValid = expectedSignature === dto.razorpaySignature;

    const status = isValid ? 'paid' : 'failed';

    const updateResult = await this.paymentRepository.updateStatusAtomic(
      razorpayOrderId,
      status,
      'created',
      { razorpayPaymentId, razorpaySignature, idempotencyKey },
    );

    if (updateResult.count === 0) {
      const existing = await this.paymentRepository.findPaymentByOrderId(razorpayOrderId);
      if (existing?.status === 'paid') return { message: 'Payment verified successfully (concurrent)', payment: existing };
      throw new BadRequestException('Payment already processed or not found');
    }

    const updatedPayment = await this.paymentRepository.findPaymentByOrderId(razorpayOrderId);

    if (!isValid) throw new BadRequestException('Payment verification failed');

    return { message: 'Payment verified successfully', payment: updatedPayment };
  }

  async payWithCredits(requesterId: number, userId: number, subscriptionId: number, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.paymentRepository.findByIdempotencyKey(idempotencyKey);
      if (existing && existing.status === 'paid') return { message: 'Subscription activated using credits (idempotent)', payment: existing };
    }
    // Ownership: user can only pay with their own credits
    if (requesterId !== userId) {
      throw new ForbiddenException('You can only use your own credits');
    }

    return await this.paymentRepository.$transaction(async (tx) => {
      const subscription = await tx.subscription.findUnique({
        where: { id: subscriptionId },
      });
      if (!subscription) throw new NotFoundException('Subscription not found');

      const { price } = subscription;

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, otrId: true },
      });
      if (!user) throw new NotFoundException('User not found');

      const referrals = await tx.referral.findMany({
        where: { refereeOtrId: user.otrId, creditsEarned: { gt: 0 } },
        orderBy: { createdAt: 'asc' },
      });

      const totalCredits = referrals.reduce(
        (sum, r) => sum + (r.creditsEarned || 0),
        0,
      );

      if (totalCredits < price) {
        throw new BadRequestException(
          `Insufficient credits. Required: ${price}, Available: ${totalCredits}`,
        );
      }

      let remainingToDeduct = price;
      for (const referral of referrals) {
        if (remainingToDeduct <= 0) break;
        const deduct = Math.min(referral.creditsEarned, remainingToDeduct);

        const updateResult = await tx.referral.updateMany({
          where: { id: referral.id, creditsEarned: { gte: deduct } },
          data: { creditsEarned: { decrement: deduct } },
        });

        if (updateResult.count === 0) {
          throw new InternalServerErrorException(
            'Concurrency error: Credits were modified by another request. Please retry.',
          );
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

  /**
   * Ownership enforced: user can only view their own payment history.
   */
  async getPaymentsByUser(
    requesterId: number,
    requesterRole: string,
    userId: number,
    cursor?: number,
    take?: number,
  ) {
    if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('You can only view your own payments');
    }
    return this.paymentRepository.findPaymentsByUserId(userId, cursor, take);
  }

  async getAllPayments(cursor?: number, take?: number) {
    return this.paymentRepository.findAllPayments(cursor, take);
  }
}
