import { CareerReadinessService } from './career-readiness.service';
import { SubmitCareerReadinessDto } from './dto/career-readiness.dto';
export declare class CareerReadinessController {
    private readonly careerReadinessService;
    private readonly logger;
    constructor(careerReadinessService: CareerReadinessService);
    saveResult(body: SubmitCareerReadinessDto): Promise<{
        otrId: string;
        testId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
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
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        totalMarks: number;
        correctAnswers: number;
        totalScore: number;
        wrongAnswers: number;
        negativeMarks: number;
    }) | null>;
}
