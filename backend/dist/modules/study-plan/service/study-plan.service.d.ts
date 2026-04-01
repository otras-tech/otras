import { ConfigService } from '@nestjs/config';
import { StudyPlanRepository } from '../repository/study-plan.repository';
import { ReschedulerService } from './rescheduler.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
export declare class StudyPlanService {
    private readonly repository;
    private readonly rescheduler;
    private readonly configService;
    private readonly logger;
    constructor(repository: StudyPlanRepository, rescheduler: ReschedulerService, configService: ConfigService);
    generate(dto: CreateStudyPlanDto): Promise<Record<string, unknown> & {
        days?: unknown[];
    }>;
    save(dto: CreateStudyPlanDto, aiData: Record<string, unknown> & {
        days?: unknown[];
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
    private assignSequentialDates;
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
    updateActivityStatus(activityId: string, userId: number, status: {
        completed?: boolean;
        missed?: boolean;
    }): Promise<{
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
