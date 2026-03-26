import { ProviderFactory } from '../providers/provider.factory';
import { AIResponse } from '../types/ai-response.interface';
export declare class ModelRouterService {
    private readonly providerFactory;
    private readonly logger;
    constructor(providerFactory: ProviderFactory);
    generate(systemPrompt: string, payload: any): Promise<AIResponse>;
}
