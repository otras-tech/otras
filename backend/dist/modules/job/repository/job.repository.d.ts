import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class JobRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.JobUncheckedCreateInput): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }>;
    findAll(cursor?: number, take?: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }[]>;
    findById(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    } | null>;
    update(id: number, data: Prisma.JobUpdateInput): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }>;
    softDelete(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }>;
}
