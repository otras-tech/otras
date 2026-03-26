import { PrismaService } from '../prisma/prisma.service';
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
        createdAt: Date;
        updatedAt: Date;
        otrId: string;
        totalMarks: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        testId: number;
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
            name: string;
            isDeleted: boolean;
            examId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        otrId: string;
        totalMarks: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        testId: number;
        correctAnswers: number;
        totalScore: number;
        wrongAnswers: number;
        negativeMarks: number;
    }) | null>;
}
