export declare class CreateStudyPlanDto {
    userId: number;
    examId?: number;
    targetExam: string;
    examDate: string;
    tier1Score?: number;
    tier2Score?: number;
    currentLevel: string;
    weakAreas: string[];
    dailyStudyHours: number;
    mockFrequency: string;
    revisionStrategy: string;
    preferredStudyTimes: string;
    language?: string;
    planDurationDays?: number;
}
