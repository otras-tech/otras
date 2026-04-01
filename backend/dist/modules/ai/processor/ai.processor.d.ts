import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OpenAiProvider } from '../providers/openai.provider';
import { CareerAiJobData } from '../../../common/types/types';
export declare class AiProcessor extends WorkerHost {
    private readonly openAiProvider;
    private readonly logger;
    constructor(openAiProvider: OpenAiProvider);
    process(job: Job<CareerAiJobData>): Promise<{
        status: string;
        roadmap: unknown;
    }>;
}
