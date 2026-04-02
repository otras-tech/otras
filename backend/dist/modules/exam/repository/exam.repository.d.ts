import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ExamRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ExamCreateInput): Promise<{
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
    }>;
    update(id: number, data: Prisma.ExamUpdateInput): Promise<{
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
    }>;
    findAll(cursor?: number, take?: number): Promise<{
        id: number;
        name: string;
        cutoff: number | null;
        syllabus: string | null;
        noOfQuestions: number | null;
        subjects: {
            id: number;
            name: string;
        }[];
    }[]>;
    findById(id: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        applicationStatus: string;
        pattern: string | null;
        cutoff: number | null;
        syllabus: string | null;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        shortDescription: string | null;
        subjects: {
            id: number;
            name: string;
        }[];
    } | null>;
    findWithTests(examId: number): Promise<{
        id: number;
        name: string;
        tests: {
            id: number;
            name: string;
            questions: {
                subject: {
                    id: number;
                    name: string;
                };
                id: number;
            }[];
        }[];
        noOfQuestions: number | null;
    } | null>;
    findForTestGeneration(examId: number): Promise<{
        id: number;
        name: string;
        noOfQuestions: number | null;
        subjects: {
            id: number;
        }[];
    } | null>;
    countQuestions(subjectIds: number[]): Promise<number>;
    findAllQuestionIds(subjectIds: number[]): Promise<{
        id: number;
    }[]>;
    findQuestionAtOffset(subjectIds: number[], skip: number): Promise<{
        id: number;
    }[]>;
    createTest(data: Prisma.TestCreateInput): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        questions: {
            subject: {
                id: number;
                name: string;
            };
            id: number;
        }[];
    }>;
    findByTier(tier: string): Promise<{
        id: number;
        name: string;
        shortDescription: string | null;
        subjects: {
            id: number;
            name: string;
        }[];
    }[]>;
    softDelete(id: number): Promise<{
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
    }>;
}
