import { PrismaService } from '../prisma/prisma.service';
import { SubmitTestDto } from './dto/result.dto';
import { Queue } from 'bullmq';
import { ResultProcessor } from './result.processor';
export declare class ResultService {
    private readonly resultQueue;
    private readonly prisma;
    private readonly resultProcessor;
    private readonly logger;
    constructor(resultQueue: Queue, prisma: PrismaService, resultProcessor: ResultProcessor);
    startTest(userId: number, testId: number, tier?: number): Promise<{
        id: number;
        startTime: Date | null;
    }>;
    calculateAndSave(dto: SubmitTestDto): Promise<{
        message: string;
        resultId: number;
    }>;
    getUserResults(userId: number, cursor?: number): Promise<{
        id: number;
        createdAt: Date;
        score: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        submitTime: Date | null;
        test: {
            _count: {
                questions: number;
            };
            name: string;
        };
    }[]>;
    checkOwnership(resultId: number, userId: number): Promise<boolean>;
}
