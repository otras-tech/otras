import { AIProvider } from './provider.interface';
export declare class MistralProvider implements AIProvider {
    private readonly logger;
    generate(systemPrompt: string, payload: any): Promise<string>;
}
