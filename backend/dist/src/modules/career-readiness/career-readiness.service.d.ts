import { PrismaService } from '../../database/prisma.service';
export declare class CareerReadinessService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    saveResult(data: {
        otrId: string;
        testId: any;
        answers: {
            questionId: any;
            selectedOption: string;
        }[];
    }): Promise<{
        id: number;
        otrId: string;
        createdAt: Date;
        updatedAt: Date;
        testId: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        totalMarks: number;
        correctAnswers: number;
        totalScore: number;
        wrongAnswers: number;
        negativeMarks: number;
    }>;
    getByOtrId(otrId: string): Promise<({
        test: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            name: string;
            examId: number;
        };
    } & {
        id: number;
        otrId: string;
        createdAt: Date;
        updatedAt: Date;
        testId: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        totalMarks: number;
        correctAnswers: number;
        totalScore: number;
        wrongAnswers: number;
        negativeMarks: number;
    }) | null>;
}
