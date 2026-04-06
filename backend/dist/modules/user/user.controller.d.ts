import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(cursor?: number, take?: number): Promise<{
        role: string;
        isDeleted: boolean;
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        otrId: string;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        password: string;
        role: string;
        isDeleted: boolean;
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        createdAt: Date;
        updatedAt: Date;
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
    update(id: number, data: UpdateUserDto): Promise<{
        password: string;
        role: string;
        isDeleted: boolean;
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        createdAt: Date;
        updatedAt: Date;
        credits: number;
        referralCode: string;
        preferredLanguage: string;
    }>;
    remove(id: number): Promise<{
        password: string;
        role: string;
        isDeleted: boolean;
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        age: number | null;
        category: string | null;
        otrId: string;
        highestDegree: string | null;
        careerPreference: string | null;
        domicile: string | null;
        pincode: string | null;
        createdAt: Date;
        updatedAt: Date;
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
