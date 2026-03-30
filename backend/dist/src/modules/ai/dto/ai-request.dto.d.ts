export declare class AiRequestDto {
    exam: string;
    score: number;
    logicalScore?: number;
    quantScore?: number;
    verbalScore?: number;
    confidenceScore?: number;
    weakAreas?: string[];
    interests?: string[];
    learningPattern?: string;
    aspirations?: string;
    userId?: string;
    language: 'en' | 'hi' | 'te';
}
