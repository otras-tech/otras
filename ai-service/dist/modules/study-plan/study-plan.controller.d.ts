import { StudyPlanService } from './study-plan.service';
export declare class StudyPlanController {
    private readonly studyPlanService;
    constructor(studyPlanService: StudyPlanService);
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
}
