import { ReferralService } from './referral.service';
import { CreateReferralDto } from './dto/referral.dto';
export declare class ReferralController {
    private readonly referralService;
    constructor(referralService: ReferralService);
    createReferral(dto: CreateReferralDto): Promise<{
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            title: string;
            examId: number | null;
            duration: number;
            sectionType: string;
            isProctored: boolean;
            isAdaptive: boolean;
            categoryId: number;
        };
    } & {
        id: number;
        userId: number;
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
