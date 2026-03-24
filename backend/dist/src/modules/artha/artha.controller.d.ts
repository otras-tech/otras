import { ArthaService } from './artha.service';
import { ArthaProgressDto } from './dto/artha-progress.dto';
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
            createdAt: Date;
            percentile: number | null;
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
    startTier(body: {
        userId: string;
    }, tier: string): Promise<{
        exam: string | null;
        id: string;
        createdAt: Date;
        logicalScore: number | null;
        quantScore: number | null;
        verbalScore: number | null;
        percentile: number | null;
        readinessIndex: number | null;
        tier: number;
        score: number | null;
        totalMarks: number | null;
        accuracy: number | null;
        speed: number | null;
        consistency: number | null;
        profileId: string;
        subjectScores: import("@prisma/client/runtime/library").JsonValue | null;
        startTime: Date | null;
        submitTime: Date | null;
        idempotencyKey: string | null;
    }>;
    completeTier1(body: ArthaProgressDto & {
        assessmentId?: string;
    }): Promise<{
        feedback: {
            id: string;
            createdAt: Date;
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
            createdAt: Date;
            percentile: number | null;
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
    completeTier2(body: {
        userId: string;
        assessmentId?: string;
        language?: string;
        attemptedCount?: number;
        totalQuestions?: number;
    }): Promise<{
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
            createdAt: Date;
            percentile: number | null;
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
    completeTier3(body: {
        userId: string;
        assessmentId?: string;
        language?: string;
        attemptedCount?: number;
        totalQuestions?: number;
    }): Promise<{
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
            createdAt: Date;
            percentile: number | null;
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
    attemptQuestion(body: {
        assessmentId: string;
        questionId: number;
        selectedOption: string;
        isCorrect: boolean;
        timeTaken: number;
    }): Promise<{
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
            createdAt: Date;
            percentile: number | null;
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
