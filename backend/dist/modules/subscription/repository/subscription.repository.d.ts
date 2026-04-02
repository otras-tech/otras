import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class SubscriptionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SubscriptionCreateInput): Promise<{
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
    findById(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    } | null>;
    update(id: number, data: Prisma.SubscriptionUpdateInput): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        price: number;
        features: string[];
        isRecommended: boolean;
    }>;
    softDelete(id: number): Promise<{
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
