import { AiRequestDto } from './dto/ai-request.dto';
import { OpenAiProvider } from './providers/openai.provider';
import { Queue } from 'bullmq';
import { AiRepository } from './repository/ai.repository';
import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private readonly openAiProvider;
    private aiQueue;
    private readonly repository;
    private readonly configService;
    private readonly logger;
    constructor(openAiProvider: OpenAiProvider, aiQueue: Queue, repository: AiRepository, configService: ConfigService);
    generate(requesterOtrId: string, requesterRole: string, dto: AiRequestDto): Promise<{
        success: boolean;
        status: string;
        message: string;
        jobId: string;
        language: "en" | "hi" | "te";
    }>;
    getStatus(requesterOtrId: string, requesterRole: string, roadmapId: string): Promise<{
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
