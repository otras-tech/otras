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
        readinessIndex: any;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
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
            id: string;
            percentile: number | null;
            createdAt: Date;
            updatedAt: Date;
            readinessIndex: number | null;
            otrId: string;
            tier: number;
            score: number;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    startTier(body: StartTierDto, tier: number): Promise<{
        id: string;
        logicalScore: number | null;
        quantScore: number | null;
        verbalScore: number | null;
        percentile: number | null;
        createdAt: Date;
        updatedAt: Date;
        readinessIndex: number | null;
        tier: number;
        score: number | null;
        totalMarks: number | null;
        accuracy: number | null;
        speed: number | null;
        consistency: number | null;
        profileId: string;
        exam: string | null;
        subjectScores: import("@prisma/client/runtime/library").JsonValue | null;
        startTime: Date | null;
        submitTime: Date | null;
    }>;
    completeTier1(body: ArthaProgressDto & {
        assessmentId?: string;
    }): Promise<{
        feedback: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
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
        selectedExam?: undefined;
        recentReports?: undefined;
    } | {
        feedback: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
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
        selectedExam: string | null;
        recentReports: {
            id: string;
            percentile: number | null;
            createdAt: Date;
            updatedAt: Date;
            readinessIndex: number | null;
            otrId: string;
            tier: number;
            score: number;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    completeTier2(body: ArthaTierResultDto): Promise<{
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
            tier: number;
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
            id: string;
            percentile: number | null;
            createdAt: Date;
            updatedAt: Date;
            readinessIndex: number | null;
            otrId: string;
            tier: number;
            score: number;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    completeTier3(body: ArthaTierResultDto): Promise<{
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
            tier: number;
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
            id: string;
            percentile: number | null;
            createdAt: Date;
            updatedAt: Date;
            readinessIndex: number | null;
            otrId: string;
            tier: number;
            score: number;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
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
        readinessIndex: any;
        logicalScore: number;
        quantScore: number;
        verbalScore: number;
        feedback: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tier: number;
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
            id: string;
            percentile: number | null;
            createdAt: Date;
            updatedAt: Date;
            readinessIndex: number | null;
            otrId: string;
            tier: number;
            score: number;
            totalMarks: number;
            accuracy: number | null;
            speed: number | null;
            consistency: number | null;
            subjectBreakdown: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
}
