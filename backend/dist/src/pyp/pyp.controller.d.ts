import { PypService } from './pyp.service';
import { CreatePypDto } from './dto/pyp.dto';
export declare class PypController {
    private readonly pypService;
    constructor(pypService: PypService);
    create(data: CreatePypDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
    findAll(): Promise<({
        exam: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isDeleted: boolean;
            cutoff: number | null;
            syllabus: string | null;
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
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    })[]>;
    update(id: number, data: Partial<CreatePypDto>): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
}
