import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class QuestionService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        text: string;
        options: string[];
        answer: string;
        explanation?: string;
        subjectId: number;
    }): Prisma.Prisma__QuestionClient<{
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
    }): Prisma.PrismaPromise<({
        subject: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
    findOne(id: number): Prisma.Prisma__QuestionClient<({
        subject: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
    update(id: number, data: {
        text?: string;
        options?: string[];
        answer?: string;
        explanation?: string;
        subjectId?: number;
    }): Prisma.Prisma__QuestionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): Prisma.Prisma__QuestionClient<{
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
