import { PrismaService } from '../prisma/prisma.service';
export declare class JobService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }>;
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        status: string;
        description: string;
        title: string;
        deadline: Date;
    } | null>;
}
