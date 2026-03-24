import { PypService } from './pyp.service';
export declare class PypController {
    private readonly pypService;
    constructor(pypService: PypService);
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
    update(id: string, data: any): Promise<{
        id: number;
        createdAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
    remove(id: string): Promise<{
        id: number;
        createdAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
}
