import { PrismaService } from '../prisma/prisma.service';
export declare class PypService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: number;
        createdAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
    findAll(): Promise<({
        exam: {
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
    } & {
        id: number;
        createdAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    })[]>;
    update(id: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
}
