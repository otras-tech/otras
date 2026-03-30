import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    } | null>;
    update(id: number, data: Partial<CreateSubscriptionDto>): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
}
