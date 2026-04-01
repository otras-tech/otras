import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateRoadmap(dto: AiRequestDto): Promise<{
        success: boolean;
        status: string;
        message: string;
        jobId: string;
        language: "en" | "hi" | "te";
    }>;
    getStatus(id: string): Promise<{
        success: boolean;
        status: string;
        roadmap?: undefined;
    } | {
        success: boolean;
        status: string;
        roadmap: ({
            IntelligenceProfile: {
                userId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                logicalScore: number;
                quantScore: number;
                verbalScore: number;
                interests: string[];
                learningPattern: string;
                aspirations: string;
                confidenceIndex: number;
            };
        } & {
            summary: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            profileId: string;
            recommendations: string[];
            phase1: string;
            phase2: string;
            jobId: string | null;
        }) | null;
    }>;
}
