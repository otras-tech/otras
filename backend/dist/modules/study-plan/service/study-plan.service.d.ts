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
    generate(requesterId: number, requesterRole: string, dto: CreateStudyPlanDto): Promise<Record<string, unknown> & {
        days?: unknown[];
    }>;
    save(requesterId: number, requesterRole: string, dto: CreateStudyPlanDto, aiData: Record<string, unknown> & {
        days?: unknown[];
    }): Promise<{
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
    private assignSequentialDates;
    findByUserId(requesterId: number, requesterRole: string, userId: number): Promise<({
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
    findOne(requesterId: number, requesterRole: string, id: string): Promise<({
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
    updateActivityStatus(requesterId: number, requesterRole: string, activityId: string, userId: number, status: {
        completed?: boolean;
        missed?: boolean;
    }): Promise<{
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
    processMissedTasks(planId: string): Promise<number>;
    simulateDayPassed(requesterId: number, requesterRole: string, planId: string): Promise<{
        message: string;
        movedCount: number;
    }>;
    delete(requesterId: number, requesterRole: string, id: string): Promise<{
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
