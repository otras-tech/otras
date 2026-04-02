import { SubscriptionRepository } from './repository/subscription.repository';
import { CreateSubscriptionDto } from './dto/subscription.dto';
export declare class SubscriptionService {
    private readonly subscriptionRepository;
    constructor(subscriptionRepository: SubscriptionRepository);
    create(data: CreateSubscriptionDto): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    findAll(): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }[]>;
    findOne(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    update(id: number, data: Partial<CreateSubscriptionDto>): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    remove(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
}
