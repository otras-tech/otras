import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<{
        isDeleted: boolean;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    findAll(): Promise<{
        isDeleted: boolean;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        features: string[];
        isRecommended: boolean;
    }[]>;
    findOne(id: number): Promise<{
        isDeleted: boolean;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        features: string[];
        isRecommended: boolean;
    } | null>;
    update(id: number, data: Partial<CreateSubscriptionDto>): Promise<{
        isDeleted: boolean;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    remove(id: number): Promise<{
        isDeleted: boolean;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
}
