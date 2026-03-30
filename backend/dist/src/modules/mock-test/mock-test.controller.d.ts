import { Request as ExpressRequest } from 'express';
interface AuthenticatedRequest extends ExpressRequest {
    user: {
        otrId: string;
    };
}
import { MockTestService } from './mock-test.service';
import { StartMockAttemptDto, SubmitMockAttemptDto, SubmitExamAttemptDto } from './dto/mock-test.dto';
export declare class MockTestController {
    private readonly mockTestService;
    constructor(mockTestService: MockTestService);
    findAll(categoryId?: number, cursor?: number): Promise<{}>;
    startAttempt(dto: StartMockAttemptDto, req: AuthenticatedRequest): Promise<{
        id: number;
        startTime: Date | null;
    }>;
    submitAttempt(dto: SubmitMockAttemptDto, req: AuthenticatedRequest): Promise<{
        id: number;
        otrId: string;
        score: number;
        mockTestId: number;
    }>;
    submitExamAttempt(dto: SubmitExamAttemptDto, req: AuthenticatedRequest): Promise<{
        id: number;
        otrId: string;
        score: number;
        mockTestId: number;
    }>;
    getRecentAttempt(otrId: string, req: AuthenticatedRequest): Promise<{
        id: number;
        mockTest: {
            title: string;
        };
        score: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        totalMarks: number;
        correctAnswers: number | null;
        attemptedAt: Date;
    }[]>;
    calculateRank(mockTestId: number, otrId: string, req: AuthenticatedRequest): Promise<{
        rank: number;
        total: number;
        topPercentage: number;
        percentile: number;
        source: string;
        msg?: undefined;
    } | {
        msg: string;
        total: number;
        rank?: undefined;
        topPercentage?: undefined;
        percentile?: undefined;
        source?: undefined;
    }>;
    findOne(id: number): Promise<any>;
}
export {};
