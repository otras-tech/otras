import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class PaymentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findSubscriptionById(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    } | null>;
    createPayment(data: Prisma.PaymentCreateInput): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        idempotencyKey: string | null;
        paymentMethod: string;
        subscriptionId: number;
    }>;
    findPaymentByOrderId(razorpayOrderId: string): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        idempotencyKey: string | null;
        paymentMethod: string;
        subscriptionId: number;
    } | null>;
    findByIdempotencyKey(idempotencyKey: string): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        idempotencyKey: string | null;
        paymentMethod: string;
        subscriptionId: number;
    } | null>;
    updateStatusAtomic(razorpayOrderId: string, newStatus: string, incomingStatus: string, additionalData?: Prisma.PaymentUpdateInput): Promise<Prisma.BatchPayload>;
    updatePayment(id: number, data: Prisma.PaymentUpdateInput): Promise<{
        subscription: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            price: number;
            features: string[];
            isRecommended: boolean;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        idempotencyKey: string | null;
        paymentMethod: string;
        subscriptionId: number;
    }>;
    findPaymentsByUserId(userId: number, cursor?: number, take?: number): Promise<({
        subscription: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            price: number;
            features: string[];
            isRecommended: boolean;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        idempotencyKey: string | null;
        paymentMethod: string;
        subscriptionId: number;
    })[]>;
    findAllPayments(cursor?: number, take?: number): Promise<({
        user: {
            password: string;
            role: string;
            isDeleted: boolean;
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            age: number | null;
            category: string | null;
            otrId: string;
            highestDegree: string | null;
            careerPreference: string | null;
            domicile: string | null;
            pincode: string | null;
            createdAt: Date;
            updatedAt: Date;
            credits: number;
            referralCode: string;
            preferredLanguage: string;
        };
        subscription: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            price: number;
            features: string[];
            isRecommended: boolean;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        idempotencyKey: string | null;
        paymentMethod: string;
        subscriptionId: number;
    })[]>;
    $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
