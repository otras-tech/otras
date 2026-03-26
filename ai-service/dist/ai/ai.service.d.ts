import { ProviderFactory } from '../providers/provider.factory';
export declare class AiService {
    private readonly providerFactory;
    private readonly logger;
    constructor(providerFactory: ProviderFactory);
    generate(systemPrompt: string, payload: any): Promise<string>;
}
