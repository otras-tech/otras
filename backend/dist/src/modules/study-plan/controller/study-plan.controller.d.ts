import { StudyPlanService } from '../service/study-plan.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
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
                description: string;
                timeSlot: string;
                focusArea: string | null;
                completed: boolean;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            id: string;
            day: string;
            date: Date | null;
            planId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        examId: number | null;
        userId: number;
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
                id: string;
                description: string;
                timeSlot: string;
                focusArea: string | null;
                completed: boolean;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            id: string;
            day: string;
            date: Date | null;
            planId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        examId: number | null;
        userId: number;
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
    })[]>;
    findOne(id: string): Promise<({
        days: ({
            activities: {
                id: string;
                description: string;
                timeSlot: string;
                focusArea: string | null;
                completed: boolean;
                missed: boolean;
                dayId: string;
            }[];
        } & {
            id: string;
            day: string;
            date: Date | null;
            planId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        examId: number | null;
        userId: number;
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
    updateActivity(activityId: string, userId: number, completed?: boolean, missed?: boolean): Promise<any>;
    nextDay(id: string): Promise<{
        message: string;
        movedCount: number;
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
        id: string;
        createdAt: Date;
        examId: number | null;
        userId: number;
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
