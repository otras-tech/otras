import { ArthaService } from './artha.service';
import { ArthaProgressDto } from './dto/artha-progress.dto';
import { StartTierDto, ArthaTierResultDto, ArthaQuestionAttemptDto } from './dto/artha-tier.dto';
export declare class ArthaController {
    private service;
    constructor(service: ArthaService);
    getStatus(userId: string, req: any): Promise<{
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
    startTier(body: StartTierDto, tier: number, req: any): Promise<{
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
        logicalScore: number | null;
        quantScore: number | null;
        verbalScore: number | null;
        profileId: string;
        jobId: string | null;
        subjectScores: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    completeTier1(body: ArthaProgressDto & {
        assessmentId?: string;
    }, req: any): Promise<{
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
    completeTier2(body: ArthaTierResultDto, req: any): Promise<{
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
    completeTier3(body: ArthaTierResultDto, req: any): Promise<{
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
    attemptQuestion(body: ArthaQuestionAttemptDto, req: any): Promise<{
        accuracy: number;
        speed: number;
        consistency: number;
        attempted: number;
        progress: number;
        correct: number;
    }>;
    getRecentReports(userId: string, req: any): Promise<{
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
}
