export declare class StartTestDto {
    userId: number;
    testId: number;
    tier?: number;
}
export declare class AnswerDto {
    questionId: number;
    selectedOption: string;
}
export declare class SubmitTestDto {
    userId: number;
    testId: number;
    answers: AnswerDto[];
    tier?: number;
    resultId?: number;
}
