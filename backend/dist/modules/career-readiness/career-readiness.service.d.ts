import { CareerReadinessRepository } from './repository/career-readiness.repository';
import { Prisma } from '@prisma/client';
export declare class CareerReadinessService {
    private readonly repository;
    private readonly logger;
    constructor(repository: CareerReadinessRepository);
    saveResult(requesterOtrId: string, data: {
        otrId: string;
        testId: number | string;
        answers: {
            questionId: number | string;
            selectedOption: string;
        }[];
    }): Promise<{
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
    getByOtrId(requesterOtrId: string, otrId: string): Promise<({
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
