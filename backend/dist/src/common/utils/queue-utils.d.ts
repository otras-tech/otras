import { JobsOptions } from 'bullmq';
export declare function buildIdempotentJobOpts(entityType: string, entityId: string | number, action: string): Partial<JobsOptions>;
export declare function buildWindowedJobOpts(entityType: string, entityId: string | number, action: string, windowMs?: number): Partial<JobsOptions>;
