import { Injectable, Logger } from '@nestjs/common'
import { ProviderFactory } from '../providers/provider.factory'
import { buildPrompt } from '../utils/prompt-builder'
import { ResponseParser } from '../utils/response-parser'
import { AIResponse } from '../types/ai-response.interface'

@Injectable()
export class ModelRouterService {

  private readonly logger = new Logger(ModelRouterService.name)

  constructor(
    private readonly providerFactory: ProviderFactory
  ) {}

  async generate(systemPrompt: string, payload: any): Promise<AIResponse> {

    const provider = this.providerFactory.getProvider()

    const providerName = process.env.AI_PROVIDER || 'openai'

    const modelName = process.env.OPENAI_MODEL || 'default'

    const prompt = buildPrompt(systemPrompt, payload)

    try {

      const rawResponse = await provider.generate(prompt, payload)

      const parsed = ResponseParser.parse(
        providerName,
        modelName,
        rawResponse
      )

      return parsed

    } catch (error) {

      this.logger.error('Primary AI provider failed', error)

      const fallback = process.env.AI_FALLBACK || 'openai'

      try {

        process.env.AI_PROVIDER = fallback

        const fallbackProvider = this.providerFactory.getProvider()

        const rawResponse = await fallbackProvider.generate(prompt, payload)

        return ResponseParser.parse(
          fallback,
          modelName,
          rawResponse
        )

      } catch (fallbackError) {

        this.logger.error('Fallback AI provider also failed', fallbackError)

        throw new Error('All AI providers failed')

      }

    }

  }

}
