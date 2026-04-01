import { AiRequestDto } from './dto/ai-request.dto';
import { OpenAiProvider } from './providers/openai.provider';
import { Queue } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private readonly openAiProvider;
    private aiQueue;
    private prisma;
    private configService;
    private readonly logger;
    constructor(openAiProvider: OpenAiProvider, aiQueue: Queue, prisma: PrismaService, configService: ConfigService);
    generate(dto: AiRequestDto): Promise<{
        success: boolean;
        status: string;
        message: string;
        jobId: string;
        language: "en" | "hi" | "te";
    }>;
    getStatus(roadmapId: string): Promise<{
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
