import { CareerReadinessService } from './career-readiness.service';
export declare class CareerReadinessController {
    private readonly careerReadinessService;
    constructor(careerReadinessService: CareerReadinessService);
    saveResult(body: {
        otrId: string;
        testId: any;
        answers: any[];
    }): Promise<{
        id: number;
        createdAt: Date;
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
            name: string;
            createdAt: Date;
            examId: number;
        };
    } & {
        id: number;
        createdAt: Date;
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
