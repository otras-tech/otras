import { PrismaService } from '../prisma/prisma.service';
export declare class ApplicationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, examId: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
    findByUser(userId: number): Promise<({
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isDeleted: boolean;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findByOtrId(otrId: string): Promise<({
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isDeleted: boolean;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findAll(): Promise<({
        user: {
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
            isDeleted: boolean;
        };
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isDeleted: boolean;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    updateStatus(id: number, statusData: any): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        applicationStatus: string;
        status: string;
        examId: number;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
}
