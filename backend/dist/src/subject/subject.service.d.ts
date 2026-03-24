import { PrismaService } from '../prisma/prisma.service';
export declare class SubjectService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        examId?: number;
    }): import(".prisma/client").Prisma.Prisma__SubjectClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        questions: {
            id: number;
            createdAt: Date;
            text: string;
            options: string[];
            answer: string;
            subjectId: number;
        }[];
        exams: {
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
        }[];
    } & {
        id: number;
        name: string;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__SubjectClient<({
        questions: {
            id: number;
            createdAt: Date;
            text: string;
            options: string[];
            answer: string;
            subjectId: number;
        }[];
        exams: {
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
        }[];
    } & {
        id: number;
        name: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, data: {
        name?: string;
        examId?: number;
    }): import(".prisma/client").Prisma.Prisma__SubjectClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__SubjectClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
