import { PaymentService } from './payment.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/create-order.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createOrder(req: any, createOrderDto: CreateOrderDto, idempotencyKey?: string): Promise<{
        orderId: string;
        amount: number;
        currency: string;
        paymentId: number;
        keyId: any;
    }>;
    verifyPayment(verifyPaymentDto: VerifyPaymentDto, idempotencyKey?: string): Promise<{
        message: string;
        payment: {
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
        } | null;
    }>;
    payWithCredits(req: any, dto: {
        subscriptionId: number;
    }, idempotencyKey?: string): Promise<{
        message: string;
        payment: {
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
        };
        remainingCredits: number;
    } | {
        message: string;
        payment: {
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
        };
    }>;
    getPaymentsByUser(userId: number, req: any, cursor?: number, take?: number): Promise<({
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
    getAllPayments(cursor?: number, take?: number): Promise<({
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
}
