export declare class CreateOrderDto {
    userId: number;
    subscriptionId: number;
}
export declare class VerifyPaymentDto {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}
