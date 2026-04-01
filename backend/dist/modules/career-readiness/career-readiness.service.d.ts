import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class CareerReadinessService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    saveResult(data: {
        otrId: string;
        testId: number | string;
        answers: {
            questionId: number | string;
            selectedOption: string;
        }[];
    }): Promise<{
        otrId: string;
        testId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        subjectBreakdown: Prisma.JsonValue;
        totalMarks: number;
        correctAnswers: number;
        totalScore: number;
        wrongAnswers: number;
        negativeMarks: number;
    }>;
    getByOtrId(otrId: string): Promise<({
        test: {
            isDeleted: boolean;
            name: string;
            id: number;
            examId: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        otrId: string;
        testId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        subjectBreakdown: Prisma.JsonValue;
        totalMarks: number;
        correctAnswers: number;
        totalScore: number;
        wrongAnswers: number;
        negativeMarks: number;
    }) | null>;
}
