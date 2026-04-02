import { MockTestRepository } from './repository/mock-test.repository';
import { StartMockAttemptDto, SubmitMockAttemptDto, SubmitExamAttemptDto } from './dto/mock-test.dto';
import { CacheService } from '../../common/cache/cache.service';
import { RedisService } from '../../common/redis/redis.service';
import { Prisma } from '@prisma/client';
export declare class MockTestService {
    private readonly mockTestRepository;
    private readonly cacheService;
    private readonly redisService;
    private readonly logger;
    constructor(mockTestRepository: MockTestRepository, cacheService: CacheService, redisService: RedisService);
    findAll(categoryId?: number, cursor?: number, take?: number): Promise<{}>;
    findOne(id: number): Promise<any>;
    startAttempt(requesterOtrId: string, dto: StartMockAttemptDto): Promise<{
        id: number;
        startTime: Date | null;
    }>;
    submitAttempt(requesterOtrId: string, dto: SubmitMockAttemptDto): Promise<{
        id: number;
        otrId: string;
        score: number;
        mockTestId: number;
    }>;
    calculateRank(requesterOtrId: string, mockTestId: number, otrId: string): Promise<{
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
    submitExamAttempt(requesterOtrId: string, dto: SubmitExamAttemptDto): Promise<{
        id: number;
        otrId: string;
        score: number;
        mockTestId: number;
    }>;
    getUserMockAttempts(requesterOtrId: string, otrId: string, cursor?: number): Promise<{
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
    private resolveMockTestId;
    private getOrCreateOfficialMockTest;
    private syncToLeaderboard;
}
