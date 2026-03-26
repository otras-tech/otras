import { Injectable } from '@nestjs/common'
import { OpenAIProvider } from './openai.provider'
import { MistralProvider } from './mistral.provider'
import { LlamaProvider } from './llama.provider'

@Injectable()
export class ProviderFactory {

  constructor(
    private readonly openai: OpenAIProvider,
    private readonly mistral: MistralProvider,
    private readonly llama: LlamaProvider,
  ) {}

  getProvider() {

    const provider = process.env.AI_PROVIDER || 'openai'

    switch (provider) {

      case 'mistral':
        return this.mistral

      case 'llama':
        return this.llama

      default:
        return this.openai
    }

  }

}
