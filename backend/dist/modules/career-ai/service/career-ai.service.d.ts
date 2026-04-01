import { CreateRoadmapDto } from '../dto/create-roadmap.dto';
export interface RoadmapResponse {
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
}
export declare class CareerAIService {
    private readonly logger;
    generateRoadmap(dto: CreateRoadmapDto): Promise<RoadmapResponse>;
}
