import { AiRequestDto } from './dto/ai-request.dto';
import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateRoadmap(dto: AiRequestDto, req: any): Promise<{
        success: boolean;
        status: string;
        message: string;
        jobId: string;
        language: "en" | "hi" | "te";
    }>;
    getStatus(id: string, req: any): Promise<{
        success: boolean;
        status: string;
        roadmap: ({
            IntelligenceProfile: {
                userId: string;
                isDeleted: boolean;
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
            isDeleted: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            profileId: string;
            summary: string;
            jobId: string | null;
            recommendations: string[];
            phase1: string;
            phase2: string;
        }) | null;
    }>;
}
