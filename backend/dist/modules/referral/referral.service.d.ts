import { ReferralRepository } from './repository/referral.repository';
import { GetReferralHistoryDto } from './dto/referral.dto';
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
            id: number;
            createdAt: Date;
            status: string;
            refereeOtrId: string;
            creditsEarned: number;
        }[];
    }>;
    getReferralHistory(requesterId: number, requesterRole: string, referrerId: number, query: GetReferralHistoryDto): Promise<{
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
    getAllReferrals(cursor?: number, take?: number): Promise<{
        id: number;
        createdAt: Date;
        status: string;
        refereeOtrId: string;
        referrer: {
            firstName: string;
            lastName: string;
            otrId: string;
        };
    }[]>;
}
