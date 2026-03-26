export declare class CareerReadinessAnswerDto {
    questionId: number;
    selectedOption: string;
    timeTaken: number;
}
export declare class SubmitCareerReadinessDto {
    otrId: string;
    testId: number;
    answers: CareerReadinessAnswerDto[];
}
