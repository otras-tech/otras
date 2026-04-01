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
        test: {
            name: string;
            _count: {
                questions: number;
            };
        };
        id: number;
        createdAt: Date;
        score: number;
        subjectBreakdown: import("@prisma/client/runtime/library").JsonValue;
        submitTime: Date | null;
    }[]>;
}
