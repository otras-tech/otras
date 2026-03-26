import { OpenAIProvider } from './openai.provider';
import { MistralProvider } from './mistral.provider';
import { LlamaProvider } from './llama.provider';
export declare class ProviderFactory {
    private readonly openai;
    private readonly mistral;
    private readonly llama;
    constructor(openai: OpenAIProvider, mistral: MistralProvider, llama: LlamaProvider);
    getProvider(): OpenAIProvider | MistralProvider | LlamaProvider;
}
