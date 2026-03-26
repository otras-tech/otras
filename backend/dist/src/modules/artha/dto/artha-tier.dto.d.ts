export declare class StartTierDto {
    userId: string;
}
export declare class ArthaTierResultDto {
    userId: string;
    assessmentId?: string;
    language?: string;
    attemptedCount?: number;
    totalQuestions?: number;
}
export declare class ArthaQuestionAttemptDto {
    assessmentId: string;
    questionId: number;
    selectedOption: string;
    isCorrect: boolean;
    timeTaken: number;
}
