import { PypService } from './pyp.service';
import { CreatePypDto } from './dto/pyp.dto';
export declare class PypController {
    private readonly pypService;
    constructor(pypService: PypService);
    create(data: CreatePypDto): Promise<{
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
    update(id: number, data: Partial<CreatePypDto>): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
    remove(id: number): Promise<{
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        examId: number;
        year: number;
        fileUrl: string;
    }>;
}
