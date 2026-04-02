import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResultService } from '../result/result.service';
import { MockTestService } from '../mock-test/mock-test.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly resultService: ResultService,
    private readonly mockTestService: MockTestService,
  ) {}

  async create(data: RegisterDto) {
    const { referralCode, ...userData } = data;

    if (userData.pincode != null) {
      userData.pincode = userData.pincode.toString();
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const otrId = this.generateOtrId(
          userData.domicile || '',
          userData.pincode || '',
        );
        const tempCode = `REF${Math.floor(100000 + Math.random() * 900000)}`;

        return await this.userRepository.$transaction(async (tx) => {
          const newUser = await tx.user.create({
            data: {
              ...userData,
              password: hashedPassword,
              otrId,
              referralCode: tempCode,
            },
          });

          if (referralCode) {
            const referrer = await tx.user.findUnique({
              where: { referralCode, isDeleted: false },
            });

            if (referrer && referrer.id !== newUser.id) {
              await tx.user.update({
                where: { id: referrer.id },
                data: { credits: { increment: 10 } },
              });
              await tx.user.update({
                where: { id: newUser.id },
                data: { credits: { increment: 10 } },
              });
              await tx.referral.create({
                data: {
                  referrerId: referrer.id,
                  refereeOtrId: newUser.otrId,
                  creditsEarned: 10,
                  status: 'Joined',
                },
              });
            }
          }
          return newUser;
        });
      } catch (error) {
        if ((error as { code?: string }).code === 'P2002') {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new ConflictException(
              'Registration failed due to unique identifier collision. Please try again.',
            );
          }
          continue;
        }
        throw error;
      }
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findByOtrId(otrId: string) {
    return this.userRepository.findByOtrId(otrId);
  }

  async findById(id: number) {
    return this.userRepository.findById(id);
  }

  async findAll(cursor?: number, take?: number) {
    return this.userRepository.findAll(cursor, take);
  }

  /**
   * Ownership is enforced here: only self or ADMIN can update.
   */
  async update(requesterId: number, requesterRole: string, targetId: number, data: UpdateUserDto) {
    if (requesterId !== targetId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('You can only update your own profile');
    }

    const { password, ...updateData } = data;
    const finalData: Prisma.UserUpdateInput = { ...updateData };
    if (password) {
      finalData.password = await bcrypt.hash(password, 10);
    }
    return this.userRepository.update(targetId, finalData);
  }

  /**
   * Admin-only soft delete with explicit check at service level.
   */
  async remove(requesterRole: string, id: number) {
    if (requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete users');
    }
    return this.userRepository.softDelete(id);
  }

  /**
   * Ownership enforced: user can only view their own dashboard.
   */
  async getDashboardData(requesterId: number, requesterRole: string, id: number) {
    if (requesterId !== id && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.userRepository.findByIdActive(id);
    if (!user) throw new NotFoundException('User not found');

    const [results, mockAttempts, arthaProfile] = await Promise.all([
      this.resultService.getUserResults(id, undefined, 10),
      this.mockTestService.getUserMockAttempts(user.otrId!, user.otrId!, undefined),
      this.userRepository.getArthaProfile(id.toString()),
    ]);

    const mergedAttempts = [
      ...results.map((r) => ({
        id: `res_${r.id}`,
        score: r.score,
        percentage: Math.min(
          Math.round((r.score / (r.test?._count?.questions || 1)) * 100),
          100,
        ),
        createdAt: r.createdAt,
        testName: r.test?.name || 'Artha Assessment',
        type: 'artha' as const,
        subjectBreakdown: r.subjectBreakdown as Record<string, unknown> | null,
      })),
      ...mockAttempts.map((m) => ({
        id: `mock_${m.id}`,
        score: m.score,
        percentage:
          m.totalMarks > 0 ? Math.round((m.score / m.totalMarks) * 100) : 0,
        createdAt: m.attemptedAt,
        testName: m.mockTest?.title || 'Official Mock Test',
        type: 'mock' as const,
        subjectBreakdown: m.subjectBreakdown as Record<string, unknown> | null,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const readinessIndex =
      arthaProfile?.readinessIndex || mergedAttempts[0]?.percentage || 0;

    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        otrId: user.otrId,
        email: user.email,
      },
      stats: {
        readinessIndex: Math.round(readinessIndex),
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
      recentResults: mergedAttempts.slice(0, 5).map((a) => ({
        id: a.id,
        score: Number(a.score.toFixed(1)),
        percentage: a.percentage,
        createdAt: a.createdAt,
        test: { name: a.testName },
      })),
    };
  }

  async getArthaProfile(userId: string) {
    return this.userRepository.getArthaProfile(userId);
  }

  /**
   * Ownership enforced: user can only view their own tier status.
   */
  async getTierStatus(requesterId: number, requesterRole: string, id: number) {
    if (requesterId !== id && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const [profile, activePayment, anyPastPayment] = await Promise.all([
      this.userRepository.getArthaProfile(id.toString()),
      this.userRepository.getActivePayment(id, oneYearAgo),
      this.userRepository.getAnyPastPayment(id),
    ]);

    const hasActiveSubscription = !!activePayment;
    const hasExpiredSubscription = !hasActiveSubscription && !!anyPastPayment;

    const t1Prog = profile?.tier1Progress || 0;
    const t2Prog = profile?.tier2Progress || 0;
    const t3Prog = profile?.tier3Progress || 0;

    return {
      tier1: { unlocked: true, completed: t1Prog === 100 },
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
    const randomNumbers = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    return `${stateCode}${year}${randomAlphabets}${randomNumbers}`;
  }
}
