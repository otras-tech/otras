import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { MockTestRepository } from './repository/mock-test.repository';
import {
  StartMockAttemptDto,
  SubmitMockAttemptDto,
  SubmitExamAttemptDto,
} from './dto/mock-test.dto';
import { CacheService } from '../../common/cache/cache.service';
import { RedisService } from '../../common/redis/redis.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MockTestService {
  private readonly logger = new Logger(MockTestService.name);

  constructor(
    private readonly mockTestRepository: MockTestRepository,
    private readonly cacheService: CacheService,
    private readonly redisService: RedisService,
  ) { }

  async findAll(categoryId?: number, cursor?: number, take?: number) {
    const safeTake = Math.min(take || 20, 100);
    const cacheKey = CacheService.buildKey('mock_tests', {
      categoryId,
      cursor,
      take: safeTake,
    });

    if (cacheKey) {
      try {
        const cached = await this.cacheService.get(cacheKey);
        if (cached) return cached;
      } catch (err) { /* ignore cache errors */ }
    }

    try {
      const results = await this.mockTestRepository.findAll(categoryId, cursor, safeTake);

      if (cacheKey) {
        await this.cacheService.set(cacheKey, results, 600000); // 10 mins
      }
      return results;
    } catch (error) {
      this.logger.error(`FindAll error: ${(error as any).message}`);
      throw new InternalServerErrorException('Error fetching mock tests');
    }
  }

  async findOne(id: number) {
    const cacheKey = `mock_test_id_${id}`;
    try {
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) return cached;
    } catch (err) { /* ignore */ }

    const mockTest = await this.mockTestRepository.findById(id);
    if (!mockTest) throw new NotFoundException('Mock test not found');

    await this.cacheService.set(cacheKey, mockTest, 3600000); // 1 hour
    return mockTest;
  }

  async startAttempt(requesterOtrId: string, dto: StartMockAttemptDto) {
    const { otrId, mockTestOrTestId } = dto;

    if (requesterOtrId !== otrId) {
      throw new ForbiddenException('Cannot start attempt for another user');
    }

    try {
      return await this.mockTestRepository.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
          where: { otrId, isDeleted: false },
          select: { id: true },
        });
        if (!user) throw new NotFoundException('User not found');

        const mockTestId = await this.resolveMockTestId(tx, mockTestOrTestId);

        return await tx.mockTestAttempt.create({
          data: {
            otrId,
            mockTestId,
            score: 0,
            totalMarks: 0,
            startTime: new Date(),
          },
          select: { id: true, startTime: true },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      this.logger.error(`StartAttempt error: ${(error as any).message}`);
      throw new InternalServerErrorException('Error starting attempt');
    }
  }

  async submitAttempt(requesterOtrId: string, dto: SubmitMockAttemptDto) {
    if (requesterOtrId !== dto.otrId) {
      throw new ForbiddenException('Cannot submit for another user');
    }

    try {
      return await this.mockTestRepository.$transaction(async (tx) => {
        const attemptData = {
          score: dto.score,
          totalMarks: dto.totalMarks,
          submitTime: new Date(),
        };

        if (dto.attemptId) {
          const existing = await tx.mockTestAttempt.findFirst({
            where: { id: dto.attemptId, isDeleted: false },
            select: { otrId: true },
          });

          if (!existing) throw new NotFoundException('Attempt not found');
          if (existing.otrId !== dto.otrId)
            throw new ForbiddenException("Cannot update another user's attempt");

          const result = await tx.mockTestAttempt.update({
            where: { id: dto.attemptId },
            data: attemptData,
            select: { id: true, score: true, otrId: true, mockTestId: true },
          });

          this.syncToLeaderboard(result.mockTestId, result.otrId, result.score);
          return result;
        }

        const user = await tx.user.findFirst({
          where: { otrId: dto.otrId, isDeleted: false },
          select: { id: true },
        });
        if (!user) throw new NotFoundException('User not found');

        const mockTestId = await this.resolveMockTestId(tx, dto.mockTestId);

        const result = await tx.mockTestAttempt.create({
          data: {
            otrId: dto.otrId,
            mockTestId,
            ...attemptData,
          },
          select: { id: true, score: true, otrId: true, mockTestId: true },
        });

        this.syncToLeaderboard(result.mockTestId, result.otrId, result.score);
        return result;
      });
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      this.logger.error(`Submission error: ${error.message}`);
      throw new InternalServerErrorException('Error submitting attempt');
    }
  }

  async calculateRank(requesterOtrId: string, mockTestId: number, otrId: string) {
    if (requesterOtrId !== otrId) {
      throw new ForbiddenException('Access denied');
    }

    try {
      const rankKey = `ranks:mockTest:${mockTestId}`;
      const [redisRank, redisTotal] = await Promise.all([
        this.redisService.zRevRank(rankKey, otrId),
        this.redisService.zCard(rankKey),
      ]);

      if (redisRank !== null) {
        const percentile = redisTotal > 1 ? ((redisTotal - redisRank) / redisTotal) * 100 : 100;
        return {
          rank: redisRank + 1, // Redis rank is 0-indexed
          total: redisTotal,
          topPercentage: Math.ceil(((redisRank + 1) / redisTotal) * 100),
          percentile: Math.round(percentile * 10) / 10,
          source: 'cache',
        };
      }

      const userAttempt = await this.mockTestRepository.findBestAttempt(mockTestId, otrId);

      if (!userAttempt) {
        const total = await this.mockTestRepository.countAttempts(mockTestId);
        return { msg: 'User has not attempted this test yet', total };
      }

      const betterAttemptsCount = await this.mockTestRepository.countBetterAttempts(
          mockTestId,
          userAttempt.score,
          userAttempt.attemptedAt
      );

      const total = await this.mockTestRepository.countAttempts(mockTestId);
      const rank = betterAttemptsCount + 1;
      const percentile = total > 1 ? ((total - rank) / total) * 100 : 100;

      this.syncToLeaderboard(mockTestId, otrId, userAttempt.score);

      return {
        rank,
        total,
        topPercentage: Math.ceil((rank / total) * 100),
        percentile: Math.round(percentile * 10) / 10,
        source: 'db',
      };
    } catch (error: any) {
      this.logger.error(`Rank error: ${error.message}`);
      throw new InternalServerErrorException('Error calculating rank');
    }
  }

  async submitExamAttempt(requesterOtrId: string, dto: SubmitExamAttemptDto) {
    if (requesterOtrId !== dto.otrId) {
      throw new ForbiddenException('Cannot submit for another user');
    }

    try {
      return await this.mockTestRepository.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
          where: { otrId: dto.otrId, isDeleted: false },
          select: { id: true },
        });
        if (!user) throw new NotFoundException('User not found');

        const mockTest = await this.getOrCreateOfficialMockTest(tx, dto.examId);

        const attemptData = {
          score: dto.score,
          totalMarks: dto.totalMarks,
          correctAnswers: dto.correctAnswers ?? null,
          subjectBreakdown: dto.subjectBreakdown ?? ({} as any),
          submitTime: new Date(),
        };

        if (dto.attemptId) {
          const result = await tx.mockTestAttempt.update({
            where: { id: dto.attemptId },
            data: attemptData,
            select: { id: true, score: true, otrId: true, mockTestId: true },
          });

          this.syncToLeaderboard(result.mockTestId, result.otrId, result.score);
          return result;
        }

        const result = await tx.mockTestAttempt.create({
          data: {
            otrId: dto.otrId,
            mockTestId: mockTest.id,
            startTime: new Date(),
            ...attemptData,
          },
          select: { id: true, score: true, otrId: true, mockTestId: true },
        });

        this.syncToLeaderboard(result.mockTestId, result.otrId, result.score);
        return result;
      });
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      this.logger.error(`Exam submission error: ${error.message}`);
      throw new InternalServerErrorException('Error processing exam attempt');
    }
  }

  async getUserMockAttempts(requesterOtrId: string, otrId: string, cursor?: number) {
    if (requesterOtrId !== otrId) {
      throw new ForbiddenException('Access denied');
    }
    
    try {
      return await this.mockTestRepository.getUserMockAttempts(otrId, cursor);
    } catch (error) {
      this.logger.error(`GetUserAttempts error: ${(error as any).message}`);
      throw new InternalServerErrorException('Error fetching user attempts');
    }
  }

  private async resolveMockTestId(
    tx: Prisma.TransactionClient,
    id: number,
  ): Promise<number> {
    const mockTest = await tx.mockTest.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (mockTest) return mockTest.id;

    const test = await tx.test.findFirst({
      where: { id, isDeleted: false },
      select: { examId: true },
    });
    if (test) {
      const official = await this.getOrCreateOfficialMockTest(tx, test.examId);
      return official.id;
    }

    throw new NotFoundException('Target test resource not found');
  }

  private async getOrCreateOfficialMockTest(
    tx: Prisma.TransactionClient,
    examId: number,
  ) {
    const categoryName = 'Official Assessment';

    // ✅ Atomic Upsert for Category (Avoids P2002 race conditions)
    const category = await tx.mockTestCategory.upsert({
      where: { name: categoryName },
      update: { isDeleted: false },
      create: { name: categoryName },
      select: { id: true },
    });

    // Check for existing official mock test
    let mockTest = await tx.mockTest.findFirst({
      where: { examId, categoryId: category.id, isDeleted: false },
      select: { id: true },
    });

    if (!mockTest) {
      const exam = await tx.exam.findFirst({
        where: { id: examId, isDeleted: false },
        select: { name: true },
      });

      if (!exam) throw new NotFoundException(`Active exam with ID ${examId} not found`);

      mockTest = await tx.mockTest.create({
        data: {
          title: `${exam.name} - Official Assessment`,
          duration: 60,
          sectionType: 'Full Length',
          categoryId: category.id,
          examId,
        },
        select: { id: true },
      });
    }
    return mockTest;
  }

  private async syncToLeaderboard(
    mockTestId: number,
    otrId: string,
    score: number,
  ) {
    const rankKey = `ranks:mockTest:${mockTestId}`;
    try {
      await this.redisService.zAdd(rankKey, score, otrId);
    } catch (err) {
      this.logger.error(`Failed to sync leaderboard for test ${mockTestId}: ${(err as any).message}`);
    }
  }
}
