import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<User> {
    const { referralCode, username, confirmPassword, phone, ...userData } = data;
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const firstName = userData.firstName || 'Candidate';
    const lastName = userData.lastName || '';

    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...userData,
          firstName,
          lastName,
          password: hashedPassword,
          otrId: null,
        },
      });

      // 2. Process provided referral code
      if (referralCode) {
        await this.linkReferrer(newUser.id, referralCode, newUser.otrId);
      }

      // Return updated user omitting password
      return (await this.findById(newUser.id)) as User;
    } catch (error) {
      if (error.code === 'P2002') {
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
    return this.prisma.user.findMany({ take: 100 });
  }

  async update(id: number, data: any) {
    const { password, referralCode, ...updateData } = data;

    // Fetch existing user to check if OTR is temporary
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) throw new Error('User not found');

    // 1. Generate REAL OTR ID if domicile is provided AND current OTR is temporary or missing
    if (updateData.domicile && updateData.domicile !== 'selectState' && (!existingUser.otrId || existingUser.otrId.startsWith('XX'))) {
      updateData.otrId = this.generateOtrId(updateData.domicile);
    }

    // 2. Generate referral code now that OTR is generated (or already exists)
    const currentOtr = updateData.otrId || existingUser.otrId;
    const hasRealOtr = currentOtr && !currentOtr.startsWith('XX');
    if (hasRealOtr && !existingUser.referralCode) {
      updateData.referralCode = await this.generateReferralCode();
    }

    // 3. Process provided referrer code (if not already linked)
    if (referralCode) {
       await this.linkReferrer(id, referralCode, currentOtr);
    }

    if (password && password !== 'password') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (updateData.otrId && updateData.otrId !== existingUser.otrId) {
      // Sync any referral that was created during signup without OTR
      await this.prisma.referral.updateMany({
        where: { refereeId: id },
        data: { refereeOtrId: updateData.otrId }
      });
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  private generateOtrId(state: string): string {
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

  private async generateReferralCode(): Promise<string> {
    let newReferralCode: string;
    let codeIsUnique = false;
    let attempts = 0;
    do {
      newReferralCode = 'REF' + Math.floor(100000 + Math.random() * 900000);
      const existing = await this.prisma.user.findUnique({
        where: { referralCode: newReferralCode },
      });
      if (!existing) codeIsUnique = true;
      attempts++;
    } while (!codeIsUnique && attempts < 10);
    return newReferralCode!;
  }

  private async linkReferrer(userId: number, referrerCode: string, refereeOtrId: string | null) {
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode: referrerCode },
    });

    if (referrer && referrer.id !== userId) {
      // Check if this user already has a referral associated
      const existingReferral = await this.prisma.referral.findFirst({
        where: { 
          OR: [
            { refereeId: userId },
            { AND: [{ refereeOtrId }, { refereeOtrId: { not: null } }] }
          ]
        },
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
            where: { id: userId },
            data: { credits: { increment: 10 } },
          });

          // Log referral
          await tx.referral.create({
            data: {
              referrerId: referrer.id,
              refereeId: userId,
              refereeOtrId: refereeOtrId,
              creditsEarned: 10,
              status: 'Joined',
            },
          });
        });
      }
    }
  }

  async getArthaProfile(userId: string) {
    return this.prisma.arthaProfile.findFirst({
      where: { userId },
      include: { feedback: true },
    });
  }

  async getTierStatus(userId: number) {
    // Fetch Artha Profile for progress
    const profile = await this.prisma.arthaProfile.findFirst({
      where: { userId: userId.toString() },
    });

    // Subscription Check
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const activePayment = await this.prisma.payment.findFirst({
      where: {
        userId,
        status: 'paid',
        createdAt: {
          gte: oneYearAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const hasActiveSubscription = !!activePayment;

    const anyPastPayment = await this.prisma.payment.findFirst({
      where: {
        userId,
        status: 'paid',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
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
