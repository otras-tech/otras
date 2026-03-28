import { Queue } from "bullmq";
export declare class CareerAIService {
    private careerAIQueue;
    private readonly logger;
    constructor(careerAIQueue: Queue);
    generateRoadmap(dto: any): Promise<{
        jobId: string | undefined;
        message: string;
    }>;
    getJobStatus(jobId: string): Promise<{
        status: string;
        id?: undefined;
        result?: undefined;
        progress?: undefined;
        failedReason?: undefined;
    } | {
        id: string | undefined;
        status: import("bullmq").JobState | "unknown";
        result: any;
        progress: import("bullmq").JobProgress;
        failedReason: string;
    }>;
}
