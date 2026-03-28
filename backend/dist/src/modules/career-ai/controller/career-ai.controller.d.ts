import { CareerAIService } from '../service/career-ai.service';
export declare class CareerAIController {
    private readonly careerAIService;
    constructor(careerAIService: CareerAIService);
    generateRoadmap(dto: any): Promise<{
        jobId: string | undefined;
        message: string;
    }>;
    getStatus(jobId: string): Promise<{
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
