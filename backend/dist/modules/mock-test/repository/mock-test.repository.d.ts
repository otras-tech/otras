import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class MockTestRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(categoryId: number | undefined, cursor: number | undefined, take: number): Promise<{
        id: number;
        category: {
            name: string;
        };
        title: string;
        duration: number;
    }[]>;
    findById(id: number): Promise<{
        exam: {
            name: string;
        } | null;
        id: number;
        category: {
            name: string;
        };
        title: string;
        duration: number;
    } | null>;
    findAttemptById(id: number): Promise<{
        otrId: string;
    } | null>;
    findUserByOtrId(otrId: string): Promise<{
        id: number;
    } | null>;
    findMockTestByIdActive(id: number): Promise<{
        id: number;
    } | null>;
    findTestByIdActive(id: number): Promise<{
        examId: number;
    } | null>;
    findExamByIdActive(id: number): Promise<{
        name: string;
    } | null>;
    findMockTestByExamAndCategory(examId: number, categoryId: number): Promise<{
        id: number;
    } | null>;
    upsertCategory(name: string): Promise<{
        id: number;
    }>;
    getUserMockAttempts(otrId: string, cursor?: number): Promise<{
        mockTest: {
            title: string;
        };
        id: number;
        score: number;
        totalMarks: number;
        subjectBreakdown: Prisma.JsonValue;
        correctAnswers: number | null;
        attemptedAt: Date;
    }[]>;
    findBestAttempt(mockTestId: number, otrId: string): Promise<{
        score: number;
        attemptedAt: Date;
    } | null>;
    countBetterAttempts(mockTestId: number, score: number, beforeDate: Date): Promise<number>;
    countAttempts(mockTestId: number): Promise<number>;
    $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
