import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<{
        role: string;
        isDeleted: boolean;
        email: string;
        firstName: string;
        lastName: string;
        otrId: string;
        id: number;
        createdAt: Date;
    }[]>;
    findOne(id: number, req: any): Promise<{
        password: string;
        role: string;
        isDeleted: boolean;
        email: string;
        firstName: string;
        lastName: string;
        otrId: string;
        age: number | null;
        category: string | null;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        referralCode: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        credits: number;
        preferredLanguage: string;
    } | null>;
    getDashboardData(id: number, req: any): Promise<{
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
            subjectBreakdown: Record<string, unknown> | null;
        }[];
        recentResults: {
            id: string;
            score: number;
            percentage: number;
            createdAt: Date;
            test: {
                name: string;
            };
        }[];
    }>;
    update(id: number, data: UpdateUserDto, req: any): Promise<{
        password: string;
        role: string;
        isDeleted: boolean;
        email: string;
        firstName: string;
        lastName: string;
        otrId: string;
        age: number | null;
        category: string | null;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        referralCode: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        credits: number;
        preferredLanguage: string;
    }>;
    remove(id: number): Promise<{
        password: string;
        role: string;
        isDeleted: boolean;
        email: string;
        firstName: string;
        lastName: string;
        otrId: string;
        age: number | null;
        category: string | null;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        referralCode: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        credits: number;
        preferredLanguage: string;
    }>;
    getTierStatus(id: number, req: any): Promise<{
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
