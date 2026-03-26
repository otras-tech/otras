import { PaymentService } from './payment.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/create-order.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createOrder(req: any, createOrderDto: CreateOrderDto): Promise<{
        orderId: any;
        amount: any;
        currency: any;
        paymentId: number;
        keyId: string | undefined;
    }>;
    verifyPayment(verifyPaymentDto: VerifyPaymentDto): Promise<{
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
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
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
        payment: any;
        remainingCredits: number;
    }>;
    getPaymentsByUser(userId: string): Promise<({
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
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
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
            createdAt: Date;
            updatedAt: Date;
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
            credits: number;
            referralCode: string;
            preferredLanguage: string;
            isDeleted: boolean;
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
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
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
