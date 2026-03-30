import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        const { referralCode, ...userData } = data;
        
        // Ensure pincode is stored as string as per schema
        if (userData.pincode != null) {
            userData.pincode = userData.pincode.toString();
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const otrId = this.generateOtrId(userData.domicile, userData.pincode);

        try {
            // Because we don't have the new user's ID yet, we'll assign a temporary 
            // uuid-like code, then update it after creation to enforce the 'NAME123' format
            const tempCode = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;

            const newUser = await this.prisma.user.create({
                data: {
                    ...userData,
                    password: hashedPassword,
                    otrId,
                    referralCode: tempCode
                },
            });

            // 1. Generate unique referral code: REF + 6 random digits
            let newReferralCode: string;
            let codeIsUnique = false;
            let attempts = 0;
            do {
                newReferralCode = 'REF' + Math.floor(100000 + Math.random() * 900000);
                const existing = await this.prisma.user.findUnique({ where: { referralCode: newReferralCode } });
                if (!existing) codeIsUnique = true;
                attempts++;
            } while (!codeIsUnique && attempts < 10);
            
            await this.prisma.user.update({
                where: { id: newUser.id },
                data: { referralCode: newReferralCode! }
            });

            // 2. Process provided referral code
            if (referralCode) {
                const referrer = await this.prisma.user.findUnique({
                    where: { referralCode }
                });

                if (referrer && referrer.id !== newUser.id) {
                    // Check duplicate referee (extra precaution though otrId is brand new)
                    const existingReferral = await this.prisma.referral.findFirst({
                        where: { refereeOtrId: newUser.otrId }
                    });

                    if (!existingReferral) {
                        await this.prisma.$transaction(async (tx) => {
                            // Give referrer 10 credits
                            await tx.user.update({
                                where: { id: referrer.id },
                                data: { credits: { increment: 10 } }
                            });

                            // Give new user (referee) 10 credits
                            await tx.user.update({
                                where: { id: newUser.id },
                                data: { credits: { increment: 10 } }
                            });

                            // Log referral
                            await tx.referral.create({
                                data: {
                                    referrerId: referrer.id,
                                    refereeOtrId: newUser.otrId,
                                    creditsEarned: 10,
                                    status: 'Joined'
                                }
                            });
                        });
                    }
                }
            }

            // Return updated user omitting password
            return await this.findById(newUser.id);
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
                createdAt: true
            }
        });
    }

    async update(id: number, data: any) {
        const { password, ...updateData } = data;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }

    private generateOtrId(state: string, pincode: string): string {
        const stateMapping: Record<string, string> = {
            'andhra pradesh': 'AP', 'arunachal pradesh': 'AR', 'assam': 'AS', 'bihar': 'BR',
            'chhattisgarh': 'CG', 'goa': 'GA', 'gujarat': 'GJ', 'haryana': 'HR',
            'himachal pradesh': 'HP', 'jharkhand': 'JH', 'karnataka': 'KA', 'kerala': 'KL',
            'madhya pradesh': 'MP', 'maharashtra': 'MH', 'manipur': 'MN', 'meghalaya': 'ML',
            'mizoram': 'MZ', 'nagaland': 'NL', 'odisha': 'OR', 'punjab': 'PB',
            'rajasthan': 'RJ', 'sikkim': 'SK', 'tamil nadu': 'TN', 'telangana': 'TG',
            'tripura': 'TR', 'uttar pradesh': 'UP', 'uttarakhand': 'UK', 'west bengal': 'WB',
            'andaman and nicobar islands': 'AN', 'chandigarh': 'CH',
            'dadra and nagar haveli': 'DN', 'daman and diu': 'DD', 'delhi': 'DL',
            'jammu and kashmir': 'JK', 'ladakh': 'LA', 'lakshadweep': 'LD', 'puducherry': 'PY'
        };

        const normalizedState = (state || '').trim().toLowerCase();
        let stateCode = stateMapping[normalizedState];
        
        // Fallback: If not found in mapping, strictly use the first 2 letters, default 'XX'
        if (!stateCode) {
            stateCode = (state || 'XX').replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
            if (stateCode.length < 2) stateCode = stateCode.padEnd(2, 'X');
        }

        const year = new Date().getFullYear().toString().slice(-2);
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomAlphabets = '';
        for (let i = 0; i < 3; i++) {
            randomAlphabets += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Generate 3 random digits: 000 to 999
        const randomNumbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

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
                        createdAt: true 
                    }
                }
            }
        });
    }

    async getTierStatus(userId: number) {
        // Fetch Artha Profile for progress
        const profile = await this.prisma.arthaProfile.findFirst({
            where: { userId: userId.toString() }
        });

        // Subscription Check
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);
        
        const activePayment = await this.prisma.payment.findFirst({
            where: {
                userId,
                status: 'paid',
                createdAt: {
                    gte: oneYearAgo
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        const hasActiveSubscription = !!activePayment;

        const anyPastPayment = await this.prisma.payment.findFirst({
            where: {
                userId,
                status: 'paid'
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: { id: true }
        });
        const hasExpiredSubscription = !hasActiveSubscription && !!anyPastPayment;

        // Progress logic from ArthaProfile OR fallbacks
        const t1Prog = profile?.tier1Progress || 0;
        const t2Prog = profile?.tier2Progress || 0;
        const t3Prog = profile?.tier3Progress || 0;

        return {
            tier1: {
                unlocked: true,
                completed: t1Prog === 100
            },
            tier2: {
                unlocked: t1Prog === 100,
                completed: t2Prog === 100,
                subscriptionRequired: t1Prog === 100 && !hasActiveSubscription,
                subscriptionExpired: t1Prog === 100 && hasExpiredSubscription
            },
            tier3: {
                unlocked: t2Prog === 100,
                completed: t3Prog === 100,
                subscriptionRequired: t2Prog === 100 && !hasActiveSubscription,
                subscriptionExpired: t2Prog === 100 && hasExpiredSubscription
            },
            hasActiveSubscription,
            hasExpiredSubscription
        };
    }
}

