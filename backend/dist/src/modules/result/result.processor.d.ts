import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
export declare class ResultProcessor extends WorkerHost {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    process(job: Job<any, any, string>): Promise<any>;
    calculateAndSave(data: any, jobId?: string): Promise<any>;
}
