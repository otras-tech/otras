import { PrismaService } from '../../database/prisma.service';
import { StartMockAttemptDto, SubmitMockAttemptDto, SubmitExamAttemptDto } from './dto/mock-test.dto';
import { CacheService } from '../../common/cache/cache.service';
import { RedisService } from '../../common/redis/redis.service';
import { Prisma } from '@prisma/client';
export declare class MockTestService {
    private prisma;
    private cacheService;
    private redisService;
    private readonly logger;
    constructor(prisma: PrismaService, cacheService: CacheService, redisService: RedisService);
    findAll(categoryId?: number, cursor?: number): Promise<{}>;
    findOne(id: number): Promise<any>;
    startAttempt(dto: StartMockAttemptDto): Promise<{
        id: number;
        startTime: Date | null;
    }>;
    submitAttempt(dto: SubmitMockAttemptDto): Promise<{
        id: number;
        otrId: string;
        score: number;
        mockTestId: number;
    }>;
    calculateRank(mockTestId: number, otrId: string): Promise<{
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
    submitExamAttempt(dto: SubmitExamAttemptDto): Promise<{
        id: number;
        otrId: string;
        score: number;
        mockTestId: number;
    }>;
    getUserMockAttempts(otrId: string, cursor?: number): Promise<{
        id: number;
        mockTest: {
            title: string;
        };
        score: number;
        subjectBreakdown: Prisma.JsonValue;
        totalMarks: number;
        correctAnswers: number | null;
        attemptedAt: Date;
    }[]>;
    private resolveMockTestId;
    private getOrCreateOfficialMockTest;
    private syncToLeaderboard;
}
