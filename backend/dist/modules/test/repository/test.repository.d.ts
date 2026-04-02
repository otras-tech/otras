import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class TestRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findQuestionsByIds(ids: number[]): Promise<{
        id: number;
    }[]>;
    findExamWithSubjects(examId: number): Promise<({
        subjects: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
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
    }) | null>;
    findQuestionsBySubjectIds(subjectIds: number[]): Promise<{
        id: number;
    }[]>;
    createTest(data: Prisma.TestUncheckedCreateInput, questionIds: number[]): Promise<{
        exam: {
            id: number;
            name: string;
        };
        id: number;
        createdAt: Date;
        _count: {
            questions: number;
        };
        name: string;
    }>;
    findAll(cursor?: number, take?: number): Promise<{
        exam: {
            id: number;
            name: string;
        };
        id: number;
        createdAt: Date;
        _count: {
            questions: number;
        };
        name: string;
    }[]>;
    findById(id: number): Promise<{
        exam: {
            id: number;
            name: string;
            noOfQuestions: number | null;
        };
        id: number;
        createdAt: Date;
        name: string;
        questions: {
            subject: {
                id: number;
                name: string;
            };
            id: number;
            text: string;
            options: string[];
        }[];
    } | null>;
    updateTest(id: number, data: Prisma.TestUncheckedUpdateInput): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        examId: number;
    }>;
    softDelete(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        examId: number;
    }>;
}
