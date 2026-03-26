export declare class CareerAIService {
    private readonly logger;
    generate(dto: any): Promise<{
        roadmap: any;
        error?: undefined;
    } | {
        roadmap: {
            summary: string;
            recommendations: string[];
            sixMonth: {
                month: string;
                tasks: string[];
            }[];
            oneYear: {
                phase: string;
                tasks: string[];
            }[];
        };
        error: any;
    }>;
    private getFallbackPlan;
}
