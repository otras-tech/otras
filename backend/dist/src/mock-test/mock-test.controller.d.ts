import { MockTestService } from './mock-test.service';
import { StartMockAttemptDto, SubmitMockAttemptDto, SubmitExamAttemptDto } from './dto/mock-test.dto';
export declare class MockTestController {
    private readonly mockTestService;
    constructor(mockTestService: MockTestService);
    findAll(categoryId?: number, cursor?: number): Promise<{}>;
    startAttempt(dto: StartMockAttemptDto, req: any): Promise<{
        id: number;
        startTime: Date | null;
    }>;
    submitAttempt(dto: SubmitMockAttemptDto, req: any): Promise<{
        id: number;
        score: number;
    }>;
    submitExamAttempt(dto: SubmitExamAttemptDto, req: any): Promise<{
        id: number;
        score: number;
    }>;
    getRecentAttempt(otrId: string, req: any): Promise<{
        mockTest: {
            title: string;
        };
        id: number;
        score: number;
        totalMarks: number;
        correctAnswers: number | null;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        attemptedAt: Date;
    }[]>;
    calculateRank(mockTestId: number, otrId: string, req: any): Promise<{
        msg: string;
        total: number;
        rank?: undefined;
        topPercentage?: undefined;
        percentile?: undefined;
    } | {
        rank: number;
        total: number;
        topPercentage: number;
        percentile: number;
        msg?: undefined;
    }>;
    findOne(id: number): Promise<{}>;
}
