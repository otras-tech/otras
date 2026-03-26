import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateRoadmap(dto: AiRequestDto): Promise<{
        status: string;
        language: "en" | "hi" | "te";
        roadmap: any;
    }>;
}
