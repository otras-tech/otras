import { CareerAIService } from './career.service';
export declare class CareerController {
    private readonly careerService;
    constructor(careerService: CareerAIService);
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
}
