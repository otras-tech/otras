import { ReferralService } from './referral.service';
import { CreateReferralDto } from './dto/referral.dto';
export declare class ReferralController {
    private readonly referralService;
    constructor(referralService: ReferralService);
    createReferral(dto: CreateReferralDto, req: any): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        refereeOtrId: string;
        creditsEarned: number;
        referrerId: number;
    }>;
    getReferralStats(referrerId: number, req: any): Promise<{
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
    getReferralHistory(referrerId: number, req: any): Promise<{
        id: number;
        friendOtrId: string;
        signupDate: Date;
        status: string;
        creditsEarned: number;
    }[]>;
    getRewards(userId: number, req: any): Promise<({
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
