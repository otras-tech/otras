export declare class CreateApplicationDto {
    userId: number;
    examId: number;
}
export declare class UpdateApplicationStatusDto {
    status: string;
    applicationStatus?: string;
    admitCardStatus?: string;
    examKeyStatus?: string;
    resultStatus?: string;
}
