import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OpenAiProvider } from '../providers/openai.provider';
export declare class AiProcessor extends WorkerHost {
    private readonly openAiProvider;
    private readonly logger;
    constructor(openAiProvider: OpenAiProvider);
    process(job: Job<any, any, string>): Promise<any>;
}
