import { StudyPlanService } from '../service/study-plan.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
declare class UpdateActivityStatusDto {
    completed?: boolean;
    missed?: boolean;
}
export declare class StudyPlanController {
    private readonly studyPlanService;
    private readonly logger;
    constructor(studyPlanService: StudyPlanService);
    generate(dto: CreateStudyPlanDto): Promise<Record<string, unknown> & {
        days?: unknown[];
    }>;
    save(body: {
        dto: CreateStudyPlanDto;
        aiData: Record<string, unknown>;
    }): Promise<{
        days: ({
            activities: {
                description: string;
                id: string;
                completed: boolean;
                createdAt: Date;
                updatedAt: Date;
                timeSlot: string;
                focusArea: string | null;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: string;
            date: Date | null;
            planId: string;
        })[];
    } & {
        userId: number;
        id: string;
        examId: number | null;
        createdAt: Date;
        updatedAt: Date;
        weakAreas: string[];
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    }>;
    findByUserId(userId: number): Promise<({
        days: ({
            activities: {
                description: string;
                id: string;
                completed: boolean;
                createdAt: Date;
                updatedAt: Date;
                timeSlot: string;
                focusArea: string | null;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: string;
            date: Date | null;
            planId: string;
        })[];
    } & {
        userId: number;
        id: string;
        examId: number | null;
        createdAt: Date;
        updatedAt: Date;
        weakAreas: string[];
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    }) | null>;
    findOne(id: string): Promise<({
        days: ({
            activities: {
                description: string;
                id: string;
                completed: boolean;
                createdAt: Date;
                updatedAt: Date;
                timeSlot: string;
                focusArea: string | null;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: string;
            date: Date | null;
            planId: string;
        })[];
    } & {
        userId: number;
        id: string;
        examId: number | null;
        createdAt: Date;
        updatedAt: Date;
        weakAreas: string[];
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    }) | null>;
    updateActivityStatus(activityId: string, userId: number, data: UpdateActivityStatusDto): Promise<{
        day: {
            id: string;
            date: Date | null;
            planId: string;
        };
    } & {
        description: string;
        id: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
        timeSlot: string;
        focusArea: string | null;
        missed: boolean;
        dayId: string;
    }>;
    simulateDayPassed(id: string): Promise<{
        message: string;
        movedCount: number;
    }>;
    simulateDateChange(id: string): Promise<{
        message: string;
        movedCount: number;
    }>;
    delete(id: string): Promise<{
        userId: number;
        id: string;
        examId: number | null;
        createdAt: Date;
        updatedAt: Date;
        weakAreas: string[];
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    }>;
}
export {};
