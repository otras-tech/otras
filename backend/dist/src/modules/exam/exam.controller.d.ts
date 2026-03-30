import { CacheService } from '../../common/cache/cache.service';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
export declare class ExamController {
    private readonly examService;
    private readonly cacheService;
    constructor(examService: ExamService, cacheService: CacheService);
    create(createExamDto: CreateExamDto): Promise<{
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
    getTest(id: number): Promise<{
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
    generateTest(id: number): Promise<{
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
}
