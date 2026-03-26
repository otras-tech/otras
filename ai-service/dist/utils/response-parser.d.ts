import { AIResponse } from '../types/ai-response.interface';
export declare class ResponseParser {
    static parse(provider: string, model: string, rawResponse: any): AIResponse;
}
