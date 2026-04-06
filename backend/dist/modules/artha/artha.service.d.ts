import { ConfigService } from '@nestjs/config';
import { ArthaRepository } from './repository/artha.repository';
import { ArthaProgressDto } from './dto/artha-progress.dto';
import { Tier3MetricsService } from './tier3-metrics.service';
import { Queue } from 'bullmq';
export declare class ArthaService {
    private repository;
    private metricsService;
    private configService;
    private arthaQueue;
    private readonly logger;
    private ML_SERVICE_URL;
    private AI_SERVICE_URL;
    constructor(repository: ArthaRepository, metricsService: Tier3MetricsService, configService: ConfigService, arthaQueue: Queue);
    getStatus(requesterId: number, requesterOtrId: string, requesterRole: string, userId: string): Promise<{
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: null;
        selectedExam?: undefined;
        recentReports?: undefined;
    } | {
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            isDeleted: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
            weakAreas: string | null;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            accuracyInsight: string | null;
            consistencyInsight: string | null;
            preparationAdvice: string | null;
            speedInsight: string | null;
            subjectStrength: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            isDeleted: boolean;
            id: string;
            otrId: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
            score: number;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
            readinessIndex: number | null;
            percentile: number | null;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    startTierAssessment(requesterId: number, requesterOtrId: string, requesterRole: string, userId: string, tier: number): Promise<{
        exam: string | null;
        isDeleted: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        tier: number;
        score: number | null;
        totalMarks: number | null;
        accuracy: number | null;
        speed: number | null;
        consistency: number | null;
        readinessIndex: number | null;
        percentile: number | null;
        startTime: Date | null;
        submitTime: Date | null;
        subjectScores: import("@prisma/client/runtime/library").JsonValue | null;
        logicalScore: number | null;
        quantScore: number | null;
        verbalScore: number | null;
        profileId: string;
        jobId: string | null;
    }>;
    recordQuestionAttempt(requesterId: number, requesterOtrId: string, requesterRole: string, data: {
        assessmentId: string;
        questionId: number;
        selectedOption: string;
        isCorrect: boolean;
        timeTaken: number;
        totalQuestions?: number;
    }): Promise<{
        accuracy: number;
        speed: number;
        consistency: number;
        attempted: number;
        progress: number;
        correct: number;
    }>;
    processTier1(requesterId: number, requesterOtrId: string, requesterRole: string, data: ArthaProgressDto, assessmentId?: string): Promise<{
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: null;
        selectedExam?: undefined;
        recentReports?: undefined;
    } | {
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            isDeleted: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
            weakAreas: string | null;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            accuracyInsight: string | null;
            consistencyInsight: string | null;
            preparationAdvice: string | null;
            speedInsight: string | null;
            subjectStrength: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            isDeleted: boolean;
            id: string;
            otrId: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
            score: number;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
            readinessIndex: number | null;
            percentile: number | null;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    processTier2(requesterId: number, requesterOtrId: string, requesterRole: string, userId: string, assessmentId?: string, language?: string, attemptedCountOverride?: number, totalQuestionsOverride?: number): Promise<{
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: null;
        selectedExam?: undefined;
        recentReports?: undefined;
    } | {
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            isDeleted: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
            weakAreas: string | null;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            accuracyInsight: string | null;
            consistencyInsight: string | null;
            preparationAdvice: string | null;
            speedInsight: string | null;
            subjectStrength: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            isDeleted: boolean;
            id: string;
            otrId: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
            score: number;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
            readinessIndex: number | null;
            percentile: number | null;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    processTier3(requesterId: number, requesterOtrId: string, requesterRole: string, userId: string, assessmentId?: string, language?: string, attemptedCountOverride?: number, totalQuestionsOverride?: number): Promise<{
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: null;
        selectedExam?: undefined;
        recentReports?: undefined;
    } | {
        tier1: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
        };
        tier2: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        tier3: {
            unlocked: boolean;
            completed: boolean;
            progress: number;
            subscriptionRequired: boolean;
        };
        percentile: number;
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            isDeleted: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
            weakAreas: string | null;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            accuracyInsight: string | null;
            consistencyInsight: string | null;
            preparationAdvice: string | null;
            speedInsight: string | null;
            subjectStrength: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            isDeleted: boolean;
            id: string;
            otrId: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
            score: number;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
            readinessIndex: number | null;
            percentile: number | null;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    private calculateReadiness;
    private generateAndSaveAiFeedback;
}
