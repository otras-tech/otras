import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
export declare class SubjectController {
    private readonly subjectService;
    constructor(subjectService: SubjectService);
    create(createSubjectDto: CreateSubjectDto): import(".prisma/client").Prisma.Prisma__SubjectClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        questions: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            options: string[];
            answer: string;
            explanation: string | null;
            subjectId: number;
        }[];
        exams: {
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
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__SubjectClient<({
        questions: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            options: string[];
            answer: string;
            explanation: string | null;
            subjectId: number;
        }[];
        exams: {
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
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__SubjectClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__SubjectClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
