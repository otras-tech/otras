import { UserService } from './user.service';
import { ResultService } from '../result/result.service';
import { MockTestService } from '../mock-test/mock-test.service';
export declare class UserController {
    private readonly userService;
    private readonly resultService;
    private readonly mockTestService;
    constructor(userService: UserService, resultService: ResultService, mockTestService: MockTestService);
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        credits: number;
        referralCode: string;
        preferredLanguage: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        credits: number;
        referralCode: string;
        preferredLanguage: string;
    } | null>;
    getDashboardData(id: number): Promise<{
        user: {
            firstName: string;
            lastName: string;
            otrId: string;
            email: string;
        };
        stats: {
            readinessIndex: number;
            testsCompleted: number;
            recentTend: number[];
            percentile: number;
            logicalScore: number;
            quantScore: number;
            verbalScore: number;
        };
        mockTests: {
            score: number;
            createdAt: Date;
            subjectBreakdown: any;
        }[];
        recentResults: {
            id: string;
            score: number;
            percentage: number;
            createdAt: Date;
            test: {
                name: any;
            };
        }[];
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        credits: number;
        referralCode: string;
        preferredLanguage: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        credits: number;
        referralCode: string;
        preferredLanguage: string;
    }>;
    getTierStatus(id: number): Promise<{
        tier1: {
            unlocked: boolean;
            completed: boolean;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            subscriptionRequired: boolean;
            subscriptionExpired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            subscriptionRequired: boolean;
            subscriptionExpired: boolean;
        };
        hasActiveSubscription: boolean;
        hasExpiredSubscription: boolean;
    }>;
}
