import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class PypRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.PYPCreateInput): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
    findAll(): Promise<({
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
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    })[]>;
    findById(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    } | null>;
    update(id: number, data: Prisma.PYPUpdateInput): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
    softDelete(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
}
