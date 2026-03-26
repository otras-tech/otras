import { CareerAiService } from './career-ai.service';
export declare class CareerAiController {
    private readonly service;
    constructor(service: CareerAiService);
    generate(dto: any): Promise<any>;
}
