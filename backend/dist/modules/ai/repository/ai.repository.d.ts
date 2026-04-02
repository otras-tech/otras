import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class AiRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createProfile(data: Prisma.IntelligenceProfileUncheckedCreateInput): Promise<{
        userId: string;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        interests: string[];
        learningPattern: string;
        aspirations: string;
        confidenceIndex: number;
    }>;
    createRoadmap(data: Prisma.RoadmapUncheckedCreateInput): Promise<{
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        profileId: string;
        summary: string;
        jobId: string | null;
        recommendations: string[];
        phase1: string;
        phase2: string;
    }>;
    updateRoadmap(id: string, data: Prisma.RoadmapUpdateInput): Promise<{
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        profileId: string;
        summary: string;
        jobId: string | null;
        recommendations: string[];
        phase1: string;
        phase2: string;
    }>;
    findRoadmapById(id: string): Promise<({
        IntelligenceProfile: {
            userId: string;
            isDeleted: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            logicalScore: number;
            quantScore: number;
            verbalScore: number;
            interests: string[];
            learningPattern: string;
            aspirations: string;
            confidenceIndex: number;
        };
    } & {
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        profileId: string;
        summary: string;
        jobId: string | null;
        recommendations: string[];
        phase1: string;
        phase2: string;
    }) | null>;
    findRoadmapByJobId(jobId: string): Promise<{
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        profileId: string;
        summary: string;
        jobId: string | null;
        recommendations: string[];
        phase1: string;
        phase2: string;
    } | null>;
}
