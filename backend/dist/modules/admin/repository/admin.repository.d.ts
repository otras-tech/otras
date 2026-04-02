import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class AdminRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.AdminCreateInput): Promise<{
        password: string;
        isDeleted: boolean;
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        username: string;
    }>;
    findByEmail(email: string): Promise<{
        password: string;
        isDeleted: boolean;
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        username: string;
    } | null>;
    findByUsername(username: string): Promise<{
        password: string;
        isDeleted: boolean;
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        username: string;
    } | null>;
    findById(id: number): Promise<{
        password: string;
        isDeleted: boolean;
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        username: string;
    } | null>;
    softDelete(id: number): Promise<{
        password: string;
        isDeleted: boolean;
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        username: string;
    }>;
}
