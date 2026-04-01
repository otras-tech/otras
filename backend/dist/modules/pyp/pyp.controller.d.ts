import { PypService } from './pyp.service';
import { CreatePypDto } from './dto/pyp.dto';
export declare class PypController {
    private readonly pypService;
    constructor(pypService: PypService);
    create(data: CreatePypDto): Promise<{
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
    update(id: number, data: Partial<CreatePypDto>): Promise<{
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
