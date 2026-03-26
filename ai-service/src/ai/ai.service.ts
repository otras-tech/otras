import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'

import { ProviderFactory } from '../providers/provider.factory'
import { getLanguageRules } from '../localization/language-map'

@Injectable()
export class AiService {

  private readonly logger = new Logger(AiService.name)

  constructor(
    private readonly providerFactory: ProviderFactory
  ) {}

  async generate(systemPrompt: string, payload: any): Promise<string> {
    const language = payload?.language || 'en-IN';
    const languageRules = getLanguageRules(language);
    
    // Combine the OTRAS Standard with the specific module prompt
    const finalSystemPrompt = `${languageRules}\n\n--- MODULE SPECIFIC INSTRUCTIONS ---\n\n${systemPrompt}`;

    const provider = this.providerFactory.getProvider()

    try {
      const response = await provider.generate(finalSystemPrompt, payload)
      return response
    } catch (error) {
      this.logger.error('Primary provider failed. Trying fallback...', error)
      try {
        const fallback = process.env.AI_FALLBACK || 'openai'
        process.env.AI_PROVIDER = fallback
        const fallbackProvider = this.providerFactory.getProvider()
        return await fallbackProvider.generate(finalSystemPrompt, payload)
      } catch (fallbackError) {
        this.logger.error('All AI providers failed', fallbackError)
        throw new InternalServerErrorException(
          'AI generation failed. Please try again later.'
        )
      }
    }
  }
}
