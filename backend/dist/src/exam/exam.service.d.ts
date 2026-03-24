import { PrismaService } from '../prisma/prisma.service';
export declare class ExamService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        subjects: {
            id: number;
            name: string;
        }[];
    } & {
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
    }>;
    update(id: number, updateData: any): Promise<{
        subjects: {
            id: number;
            name: string;
        }[];
    } & {
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
    }>;
    findAll(): Promise<({
        subjects: {
            id: number;
            name: string;
        }[];
    } & {
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
    })[]>;
    findOne(id: number): Promise<({
        subjects: {
            id: number;
            name: string;
        }[];
    } & {
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
    }) | null>;
    getRandomTest(examId: number): Promise<{
        test: {
            questions: ({
                subject: {
                    id: number;
                    name: string;
                };
            } & {
                id: number;
                createdAt: Date;
                text: string;
                options: string[];
                answer: string;
                subjectId: number;
            })[];
        } & {
            id: number;
            name: string;
            createdAt: Date;
            examId: number;
        };
        exam: {
            subjects: {
                id: number;
                name: string;
            }[];
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
    }>;
    findByTier(tier: string): Promise<({
        subjects: {
            id: number;
            name: string;
        }[];
    } & {
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
    })[]>;
    remove(id: number): Promise<{
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
    }>;
}
