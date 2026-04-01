import { Request } from 'express';

// ─── JWT Payload Types ──────────────────────────────────────────────

/** Payload decoded from an access token */
export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  jti?: string;
}

/** Payload decoded from a refresh token (jti is always present) */
export interface JwtRefreshPayload extends JwtPayload {
  jti: string;
}

// ─── Request User Types ─────────────────────────────────────────────

/** Shape of `req.user` after JWT validation */
export interface RequestUser {
  id: number;
  email: string;
  role: string;
  jti?: string;
  otrId?: string;
  refreshToken?: string;
}

/** Express Request extended with a typed `user` property */
export interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

// ─── Domain Types ───────────────────────────────────────────────────

/** Per-subject score breakdown used across Result, CareerReadiness, and Artha */
export interface SubjectBreakdown {
  [subjectName: string]: {
    correct: number;
    wrong: number;
    unanswered: number;
    total: number;
    score: number;
  };
}

/** Scores used as input to the ML readiness model */
export interface ReadinessScores {
  aptitude_score?: number;
  subject_score?: number;
  time_management_score?: number;
  mock_average_score?: number;
  consistency_score?: number;
}

/** AI roadmap response shape */
export interface AiRoadmapResponse {
  summary: string;
  recommendations: string[];
  phase1?: string;
  phase2?: string;
}

/** Data shape for upserting recent artha reports */
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

/** Input shape for study plan days from AI service */
export interface StudyPlanDayInput {
  date: Date | string;
  day?: string;
  activities: {
    timeSlot: string;
    description: string;
    focusArea?: string;
  }[];
}

/** Status update for a study activity */
export interface ActivityStatusUpdate {
  completed?: boolean;
  missed?: boolean;
}

/** Artha assessment completion data */
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

/** Job data for BullMQ artha queue */
export interface ArthaJobData {
  type: string;
  userId: string;
  assessmentId: string;
  tier: number;
  data: Record<string, unknown>;
}

/** Job data for BullMQ career-ai queue */
export interface CareerAiJobData {
  data: Record<string, unknown>;
  language: string;
  roadmapId: string;
}

/** Job data for BullMQ result-calculation queue */
export interface ResultJobData {
  userId: number;
  testId: number;
  answers: { questionId: number; selectedOption: string }[];
  tier?: number;
  resultId?: number;
}

/** AI study plan response from AI service */
export interface AiStudyPlanResponse {
  summary?: string;
  days: StudyPlanDayInput[];
  [key: string]: unknown;
}

/** Razorpay instance type (since the SDK uses `require`) */
export interface RazorpayInstance {
  orders: {
    create(options: {
      amount: number;
      currency: string;
      receipt: string;
    }): Promise<{ id: string; amount: number; currency: string }>;
  };
}

/** HttpException response shape */
export interface HttpExceptionResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}
