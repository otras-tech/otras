import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { ConfigService } from '@nestjs/config';
export declare class PaymentService {
    private prisma;
    private configService;
    private razorpay;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    createOrder(dto: CreateOrderDto): Promise<{
        orderId: any;
        amount: any;
        currency: any;
        paymentId: number;
        keyId: any;
    }>;
    verifyPayment(dto: VerifyPaymentDto): Promise<{
        message: string;
        payment: {
            subscription: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                isDeleted: boolean;
                title: string;
                price: number;
                features: string[];
                isRecommended: boolean;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            userId: number;
            status: string;
            subscriptionId: number;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            amount: number;
            currency: string;
            paymentMethod: string;
        };
    }>;
    payWithCredits(userId: number, subscriptionId: number): Promise<{
        message: string;
        payment: any;
        remainingCredits: number;
    }>;
    getPaymentsByUser(userId: number): Promise<({
        subscription: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            title: string;
            price: number;
            features: string[];
            isRecommended: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        userId: number;
        status: string;
        subscriptionId: number;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        paymentMethod: string;
    })[]>;
    getAllPayments(): Promise<({
        user: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
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
            isDeleted: boolean;
            role: string;
        };
        subscription: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            title: string;
            price: number;
            features: string[];
            isRecommended: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        userId: number;
        status: string;
        subscriptionId: number;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        paymentMethod: string;
    })[]>;
}
