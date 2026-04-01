import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    create(data: CreateQuestionDto): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(examId?: string, subjectId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        subject: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__QuestionClient<({
        subject: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, data: Partial<CreateQuestionDto>): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__QuestionClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        options: string[];
        answer: string;
        explanation: string | null;
        subjectId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
