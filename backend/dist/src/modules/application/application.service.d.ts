import { PrismaService } from '../../database/prisma.service';
export declare class ApplicationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, examId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        userId: number;
        status: string;
        examId: number;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
    findByUser(userId: number): Promise<({
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            name: string;
            pattern: string | null;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        userId: number;
        status: string;
        examId: number;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findByOtrId(otrId: string): Promise<({
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            name: string;
            pattern: string | null;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        userId: number;
        status: string;
        examId: number;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findAll(): Promise<({
        user: {
            id: number;
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
            createdAt: Date;
            updatedAt: Date;
            credits: number;
            referralCode: string;
            preferredLanguage: string;
            isDeleted: boolean;
            role: string;
        };
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            name: string;
            pattern: string | null;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        userId: number;
        status: string;
        examId: number;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    updateStatus(id: number, statusData: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        userId: number;
        status: string;
        examId: number;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
}
