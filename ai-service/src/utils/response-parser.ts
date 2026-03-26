import { AIResponse } from '../types/ai-response.interface'

export class ResponseParser {

  static parse(provider: string, model: string, rawResponse: any): AIResponse {

    if (!rawResponse) {

      return {
        text: '',
        provider,
        model,
        createdAt: Date.now()
      }

    }

    if (typeof rawResponse === 'string') {

      return {
        text: rawResponse,
        provider,
        model,
        createdAt: Date.now()
      }

    }

    if (rawResponse.choices && rawResponse.choices[0]?.message?.content) {

      return {
        text: rawResponse.choices[0].message.content,
        provider,
        model,
        tokensUsed: rawResponse.usage?.total_tokens,
        createdAt: Date.now()
      }

    }

    return {
      text: JSON.stringify(rawResponse),
      provider,
      model,
      createdAt: Date.now()
    }

  }

}
