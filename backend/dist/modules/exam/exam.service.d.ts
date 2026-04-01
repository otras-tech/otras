import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { CreateExamDto } from './dto/create-exam.dto';
export declare class ExamService {
    private prisma;
    private cacheService;
    constructor(prisma: PrismaService, cacheService: CacheService);
    invalidateCache(): Promise<void>;
    create(data: CreateExamDto): Promise<{
        subjects: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
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
    }>;
    update(id: number, updateData: CreateExamDto): Promise<{
        subjects: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
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
    }>;
    findAll(cursor?: number, take?: number): Promise<{
        name: string;
        id: number;
        cutoff: number | null;
        syllabus: string | null;
        noOfQuestions: number | null;
        subjects: {
            name: string;
            id: number;
        }[];
    }[]>;
    findOne(id: number): Promise<{
        pattern: string | null;
        name: string;
        id: number;
        createdAt: Date;
        cutoff: number | null;
        syllabus: string | null;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        shortDescription: string | null;
        applicationStatus: string;
        subjects: {
            name: string;
            id: number;
        }[];
    } | null>;
    getTest(examId: number): Promise<{
        test: {
            name: string;
            id: number;
            questions: {
                subject: {
                    name: string;
                    id: number;
                };
                id: number;
            }[];
        };
        exam: {
            name: string;
            id: number;
            noOfQuestions: number | null;
        };
    }>;
    generateTest(examId: number): Promise<{
        test: {
            name: string;
            id: number;
            createdAt: Date;
            questions: {
                subject: {
                    name: string;
                    id: number;
                };
                id: number;
            }[];
        };
        exam: {
            name: string;
            id: number;
            noOfQuestions: number | null;
            subjects: {
                id: number;
            }[];
        };
    }>;
    findByTier(tier: string): Promise<{
        name: string;
        id: number;
        shortDescription: string | null;
        subjects: {
            name: string;
            id: number;
        }[];
    }[]>;
    remove(id: number): Promise<{
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
    }>;
}
