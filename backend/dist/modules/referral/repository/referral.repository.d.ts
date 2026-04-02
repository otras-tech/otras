import { PrismaService } from '../../../database/prisma.service';
export declare class ReferralRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(referrerId: number, refereeOtrId: string): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        refereeOtrId: string;
        creditsEarned: number;
        referrerId: number;
    }>;
    findByReferrerId(referrerId: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        refereeOtrId: string;
        creditsEarned: number;
        referrerId: number;
    }[]>;
    findByReferreerIdOrdered(referrerId: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        refereeOtrId: string;
        creditsEarned: number;
        referrerId: number;
    }[]>;
    findFirstByRefereeOtrId(refereeOtrId: string): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        refereeOtrId: string;
        creditsEarned: number;
        referrerId: number;
    } | null>;
    findReferralRewardsByUserId(userId: number): Promise<({
        mockTest: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            examId: number | null;
            title: string;
            duration: number;
            sectionType: string;
            isProctored: boolean;
            isAdaptive: boolean;
            categoryId: number;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        mockTestId: number;
        isRedeemed: boolean;
    })[]>;
    findAll(): Promise<({
        referrer: {
            firstName: string;
            lastName: string;
            otrId: string;
        };
    } & {
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        refereeOtrId: string;
        creditsEarned: number;
        referrerId: number;
    })[]>;
    findUserByIdWithCredits(referrerId: number): Promise<{
        otrId: string;
        credits: number;
        referralCode: string;
    } | null>;
}
