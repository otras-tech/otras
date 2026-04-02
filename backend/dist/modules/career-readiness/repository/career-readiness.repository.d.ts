import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class CareerReadinessRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findTestById(id: number): Promise<({
        questions: ({
            subject: {
                isDeleted: boolean;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            isDeleted: boolean;
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
        isDeleted: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        examId: number;
    }) | null>;
    findExistingScore(otrId: string, testId: number): Promise<{
        isDeleted: boolean;
        id: number;
        otrId: string;
        createdAt: Date;
        updatedAt: Date;
        totalMarks: number;
        subjectBreakdown: Prisma.JsonValue;
        totalScore: number;
        correctAnswers: number;
        wrongAnswers: number;
        negativeMarks: number;
        testId: number;
    } | null>;
    createScore(data: Prisma.CareerReadinessTestScoreUncheckedCreateInput): Promise<{
        isDeleted: boolean;
        id: number;
        otrId: string;
        createdAt: Date;
        updatedAt: Date;
        totalMarks: number;
        subjectBreakdown: Prisma.JsonValue;
        totalScore: number;
        correctAnswers: number;
        wrongAnswers: number;
        negativeMarks: number;
        testId: number;
    }>;
    updateScore(id: number, data: Prisma.CareerReadinessTestScoreUncheckedUpdateInput): Promise<{
        isDeleted: boolean;
        id: number;
        otrId: string;
        createdAt: Date;
        updatedAt: Date;
        totalMarks: number;
        subjectBreakdown: Prisma.JsonValue;
        totalScore: number;
        correctAnswers: number;
        wrongAnswers: number;
        negativeMarks: number;
        testId: number;
    }>;
    findByOtrId(otrId: string): Promise<({
        test: {
            isDeleted: boolean;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            examId: number;
        };
    } & {
        isDeleted: boolean;
        id: number;
        otrId: string;
        createdAt: Date;
        updatedAt: Date;
        totalMarks: number;
        subjectBreakdown: Prisma.JsonValue;
        totalScore: number;
        correctAnswers: number;
        wrongAnswers: number;
        negativeMarks: number;
        testId: number;
    }) | null>;
}
