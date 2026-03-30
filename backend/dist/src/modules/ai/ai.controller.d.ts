import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateRoadmap(dto: AiRequestDto): Promise<{
        success: boolean;
        status: string;
        message: string;
        jobId: any;
        language: "en" | "hi" | "te";
    }>;
    getStatus(id: string): Promise<{
        success: boolean;
        status: string;
        roadmap?: undefined;
    } | {
        success: boolean;
        status: any;
        roadmap: any;
    }>;
}
