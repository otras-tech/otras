import { PrismaService } from '../../../database/prisma.service';
export declare class ResultRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPlaceholder(userId: number, testId: number, tier?: number): Promise<{
        id: number;
        startTime: Date | null;
    }>;
    findById(id: number): Promise<{
        userId: number;
        id: number;
    } | null>;
    findByUserId(userId: number, cursor?: number, take?: number): Promise<{
        test: {
            _count: {
                questions: number;
            };
            name: string;
        };
        id: number;
        createdAt: Date;
        score: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        submitTime: Date | null;
    }[]>;
    checkOwnership(resultId: number, userId: number): Promise<boolean>;
}
