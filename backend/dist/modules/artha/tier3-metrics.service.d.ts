export declare class Tier3MetricsService {
    calculateAccuracy(correctCount: number, attemptedQuestions: number): number;
    calculateSpeed(totalTimeInSeconds: number, attemptedQuestions: number): number;
    calculateConsistency(attempts: {
        isCorrect: boolean;
    }[]): number;
}
