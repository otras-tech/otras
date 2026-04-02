import { ReferralRepository } from './repository/referral.repository';
export declare class ReferralService {
    private readonly referralRepository;
    constructor(referralRepository: ReferralRepository);
    createReferral(requesterId: number, referrerId: number, refereeOtrId: string): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        refereeOtrId: string;
        creditsEarned: number;
        referrerId: number;
    }>;
    getReferralStats(requesterId: number, requesterRole: string, referrerId: number): Promise<{
        totalReferrals: number;
        successReferrals: number;
        creditsEarned: number;
        mockTestsEarned: number;
        availableCredits: number;
        referralCode: string;
        referrals: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            refereeOtrId: string;
            creditsEarned: number;
            referrerId: number;
        }[];
    }>;
    getReferralHistory(requesterId: number, requesterRole: string, referrerId: number): Promise<{
        id: number;
        friendOtrId: string;
        signupDate: Date;
        status: string;
        creditsEarned: number;
    }[]>;
    getRewards(requesterId: number, requesterRole: string, userId: number): Promise<({
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
    getAllReferrals(): Promise<({
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
}
