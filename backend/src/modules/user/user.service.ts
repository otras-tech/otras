import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResultService } from '../result/result.service';
import { MockTestService } from '../mock-test/mock-test.service';
import * as bcrypt from 'bcrypt';
// import { pMap } from '../../common/utils/concurrency.utils'; // Kept for bulk operations

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private resultService: ResultService,
    private mockTestService: MockTestService,
  ) {}

  async create(data: RegisterDto) {
    const { referralCode, ...userData } = data;

    // Ensure pincode is stored as string as per schema
    if (userData.pincode != null) {
      userData.pincode = userData.pincode.toString();
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const otrId = this.generateOtrId(
      userData.domicile || '',
      userData.pincode || '',
    );

    try {
      // Because we don't have the new user's ID yet, we'll assign a temporary
      // uuid-like code, then update it after creation to enforce the 'NAME123' format
      const tempCode = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const newUser = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          otrId,
          referralCode: tempCode,
        },
      });

      // 1. Generate unique referral code: REF + 6 random digits (Optimized Batch)
      let currentReferralCode: string | null = null;
      let batchAttempts = 0;
      
      while (!currentReferralCode && batchAttempts < 5) {
        const batch = Array.from({ length: 10 }, () => 'REF' + Math.floor(100000 + Math.random() * 900000));
        const collisions = await this.prisma.user.findMany({
          where: { referralCode: { in: batch } },
          select: { referralCode: true }
        });
        
        const collisionSet = new Set(collisions.map(c => c.referralCode));
        const available = batch.find(code => !collisionSet.has(code));
        
        if (available) {
          currentReferralCode = available;
        }
        batchAttempts++;
      }

      const finalReferralCode = currentReferralCode || 'REF' + Date.now().toString().slice(-6);

      await this.prisma.user.update({
        where: { id: newUser.id },
        data: { referralCode: finalReferralCode },
      });

      // 2. Process provided referral code
      if (referralCode) {
        const referrer = await this.prisma.user.findUnique({
          where: { referralCode },
        });

        if (referrer && referrer.id !== newUser.id) {
          // Check duplicate referee (extra precaution though otrId is brand new)
          const existingReferral = await this.prisma.referral.findFirst({
            where: { refereeOtrId: newUser.otrId },
          });

          if (!existingReferral) {
            await this.prisma.$transaction(async (tx) => {
              // Give referrer 10 credits
              await tx.user.update({
                where: { id: referrer.id },
                data: { credits: { increment: 10 } },
              });

              // Give new user (referee) 10 credits
              await tx.user.update({
                where: { id: newUser.id },
                data: { credits: { increment: 10 } },
              });

              // Log referral
              await tx.referral.create({
                data: {
                  referrerId: referrer.id,
                  refereeOtrId: newUser.otrId,
                  creditsEarned: 10,
                  status: 'Joined',
                },
              });
            });
          }
        }
      }

      // Return updated user omitting password
      return await this.prisma.user.findUnique({ where: { id: newUser.id } });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new ConflictException('Email or Referral Code constraint failed');
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByOtrId(otrId: string) {
    return this.prisma.user.findUnique({ where: { otrId } });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user || null;
  }

  async findAll() {
    return this.prisma.user.findMany({
      take: 100,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        otrId: true,
        role: true,
        isDeleted: true,
        createdAt: true,
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const { password, ...updateData } = data;
    const finalData: Record<string, unknown> = { ...updateData };
    if (password) {
      finalData.password = await bcrypt.hash(password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data: finalData,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  /**
   * Aggregates dashboard data for a user including results, mock attempts,
   * and career readiness index. Moved from controller to service (TASK 2).
   */
  async getDashboardData(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [results, mockAttempts, arthaProfile] = await Promise.all([
      this.resultService.getUserResults(id),
      this.mockTestService.getUserMockAttempts(user.otrId),
      this.getArthaProfile(id.toString()),
    ]);

    // Normalize and merge both types of attempts for a unified history
    const mergedAttempts = [
      ...results.map((r) => {
        const testData = r.test;
        const totalQs = testData?._count?.questions || 1;
        return {
          id: `res_${r.id}`,
          score: r.score,
          percentage: Math.min(Math.round((r.score / totalQs) * 100), 100),
          createdAt: r.createdAt,
          testName: testData?.name || 'Artha Assessment',
          type: 'artha' as const,
          subjectBreakdown: r.subjectBreakdown as Record<
            string,
            unknown
          > | null,
        };
      }),
      ...mockAttempts.map((m) => ({
        id: `mock_${m.id}`,
        score: m.score,
        percentage:
          m.totalMarks > 0
            ? m.correctAnswers != null
              ? Math.min(
                  Math.round((m.correctAnswers / m.totalMarks) * 100),
                  100,
                )
              : Math.max(
                  0,
                  Math.min(Math.round((m.score / m.totalMarks) * 100), 100),
                )
            : 0,
        createdAt: m.attemptedAt,
        testName: m.mockTest?.title || 'Official Mock Test',
        type: 'mock' as const,
        subjectBreakdown: m.subjectBreakdown as Record<string, unknown> | null,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    let readinessIndex = 0;

    if (arthaProfile && arthaProfile.readinessIndex > 0) {
      readinessIndex = Math.round(arthaProfile.readinessIndex);
    } else if (arthaProfile && arthaProfile.percentile > 0) {
      readinessIndex = Math.round(arthaProfile.percentile);
    } else {
      // Fallback: score-based calculation
      const latestAttempt = mergedAttempts[0];
      readinessIndex = latestAttempt ? latestAttempt.percentage : 0;
    }

    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        otrId: user.otrId,
        email: user.email,
      },
      stats: {
        readinessIndex,
        testsCompleted: mergedAttempts.length,
        recentTend: mergedAttempts
          .slice(0, 7)
          .reverse()
          .map((r) => r.percentage),
        percentile: arthaProfile?.percentile || 0,
        logicalScore: arthaProfile?.logicalScore || 0,
        quantScore: arthaProfile?.quantScore || 0,
        verbalScore: arthaProfile?.verbalScore || 0,
      },
      mockTests: mergedAttempts.map((a) => ({
        score: a.percentage,
        createdAt: a.createdAt,
        subjectBreakdown: a.subjectBreakdown,
      })),
      recentResults: mergedAttempts.slice(0, 3).map((a) => ({
        id: a.id,
        score: a.score,
        percentage: a.percentage,
        createdAt: a.createdAt,
        test: { name: a.testName },
      })),
    };
  }

  private generateOtrId(state: string, pincode: string): string {
    const stateMapping: Record<string, string> = {
      'andhra pradesh': 'AP',
      'arunachal pradesh': 'AR',
      assam: 'AS',
      bihar: 'BR',
      chhattisgarh: 'CG',
      goa: 'GA',
      gujarat: 'GJ',
      haryana: 'HR',
      'himachal pradesh': 'HP',
      jharkhand: 'JH',
      karnataka: 'KA',
      kerala: 'KL',
      'madhya pradesh': 'MP',
      maharashtra: 'MH',
      manipur: 'MN',
      meghalaya: 'ML',
      mizoram: 'MZ',
      nagaland: 'NL',
      odisha: 'OR',
      punjab: 'PB',
      rajasthan: 'RJ',
      sikkim: 'SK',
      'tamil nadu': 'TN',
      telangana: 'TG',
      tripura: 'TR',
      'uttar pradesh': 'UP',
      uttarakhand: 'UK',
      'west bengal': 'WB',
      'andaman and nicobar islands': 'AN',
      chandigarh: 'CH',
      'dadra and nagar haveli': 'DN',
      'daman and diu': 'DD',
      delhi: 'DL',
      'jammu and kashmir': 'JK',
      ladakh: 'LA',
      lakshadweep: 'LD',
      puducherry: 'PY',
    };

    const normalizedState = (state || '').trim().toLowerCase();
    let stateCode = stateMapping[normalizedState];

    // Fallback: If not found in mapping, strictly use the first 2 letters, default 'XX'
    if (!stateCode) {
      stateCode = (state || 'XX')
        .replace(/[^a-zA-Z]/g, '')
        .substring(0, 2)
        .toUpperCase();
      if (stateCode.length < 2) stateCode = stateCode.padEnd(2, 'X');
    }

    const year = new Date().getFullYear().toString().slice(-2);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomAlphabets = '';
    for (let i = 0; i < 3; i++) {
      randomAlphabets += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Generate 3 random digits: 000 to 999
    const randomNumbers = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    return `${stateCode}${year}${randomAlphabets}${randomNumbers}`;
  }

  async getArthaProfile(userId: string) {
    return this.prisma.arthaProfile.findFirst({
      where: { userId },
      select: {
        id: true,
        userId: true,
        logicalScore: true,
        quantScore: true,
        verbalScore: true,
        percentile: true,
        readinessIndex: true,
        tier1Progress: true,
        tier2Progress: true,
        tier3Progress: true,
        feedback: {
          select: {
            id: true,
            logicalFoundation: true,
            readinessInsight: true,
            preparationAdvice: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async getTierStatus(userId: number) {
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const [profile, activePayment, anyPastPayment] = await Promise.all([
      this.prisma.arthaProfile.findFirst({
        where: { userId: userId.toString() },
      }),
      this.prisma.payment.findFirst({
        where: {
          userId,
          status: 'paid',
          createdAt: { gte: oneYearAgo },
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      }),
      this.prisma.payment.findFirst({
        where: {
          userId,
          status: 'paid',
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      }),
    ]);

    const hasActiveSubscription = !!activePayment;
    const hasExpiredSubscription = !hasActiveSubscription && !!anyPastPayment;

    // Progress logic from ArthaProfile OR fallbacks
    const t1Prog = profile?.tier1Progress || 0;
    const t2Prog = profile?.tier2Progress || 0;
    const t3Prog = profile?.tier3Progress || 0;

    return {
      tier1: {
        unlocked: true,
        completed: t1Prog === 100,
      },
      tier2: {
        unlocked: t1Prog === 100,
        completed: t2Prog === 100,
        subscriptionRequired: t1Prog === 100 && !hasActiveSubscription,
        subscriptionExpired: t1Prog === 100 && hasExpiredSubscription,
      },
      tier3: {
        unlocked: t2Prog === 100,
        completed: t3Prog === 100,
        subscriptionRequired: t2Prog === 100 && !hasActiveSubscription,
        subscriptionExpired: t2Prog === 100 && hasExpiredSubscription,
      },
      hasActiveSubscription,
      hasExpiredSubscription,
    };
  }
}
