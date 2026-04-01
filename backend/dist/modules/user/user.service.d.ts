import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResultService } from '../result/result.service';
import { MockTestService } from '../mock-test/mock-test.service';
export declare class UserService {
    private prisma;
    private resultService;
    private mockTestService;
    constructor(prisma: PrismaService, resultService: ResultService, mockTestService: MockTestService);
    create(data: RegisterDto): Promise<{
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
    findByEmail(email: string): Promise<{
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
    findByOtrId(otrId: string): Promise<{
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
    findById(id: number): Promise<{
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
    update(id: number, data: UpdateUserDto): Promise<{
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
    private generateOtrId;
    getArthaProfile(userId: string): Promise<{
        userId: string;
        id: string;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        percentile: number;
        tier1Progress: number;
        tier2Progress: number;
        tier3Progress: number;
        readinessIndex: number;
        feedback: {
            id: string;
            createdAt: Date;
            logicalFoundation: string | null;
            readinessInsight: string | null;
            preparationAdvice: string | null;
        } | null;
    } | null>;
    getTierStatus(userId: number): Promise<{
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
