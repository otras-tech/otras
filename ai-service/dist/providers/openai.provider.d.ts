import { AIProvider } from './provider.interface';
export declare class OpenAIProvider implements AIProvider {
    private readonly logger;
    private readonly client;
    constructor();
    generate(systemPrompt: string, payload: any): Promise<string>;
}
