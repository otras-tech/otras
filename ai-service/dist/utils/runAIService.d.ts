export interface AIServiceOptions {
    provider?: 'openai' | 'mistral';
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
    expectedFields?: string[];
    maxRetries?: number;
}
export declare function runAIService(prompt: string, language?: string, options?: AIServiceOptions): Promise<any>;
