import { MockTestService } from './mock-test.service';
import { StartMockAttemptDto, SubmitMockAttemptDto, SubmitExamAttemptDto } from './dto/mock-test.dto';
import { RequestUser } from '../../common/types/types';
export declare class MockTestController {
    private readonly mockTestService;
    constructor(mockTestService: MockTestService);
    findAll(categoryId?: number, cursor?: number): Promise<{
        id: number;
        category: {
            name: string;
        };
        title: string;
        duration: number;
    }[]>;
    startAttempt(dto: StartMockAttemptDto, user: RequestUser): Promise<{
        id: number;
        startTime: Date | null;
    }>;
    submitAttempt(dto: SubmitMockAttemptDto, user: RequestUser): Promise<{
        id: number;
        otrId: string;
        score: number;
        mockTestId: number;
    }>;
    submitExamAttempt(dto: SubmitExamAttemptDto, user: RequestUser): Promise<{
        id: number;
        otrId: string;
        score: number;
        mockTestId: number;
    }>;
    getRecentAttempt(otrId: string, user: RequestUser): Promise<{
        mockTest: {
            title: string;
        };
        id: number;
        score: number;
        totalMarks: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        correctAnswers: number | null;
        attemptedAt: Date;
    }[]>;
    calculateRank(mockTestId: number, otrId: string, user: RequestUser): Promise<{
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
    findOne(id: number): Promise<{
        exam: {
            name: string;
        } | null;
        id: number;
        category: {
            name: string;
        };
        title: string;
        duration: number;
    }>;
}
