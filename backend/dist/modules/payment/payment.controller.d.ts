import { PaymentService } from './payment.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/create-order.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createOrder(req: any, createOrderDto: CreateOrderDto): Promise<{
        orderId: string;
        amount: number;
        currency: string;
        paymentId: number;
        keyId: any;
    }>;
    verifyPayment(verifyPaymentDto: VerifyPaymentDto): Promise<{
        message: string;
        payment: {
            subscription: {
                isDeleted: boolean;
                title: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
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
            subscriptionId: number;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            amount: number;
            currency: string;
            paymentMethod: string;
        };
    }>;
    payWithCredits(req: any, dto: {
        subscriptionId: number;
    }): Promise<{
        message: string;
        payment: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            referrerId: number;
            refereeOtrId: string;
            status: string;
            creditsEarned: number;
        } | {
            userId: number;
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            subscriptionId: number;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            amount: number;
            currency: string;
            paymentMethod: string;
        };
        remainingCredits: number;
    }>;
    getPaymentsByUser(userId: string): Promise<({
        subscription: {
            isDeleted: boolean;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
            password: string;
            role: string;
            isDeleted: boolean;
            email: string;
            firstName: string;
            lastName: string;
            otrId: string;
            age: number | null;
            category: string | null;
            highestDegree: string | null;
            careerPreference: string | null;
            domicile: string | null;
            pincode: string | null;
            referralCode: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            credits: number;
            preferredLanguage: string;
        };
        subscription: {
            isDeleted: boolean;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
        subscriptionId: number;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        paymentMethod: string;
    })[]>;
}
