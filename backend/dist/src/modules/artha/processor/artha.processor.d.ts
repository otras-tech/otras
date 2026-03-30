import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ArthaRepository } from '../repository/artha.repository';
import { ConfigService } from '@nestjs/config';
export declare class ArthaProcessor extends WorkerHost {
    private readonly repository;
    private readonly configService;
    private readonly logger;
    private ML_SERVICE_URL;
    private AI_SERVICE_URL;
    constructor(repository: ArthaRepository, configService: ConfigService);
    process(job: Job<any, any, string>): Promise<any>;
    private handleTierAnalysis;
    private calculateReadiness;
    private generateAiFeedback;
}
