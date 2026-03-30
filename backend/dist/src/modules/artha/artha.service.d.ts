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
    getStatus(userId: string): Promise<{
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
        readinessIndex: any;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            accuracyInsight: string | null;
            consistencyInsight: string | null;
            preparationAdvice: string | null;
            speedInsight: string | null;
            subjectStrength: string | null;
            tier: number;
            weakAreas: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            id: string;
            otrId: string;
            createdAt: Date;
            updatedAt: Date;
            percentile: number | null;
            readinessIndex: number | null;
            tier: number;
            score: number;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
        }[];
    }>;
    startTierAssessment(userId: string, tier: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        exam: string | null;
        status: string;
        logicalScore: number | null;
        quantScore: number | null;
        verbalScore: number | null;
        percentile: number | null;
        readinessIndex: number | null;
        profileId: string;
        tier: number;
        score: number | null;
        startTime: Date | null;
        submitTime: Date | null;
        totalMarks: number | null;
        jobId: string | null;
        subjectScores: import("@prisma/client/runtime/library").JsonValue | null;
        accuracy: number | null;
        speed: number | null;
        consistency: number | null;
    }>;
    recordQuestionAttempt(data: {
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
    processTier1(data: ArthaProgressDto, assessmentId?: string): Promise<{
        status: string;
        jobId: string;
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
        status: string;
        jobId: string;
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
        readinessIndex: any;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            accuracyInsight: string | null;
            consistencyInsight: string | null;
            preparationAdvice: string | null;
            speedInsight: string | null;
            subjectStrength: string | null;
            tier: number;
            weakAreas: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            id: string;
            otrId: string;
            createdAt: Date;
            updatedAt: Date;
            percentile: number | null;
            readinessIndex: number | null;
            tier: number;
            score: number;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
        }[];
    }>;
    processTier2(userId: string, assessmentId?: string, language?: string, attemptedCountOverride?: number, totalQuestionsOverride?: number): Promise<{
        status: string;
        jobId: string;
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
        status: string;
        jobId: string;
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
        readinessIndex: any;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            accuracyInsight: string | null;
            consistencyInsight: string | null;
            preparationAdvice: string | null;
            speedInsight: string | null;
            subjectStrength: string | null;
            tier: number;
            weakAreas: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            id: string;
            otrId: string;
            createdAt: Date;
            updatedAt: Date;
            percentile: number | null;
            readinessIndex: number | null;
            tier: number;
            score: number;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
        }[];
    }>;
    processTier3(userId: string, assessmentId?: string, language?: string, attemptedCountOverride?: number, totalQuestionsOverride?: number): Promise<{
        status: string;
        jobId: string;
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
        status: string;
        jobId: string;
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
        readinessIndex: any;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            profileId: string;
            logicalFoundation: string | null;
            subjectDepth: string | null;
            readinessInsight: string | null;
            accuracyInsight: string | null;
            consistencyInsight: string | null;
            preparationAdvice: string | null;
            speedInsight: string | null;
            subjectStrength: string | null;
            tier: number;
            weakAreas: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            id: string;
            otrId: string;
            createdAt: Date;
            updatedAt: Date;
            percentile: number | null;
            readinessIndex: number | null;
            tier: number;
            score: number;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
        }[];
    }>;
    private calculateReadiness;
    private generateAndSaveAiFeedback;
}
