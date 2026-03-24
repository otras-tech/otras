import { PrismaService } from '../prisma/prisma.service';
export declare class ApplicationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, examId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        examId: number;
        userId: number;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
    findByUser(userId: number): Promise<({
        exam: {
            id: number;
            name: string;
            cutoff: number | null;
            syllabus: string | null;
            createdAt: Date;
            updatedAt: Date;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        examId: number;
        userId: number;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findByOtrId(otrId: string): Promise<({
        exam: {
            id: number;
            name: string;
            cutoff: number | null;
            syllabus: string | null;
            createdAt: Date;
            updatedAt: Date;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        examId: number;
        userId: number;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    findAll(): Promise<({
        exam: {
            id: number;
            name: string;
            cutoff: number | null;
            syllabus: string | null;
            createdAt: Date;
            updatedAt: Date;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            pattern: string | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
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
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        examId: number;
        userId: number;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    })[]>;
    updateStatus(id: number, statusData: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        applicationStatus: string;
        examId: number;
        userId: number;
        status: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
    }>;
}
