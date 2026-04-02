import { ResultRepository } from './repository/result.repository';
import { SubmitTestDto } from './dto/result.dto';
import { Queue } from 'bullmq';
import { ResultProcessor } from './result.processor';
export declare class ResultService {
    private readonly resultQueue;
    private readonly resultRepository;
    private readonly resultProcessor;
    private readonly logger;
    constructor(resultQueue: Queue, resultRepository: ResultRepository, resultProcessor: ResultProcessor);
    startTest(requesterId: number, userId: number, testId: number, tier?: number): Promise<{
        id: number;
        startTime: Date | null;
    }>;
    calculateAndSave(requesterId: number, dto: SubmitTestDto): Promise<{
        message: string;
        resultId: number;
    }>;
    getUserResults(userId: number, cursor?: number, take?: number): Promise<{
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
