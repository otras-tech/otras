import { ArthaService } from './artha.service';
import { ArthaProgressDto } from './dto/artha-progress.dto';
import { StartTierDto, ArthaTierResultDto, ArthaQuestionAttemptDto } from './dto/artha-tier.dto';
export declare class ArthaController {
    private service;
    constructor(service: ArthaService);
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
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            tier: number;
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
            weakAreas: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            otrId: string;
            tier: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            score: number;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
            percentile: number | null;
            readinessIndex: number | null;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
        }[];
    }>;
    startTier(body: StartTierDto, tier: number): Promise<{
        exam: string | null;
        tier: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        startTime: Date | null;
        submitTime: Date | null;
        logicalScore: number | null;
        quantScore: number | null;
        verbalScore: number | null;
        percentile: number | null;
        readinessIndex: number | null;
        totalMarks: number | null;
        status: string;
        profileId: string;
        jobId: string | null;
        subjectScores: import("@prisma/client/runtime/library").JsonValue | null;
        accuracy: number | null;
        speed: number | null;
        consistency: number | null;
    }>;
    completeTier1(body: ArthaProgressDto & {
        assessmentId?: string;
    }): Promise<{
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
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            tier: number;
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
            weakAreas: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            otrId: string;
            tier: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            score: number;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
            percentile: number | null;
            readinessIndex: number | null;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
        }[];
    }>;
    completeTier2(body: ArthaTierResultDto): Promise<{
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
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            tier: number;
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
            weakAreas: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            otrId: string;
            tier: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            score: number;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
            percentile: number | null;
            readinessIndex: number | null;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
        }[];
    }>;
    completeTier3(body: ArthaTierResultDto): Promise<{
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
        readinessIndex: number;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            tier: number;
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
            weakAreas: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            otrId: string;
            tier: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            score: number;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
            percentile: number | null;
            readinessIndex: number | null;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
        }[];
    }>;
    attemptQuestion(body: ArthaQuestionAttemptDto): Promise<{
        accuracy: number;
        speed: number;
        consistency: number;
        attempted: number;
        progress: number;
        correct: number;
    }>;
    getRecentReports(userId: string): Promise<{
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
            tier: number;
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
            weakAreas: string | null;
            examSuggestions: string | null;
        } | null;
        selectedExam: string | null;
        recentReports: {
            otrId: string;
            tier: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            score: number;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
            percentile: number | null;
            readinessIndex: number | null;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
        }[];
    }>;
}
