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
    generate(dto: CreateStudyPlanDto, req: any): Promise<Record<string, unknown> & {
        days?: unknown[];
    }>;
    save(body: {
        dto: CreateStudyPlanDto;
        aiData: Record<string, unknown>;
    }, req: any): Promise<{
        days: ({
            activities: {
                isDeleted: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                completed: boolean;
                timeSlot: string;
                focusArea: string | null;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            isDeleted: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: string;
            date: Date | null;
            planId: string;
        })[];
    } & {
        userId: number;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: number | null;
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        weakAreas: string[];
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    }>;
    findByUserId(userId: number, req: any): Promise<({
        days: ({
            activities: {
                isDeleted: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                completed: boolean;
                timeSlot: string;
                focusArea: string | null;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            isDeleted: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: string;
            date: Date | null;
            planId: string;
        })[];
    } & {
        userId: number;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: number | null;
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        weakAreas: string[];
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    }) | null>;
    findOne(id: string, req: any): Promise<({
        days: ({
            activities: {
                isDeleted: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                completed: boolean;
                timeSlot: string;
                focusArea: string | null;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            isDeleted: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: string;
            date: Date | null;
            planId: string;
        })[];
    } & {
        userId: number;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: number | null;
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        weakAreas: string[];
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    }) | null>;
    updateActivityStatus(activityId: string, userId: number, data: UpdateActivityStatusDto, req: any): Promise<{
        day: {
            id: string;
            date: Date | null;
            planId: string;
        };
    } & {
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        completed: boolean;
        timeSlot: string;
        focusArea: string | null;
        missed: boolean;
        dayId: string;
    }>;
    simulateDayPassed(id: string, req: any): Promise<{
        message: string;
        movedCount: number;
    }>;
    delete(id: string, req: any): Promise<{
        userId: number;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        examId: number | null;
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        weakAreas: string[];
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    }>;
}
export {};
