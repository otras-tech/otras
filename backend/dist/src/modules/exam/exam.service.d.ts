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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        name: string;
        pattern: string | null;
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        name: string;
        pattern: string | null;
        cutoff: number | null;
        syllabus: string | null;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        shortDescription: string | null;
        applicationStatus: string;
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
    findOne(id: number): Promise<({
        subjects: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        name: string;
        pattern: string | null;
        cutoff: number | null;
        syllabus: string | null;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        shortDescription: string | null;
        applicationStatus: string;
    }) | null>;
    getTest(examId: number): Promise<{
        test: {
            id: number;
            name: string;
            questions: {
                id: number;
                subject: {
                    id: number;
                    name: string;
                };
            }[];
        };
        exam: {
            id: number;
            name: string;
            noOfQuestions: number | null;
        };
    }>;
    generateTest(examId: number): Promise<{
        test: {
            questions: ({
                subject: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                options: string[];
                answer: string;
                explanation: string | null;
                subjectId: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            name: string;
            examId: number;
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
    findByTier(tier: string): Promise<({
        subjects: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        name: string;
        pattern: string | null;
        cutoff: number | null;
        syllabus: string | null;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        shortDescription: string | null;
        applicationStatus: string;
    })[]>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        name: string;
        pattern: string | null;
        cutoff: number | null;
        syllabus: string | null;
        eligibility: string | null;
        longDescription: string | null;
        noOfQuestions: number | null;
        shortDescription: string | null;
        applicationStatus: string;
    }>;
}
