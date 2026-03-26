import { PrismaService } from '../prisma/prisma.service';
export declare class QuestionService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(query?: {
        examId?: number;
        subjectId?: number;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        subject: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__QuestionClient<({
        subject: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, data: any): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
