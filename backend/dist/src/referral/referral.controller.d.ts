import { ReferralService } from './referral.service';
export declare class ReferralController {
    private readonly referralService;
    constructor(referralService: ReferralService);
    createReferral(body: {
        referrerId: number;
        refereeOtrId: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        referrerId: number;
        refereeOtrId: string;
        status: string;
        creditsEarned: number;
    }>;
    getReferralStats(referrerId: string): Promise<{
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
    getReferralHistory(referrerId: string): Promise<{
        id: number;
        friendOtrId: string;
        signupDate: Date;
        status: string;
        creditsEarned: number;
    }[]>;
    getRewards(userId: string): Promise<({
        mockTest: {
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
        id: number;
        createdAt: Date;
        userId: number;
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
