import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class QuestionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.QuestionCreateInput): Promise<{
        subject: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }>;
    findAll(where: Prisma.QuestionWhereInput): Promise<({
        subject: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    })[]>;
    findById(id: number): Promise<({
        subject: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }) | null>;
    update(id: number, data: Prisma.QuestionUpdateInput): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }>;
    softDelete(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }>;
}
