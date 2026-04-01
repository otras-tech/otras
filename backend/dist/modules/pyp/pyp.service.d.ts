import { PrismaService } from '../../database/prisma.service';
export declare class PypService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        year: number;
        fileUrl: string;
        examId: number;
    }): Promise<{
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        fileUrl: string;
    }>;
    findAll(): Promise<({
        exam: {
            isDeleted: boolean;
            pattern: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            cutoff: number | null;
            syllabus: string | null;
            eligibility: string | null;
            longDescription: string | null;
            noOfQuestions: number | null;
            shortDescription: string | null;
            applicationStatus: string;
        };
    } & {
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        fileUrl: string;
    })[]>;
    update(id: number, data: {
        year?: number;
        fileUrl?: string;
        examId?: number;
    }): Promise<{
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        fileUrl: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        examId: number;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        fileUrl: string;
    }>;
}
