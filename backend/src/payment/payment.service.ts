import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import * as crypto from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Razorpay = require('razorpay');

@Injectable()
export class PaymentService {
  private razorpay: any;

  constructor(private prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(dto: CreateOrderDto) {
    // Look up the subscription to get the price
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: dto.subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const amountInPaise = Math.round(subscription.price * 100);

    if (amountInPaise < 100) {
      throw new BadRequestException('Order amount is less than the minimum amount allowed (₹1)');
    }

    let razorpayOrder;
    try {
      // Create Razorpay order (amount in paise = price * 100)
      razorpayOrder = await this.razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });
    } catch (error) {
      throw new BadRequestException(
        error.error?.description || 'Failed to create Razorpay order'
      );
    }

    // Save payment record in DB
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
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    // Generate expected signature
    const body = dto.razorpayOrderId + '|' + dto.razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

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
      where: { razorpayOrderId: dto.razorpayOrderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    // Update payment status
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
      throw new BadRequestException('Payment verification failed');
    }

    return {
      message: 'Payment verified successfully',
      payment: updatedPayment,
    };
  }

  async payWithCredits(userId: number, subscriptionId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const { price } = subscription;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find all Referral records where refereeOtrId === user.otrId
    const referralsAsReferee = await this.prisma.referral.findMany({
      where: { refereeOtrId: user.otrId }
    });

    let totalRefereeCredits = 0;
    for (const r of referralsAsReferee) {
      totalRefereeCredits += (r.creditsEarned || 0);
    }

    if (totalRefereeCredits < price) {
      throw new BadRequestException('Not enough credits to purchase this plan');
    }

    // Deduct price explicitly from the matching Referral records
    let remainingToDeduct = price;
    const updates: any[] = [];
    for (const r of referralsAsReferee) {
      if (remainingToDeduct <= 0) break;
      if (r.creditsEarned > 0) {
        const deduct = Math.min(r.creditsEarned, remainingToDeduct);
        updates.push(
          this.prisma.referral.update({
            where: { id: r.id },
            data: { creditsEarned: { decrement: deduct } }
          })
        );
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
          status: 'paid', // Activating immediately since credits are native
          razorpayOrderId: `credit_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // unique placeholder
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

  async getPaymentsByUser(userId: number) {
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
}
