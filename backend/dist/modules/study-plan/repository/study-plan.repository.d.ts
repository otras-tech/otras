import { PrismaService } from '../../../database/prisma.service';
import { ActivityStatusUpdate } from '../../../common/types/types';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
import { Prisma } from '@prisma/client';
export declare class StudyPlanRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    userExists(userId: number): Promise<boolean>;
    createPlanWithSchedule(dto: CreateStudyPlanDto, days: any[]): Promise<{
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
    findByUserId(userId: number): Promise<({
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
    findById(id: string): Promise<({
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
    findActivityWithDay(activityId: string): Promise<({
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
    }) | null>;
    updateActivityStatus(activityId: string, data: ActivityStatusUpdate): Promise<{
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
    relocateActivity(activityId: string, targetDayId: string): Promise<{
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
    updateDayDate(dayId: string, newDate: Date): Promise<{
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        day: string;
        date: Date | null;
        planId: string;
    }>;
    deleteByUserId(userId: number): Promise<Prisma.BatchPayload>;
    delete(id: string): Promise<{
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
