import { StudyPlanRepository } from '../repository/study-plan.repository';
import { ReschedulerService } from './rescheduler.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
export declare class StudyPlanService {
    private readonly repository;
    private readonly rescheduler;
    private readonly logger;
    constructor(repository: StudyPlanRepository, rescheduler: ReschedulerService);
    generate(dto: CreateStudyPlanDto): Promise<any>;
    save(dto: CreateStudyPlanDto, aiData: any): Promise<{
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
    private assignSequentialDates;
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
    updateActivityStatus(activityId: string, userId: number, status: {
        completed?: boolean;
        missed?: boolean;
    }): Promise<any>;
    processMissedTasks(planId: string): Promise<number>;
    moveToNextDay(planId: string): Promise<{
        message: string;
        movedCount: number;
    }>;
    moveMissedTasks(planId: string): Promise<{
        message: string;
        movedCount: number;
    }>;
    simulateDayPassed(planId: string): Promise<{
        message: string;
        movedCount: number;
    }>;
    private viewPlan;
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
