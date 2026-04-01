export declare class StartMockAttemptDto {
    otrId: string;
    mockTestOrTestId: number;
}
export declare class SubmitMockAttemptDto {
    otrId: string;
    mockTestId: number;
    score: number;
    totalMarks: number;
    attemptId?: number;
}
export declare class SubmitExamAttemptDto {
    otrId: string;
    examId: number;
    score: number;
    totalMarks: number;
    attemptId?: number;
    correctAnswers?: number;
    subjectBreakdown?: Record<string, number>;
}
