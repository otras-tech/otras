import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
import { ResultJobData } from '../../common/types/types';
export declare class ResultProcessor extends WorkerHost {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    process(job: Job<ResultJobData>): Promise<void>;
    calculateAndSave(data: ResultJobData, jobId?: string): Promise<void>;
}
