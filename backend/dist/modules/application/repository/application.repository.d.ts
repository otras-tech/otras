import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ApplicationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsert(userId: number, examId: number): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    }>;
    findByUserId(userId: number): Promise<({
        exam: {
            id: number;
            name: string;
            applicationStatus: string;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    })[]>;
    findByUserIdRaw(userId: number): Promise<({
        exam: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            applicationStatus: string;
            pattern: string | null;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    })[]>;
    findById(id: number): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    } | null>;
    findByOtrId(otrId: string): Promise<({
        exam: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            applicationStatus: string;
            pattern: string | null;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    })[] | null>;
    findAll(): Promise<({
        user: {
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
        };
        exam: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            applicationStatus: string;
            pattern: string | null;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
        };
    } & {
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    })[]>;
    updateStatus(id: number, data: Prisma.ApplicationUpdateInput): Promise<{
        userId: number;
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        applicationStatus: string;
        admitCardStatus: string;
        examKeyStatus: string;
        resultStatus: string;
        examId: number;
    }>;
}
