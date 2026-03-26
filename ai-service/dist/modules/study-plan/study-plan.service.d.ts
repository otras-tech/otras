export declare class StudyPlanService {
    private readonly logger;
    constructor();
    generate(input: any): Promise<{
        days: any[];
        summary: string;
        recommendations: any[];
    } | {
        planDurationDays: number;
        summary: string;
        recommendations: string[];
        days: any[];
    }>;
    private getFallback;
}
