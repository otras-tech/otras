import { Request } from 'express';
export interface JwtPayload {
    sub: number;
    email: string;
    role: string;
    jti?: string;
}
export interface JwtRefreshPayload extends JwtPayload {
    jti: string;
}
export interface RequestUser {
    id: number;
    email: string;
    role: string;
    jti?: string;
    otrId?: string;
    refreshToken?: string;
}
export interface AuthenticatedRequest extends Request {
    user: RequestUser;
}
export interface SubjectBreakdown {
    [subjectName: string]: {
        correct: number;
        wrong: number;
        unanswered: number;
        total: number;
        score: number;
    };
}
export interface ReadinessScores {
    aptitude_score?: number;
    subject_score?: number;
    time_management_score?: number;
    mock_average_score?: number;
    consistency_score?: number;
}
export interface AiRoadmapResponse {
    summary: string;
    recommendations: string[];
    phase1?: string;
    phase2?: string;
}
export interface RecentReportData {
    tier: number;
    score: number;
    totalMarks: number;
    percentile?: number;
    readinessIndex?: number;
    accuracy?: number;
    speed?: number;
    consistency?: number;
    subjectBreakdown?: Record<string, number> | SubjectBreakdown;
}
export interface StudyPlanDayInput {
    date: Date | string;
    day?: string;
    activities: {
        timeSlot: string;
        description: string;
        focusArea?: string;
    }[];
}
export interface ActivityStatusUpdate {
    completed?: boolean;
    missed?: boolean;
}
export interface AssessmentCompletionData {
    tier?: number;
    exam?: string;
    logicalScore?: number;
    quantScore?: number;
    verbalScore?: number;
    subjectScores?: Record<string, number>;
    accuracy?: number;
    speed?: number;
    consistency?: number;
    percentile?: number;
    score?: number;
    totalMarks?: number;
    readinessIndex?: number;
    status?: string;
    jobId?: string;
    startTime?: Date;
    submitTime?: Date;
}
export interface ArthaJobData {
    type: string;
    userId: string;
    assessmentId: string;
    tier: number;
    data: Record<string, unknown>;
}
export interface CareerAiJobData {
    data: Record<string, unknown>;
    language: string;
    roadmapId: string;
}
export interface ResultJobData {
    userId: number;
    testId: number;
    answers: {
        questionId: number;
        selectedOption: string;
    }[];
    tier?: number;
    resultId?: number;
}
export interface AiStudyPlanResponse {
    summary?: string;
    days: StudyPlanDayInput[];
    [key: string]: unknown;
}
export interface RazorpayInstance {
    orders: {
        create(options: {
            amount: number;
            currency: string;
            receipt: string;
        }): Promise<{
            id: string;
            amount: number;
            currency: string;
        }>;
    };
}
export interface HttpExceptionResponse {
    message: string | string[];
    error?: string;
    statusCode?: number;
}
