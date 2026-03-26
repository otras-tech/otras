export interface AIProvider {
    generate(systemPrompt: string, payload: Record<string, any>): Promise<string>;
}
export interface AdvancedAIProvider extends AIProvider {
    streamGenerate?(systemPrompt: string, payload: Record<string, any>, onChunk: (chunk: string) => void): Promise<void>;
    createEmbedding?(text: string): Promise<number[]>;
}
export interface PromptPayload {
    systemInstruction: string;
    structuredInput: Record<string, any>;
    metadata?: {
        module?: string;
        userId?: string;
        timestamp?: number;
    };
}
export interface AIResponse {
    text: string;
    provider: string;
    model: string;
    tokensUsed?: number;
    latencyMs?: number;
}
