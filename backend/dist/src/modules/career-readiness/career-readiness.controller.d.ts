import { CareerReadinessService } from './career-readiness.service';
import { SubmitCareerReadinessDto } from './dto/career-readiness.dto';
export declare class CareerReadinessController {
    private readonly careerReadinessService;
    private readonly logger;
    constructor(careerReadinessService: CareerReadinessService);
    saveResult(body: SubmitCareerReadinessDto): Promise<{
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
