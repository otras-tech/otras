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
    constructor(openAiProvider: OpenAiProvider, aiQueue: Queue, prisma: PrismaService, configService: ConfigService);
    generate(dto: AiRequestDto): Promise<{
        success: boolean;
        status: string;
        message: string;
        jobId: any;
        language: "en" | "hi" | "te";
    }>;
    getStatus(roadmapId: string): Promise<{
        success: boolean;
        status: string;
        roadmap?: undefined;
    } | {
        success: boolean;
        status: any;
        roadmap: any;
    }>;
}
