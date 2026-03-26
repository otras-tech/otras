import { Injectable, BadRequestException } from '@nestjs/common';
import { AiRequestDto } from './dto/ai-request.dto';
import { buildPrompt } from './utils/prompt-builder';
import { OpenAiProvider } from './providers/openai.provider';

@Injectable()
export class AiService {
  constructor(private readonly openAiProvider: OpenAiProvider) { }

  async generate(dto: AiRequestDto) {
    const { language, ...data } = dto;

    if (!['en', 'hi', 'te'].includes(language)) {
      throw new BadRequestException('Unsupported language');
    }

    try {
      // Call the AI microservice
      const response = await fetch('http://127.0.0.1:8000/api/v1/career-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-language': language,
        },
        body: JSON.stringify({
          ...data,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service responded with status: ${response.status}`);
      }

      const result = await response.json();

      return {
        status: 'success',
        language,
        roadmap: result,
      };
    } catch (error) {
      // Fallback to simulation if microservice is down
      console.error('AI Service call failed:', error.message);
      
      const prompt = buildPrompt(data, language);
      const systemPrompt = "You are an institutional career advisor.";
      const simulatedResponse = await this.openAiProvider.generateCompletion(systemPrompt, prompt);

      return {
        status: 'success',
        language,
        roadmap: simulatedResponse,
      };
    }
  }
}
