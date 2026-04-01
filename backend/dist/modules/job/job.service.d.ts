import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class JobService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.JobCreateInput): Promise<{
        isDeleted: boolean;
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        deadline: Date;
    }>;
    findAll(): Promise<{
        isDeleted: boolean;
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        deadline: Date;
    }[]>;
    findOne(id: number): Promise<{
        isDeleted: boolean;
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        deadline: Date;
    } | null>;
}
