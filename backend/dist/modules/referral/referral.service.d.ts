import { PrismaService } from '../../database/prisma.service';
export declare class ReferralService {
    private prisma;
    constructor(prisma: PrismaService);
    createReferral(referrerId: number, refereeOtrId: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        referrerId: number;
        refereeOtrId: string;
        status: string;
        creditsEarned: number;
    }>;
    getReferralStats(referrerId: number): Promise<{
        totalReferrals: number;
        successReferrals: number;
        creditsEarned: number;
        mockTestsEarned: number;
        availableCredits: number;
        referralCode: string;
        referrals: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            referrerId: number;
            refereeOtrId: string;
            status: string;
            creditsEarned: number;
        }[];
    }>;
    getReferralHistory(referrerId: number): Promise<{
        id: number;
        friendOtrId: string;
        signupDate: Date;
        status: string;
        creditsEarned: number;
    }[]>;
    getRewards(userId: number): Promise<({
        mockTest: {
            isDeleted: boolean;
            title: string;
            id: number;
            examId: number | null;
            createdAt: Date;
            updatedAt: Date;
            categoryId: number;
            duration: number;
            sectionType: string;
            isProctored: boolean;
            isAdaptive: boolean;
        };
    } & {
        userId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        mockTestId: number;
        isRedeemed: boolean;
    })[]>;
    getAllReferrals(): Promise<({
        referrer: {
            firstName: string;
            lastName: string;
            otrId: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        referrerId: number;
        refereeOtrId: string;
        status: string;
        creditsEarned: number;
    })[]>;
}
