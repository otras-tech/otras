import { PrismaService } from '../../database/prisma.service';
export declare class ApplicationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, examId: number): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
    findByUser(userId: number): Promise<({
        exam: {
            isDeleted: boolean;
            pattern: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findByOtrId(otrId: string): Promise<({
        exam: {
            isDeleted: boolean;
            pattern: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findAll(): Promise<({
        user: {
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
        };
        exam: {
            isDeleted: boolean;
            pattern: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    updateStatus(id: number, statusData: any): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
}
