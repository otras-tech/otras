import { CacheService } from '../../common/cache/cache.service';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
export declare class ExamController {
    private readonly examService;
    private readonly cacheService;
    constructor(examService: ExamService, cacheService: CacheService);
    create(createExamDto: CreateExamDto): Promise<{
        subjects: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
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
    }>;
    update(id: number, updateData: CreateExamDto): Promise<{
        subjects: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
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
    }>;
    remove(id: number): Promise<{
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
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        cutoff: number | null;
        syllabus: string | null;
        noOfQuestions: number | null;
        subjects: {
            id: number;
            name: string;
        }[];
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        applicationStatus: string;
        pattern: string | null;
        cutoff: number | null;
        syllabus: string | null;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        shortDescription: string | null;
        subjects: {
            id: number;
            name: string;
        }[];
    } | null>;
    getTest(id: number): Promise<{
        test: {
            id: number;
            name: string;
            questions: {
                subject: {
                    id: number;
                    name: string;
                };
                id: number;
            }[];
        };
        exam: {
            id: number;
            name: string;
            noOfQuestions: number | null;
        };
    }>;
    generateTest(id: number): Promise<{
        test: {
            id: number;
            createdAt: Date;
            name: string;
            questions: {
                subject: {
                    id: number;
                    name: string;
                };
                id: number;
            }[];
        };
        exam: {
            id: number;
            name: string;
            noOfQuestions: number | null;
            subjects: {
                id: number;
            }[];
        };
    }>;
    findByTier(tier: string): Promise<{
        id: number;
        name: string;
        shortDescription: string | null;
        subjects: {
            id: number;
            name: string;
        }[];
    }[]>;
}
