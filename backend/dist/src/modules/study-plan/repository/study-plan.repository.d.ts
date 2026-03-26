import { PrismaService } from '../../../prisma/prisma.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
export declare class StudyPlanRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    userExists(id: number): Promise<boolean>;
    createWithSchedule(data: CreateStudyPlanDto, days: any[]): Promise<{
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
    findById(id: string): Promise<({
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
    updateActivityStatus(activityId: string, data: any): Promise<{
        day: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: string;
            date: Date | null;
            planId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        timeSlot: string;
        focusArea: string | null;
        completed: boolean;
        missed: boolean;
        dayId: string;
    }>;
    relocateActivity(activityId: string, targetDayId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        timeSlot: string;
        focusArea: string | null;
        completed: boolean;
        missed: boolean;
        dayId: string;
    }>;
    updateDayDate(dayId: string, date: Date): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        day: string;
        date: Date | null;
        planId: string;
    }>;
    createActivity(dayId: string, data: {
        timeSlot: string;
        description: string;
        focusArea?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        timeSlot: string;
        focusArea: string | null;
        completed: boolean;
        missed: boolean;
        dayId: string;
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
