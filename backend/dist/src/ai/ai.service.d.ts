import { AiRequestDto } from './dto/ai-request.dto';
import { OpenAiProvider } from './providers/openai.provider';
export declare class AiService {
    private readonly openAiProvider;
    constructor(openAiProvider: OpenAiProvider);
    generate(dto: AiRequestDto): Promise<{
        status: string;
        language: "en" | "hi" | "te";
        roadmap: any;
    }>;
}
