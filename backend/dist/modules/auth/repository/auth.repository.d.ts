import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class AuthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createRefreshToken(data: Prisma.RefreshTokenUncheckedCreateInput, tx?: Prisma.TransactionClient): Promise<{
        tokenHash: string;
        userId: number;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        userType: string;
        expiresAt: Date;
    }>;
    findTokenById(id: string): Promise<{
        tokenHash: string;
        userId: number;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        userType: string;
        expiresAt: Date;
    } | null>;
    deleteToken(id: string, tx?: Prisma.TransactionClient): Promise<{
        tokenHash: string;
        userId: number;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        userType: string;
        expiresAt: Date;
    } | null>;
    deleteTokensByUserId(userId: number, userType: string, tx?: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;
    deleteTokenByJti(id: string, userId: number, userType: string): Promise<Prisma.BatchPayload>;
    countTokensByUserId(userId: number, userType: string, tx?: Prisma.TransactionClient): Promise<number>;
    findOldestSession(userId: number, userType: string, tx?: Prisma.TransactionClient): Promise<{
        tokenHash: string;
        userId: number;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        userType: string;
        expiresAt: Date;
    } | null>;
    runTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
