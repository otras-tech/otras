import { CareerReadinessService } from './career-readiness.service';
export declare class CareerReadinessController {
    private readonly careerReadinessService;
    constructor(careerReadinessService: CareerReadinessService);
    saveResult(data: {
        otrId: string;
        testId: number | string;
        answers: {
            questionId: number | string;
            selectedOption: string;
        }[];
    }, req: any): Promise<{
        isDeleted: boolean;
        id: number;
        otrId: string;
        createdAt: Date;
        updatedAt: Date;
        totalMarks: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        totalScore: number;
        correctAnswers: number;
        wrongAnswers: number;
        negativeMarks: number;
        testId: number;
    }>;
    getByOtrId(otrId: string, req: any): Promise<({
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
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        totalScore: number;
        correctAnswers: number;
        wrongAnswers: number;
        negativeMarks: number;
        testId: number;
    }) | null>;
}
