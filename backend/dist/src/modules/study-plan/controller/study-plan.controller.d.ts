import { StudyPlanService } from '../service/study-plan.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
declare class UpdateActivityStatusDto {
    completed?: boolean;
    missed?: boolean;
}
export declare class StudyPlanController {
    private readonly studyPlanService;
    constructor(studyPlanService: StudyPlanService);
    generate(dto: CreateStudyPlanDto): Promise<any>;
    save(body: {
        dto: CreateStudyPlanDto;
        aiData: any;
    }): Promise<{
        days: ({
            activities: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                timeSlot: string;
                focusArea: string | null;
                completed: boolean;
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
        id: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        weakAreas: string[];
        examId: number | null;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                timeSlot: string;
                focusArea: string | null;
                completed: boolean;
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
        id: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        weakAreas: string[];
        examId: number | null;
        targetExam: string;
        examDate: Date;
        tier1Score: number | null;
        tier2Score: number | null;
        currentLevel: string;
        dailyStudyHours: number;
        mockFrequency: string;
        revisionStrategy: string;
        preferredStudyTimes: string;
    })[]>;
    findOne(id: string): Promise<({
        days: ({
            activities: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                timeSlot: string;
                focusArea: string | null;
                completed: boolean;
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
        id: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        weakAreas: string[];
        examId: number | null;
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
    updateActivityStatus(activityId: string, userId: number, data: UpdateActivityStatusDto): Promise<any>;
    simulateDayPassed(id: string): Promise<{
        message: string;
        movedCount: number;
    }>;
    simulateDateChange(id: string): Promise<{
        message: string;
        movedCount: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        weakAreas: string[];
        examId: number | null;
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
