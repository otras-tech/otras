import { PrismaService } from '../prisma/prisma.service';
import { StartMockAttemptDto, SubmitMockAttemptDto, SubmitExamAttemptDto } from './dto/mock-test.dto';
import { Cache } from 'cache-manager';
export declare class MockTestService {
    private prisma;
    private cacheManager;
    private readonly logger;
    constructor(prisma: PrismaService, cacheManager: Cache);
    findAll(categoryId?: number, cursor?: number): Promise<{}>;
    findOne(id: number): Promise<{}>;
    startAttempt(dto: StartMockAttemptDto): Promise<{
        id: number;
        startTime: Date | null;
    }>;
    submitAttempt(dto: SubmitMockAttemptDto): Promise<{
        id: number;
        score: number;
    }>;
    calculateRank(mockTestId: number, otrId: string): Promise<{
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
    submitExamAttempt(dto: SubmitExamAttemptDto): Promise<{
        id: number;
        score: number;
    }>;
    private resolveMockTestId;
    private getOrCreateOfficialMockTest;
    getUserMockAttempts(otrId: string, cursor?: number): Promise<{
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
}
