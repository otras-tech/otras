import { ResultService } from './result.service';
import { StartTestDto, SubmitTestDto } from './dto/result.dto';
export declare class ResultController {
    private readonly resultService;
    constructor(resultService: ResultService);
    start(dto: StartTestDto, req: any): Promise<{
        id: number;
        startTime: Date | null;
    }>;
    submit(dto: SubmitTestDto, req: any): Promise<{
        message: string;
        resultId: number;
    }>;
    getUserResults(userId: number, req: any, cursor?: number): Promise<{
        id: number;
        createdAt: Date;
        test: {
            _count: {
                questions: number;
            };
            name: string;
        };
        score: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        submitTime: Date | null;
    }[]>;
}
