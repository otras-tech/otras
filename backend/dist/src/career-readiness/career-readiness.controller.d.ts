import { CareerReadinessService } from './career-readiness.service';
import { SubmitCareerReadinessDto } from './dto/career-readiness.dto';
export declare class CareerReadinessController {
    private readonly careerReadinessService;
    constructor(careerReadinessService: CareerReadinessService);
    saveResult(body: SubmitCareerReadinessDto): Promise<{
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
