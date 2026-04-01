import { CareerAIService, RoadmapResponse } from '../service/career-ai.service';
import { CreateRoadmapDto } from '../dto/create-roadmap.dto';
export declare class CareerAiController {
    private service;
    constructor(service: CareerAIService);
    generateRoadmap(body: CreateRoadmapDto): Promise<RoadmapResponse>;
}
