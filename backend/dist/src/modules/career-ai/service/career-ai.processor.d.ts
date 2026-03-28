import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationGateway } from '../../../common/notification.gateway';
export declare class CareerAIProcessor extends WorkerHost {
    private readonly notifications;
    private readonly logger;
    constructor(notifications: NotificationGateway);
    process(job: Job<any, any, string>): Promise<any>;
}
