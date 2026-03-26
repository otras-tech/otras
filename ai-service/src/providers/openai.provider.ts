import { Injectable, Logger } from '@nestjs/common'
import OpenAI from 'openai'
import { AIProvider } from './provider.interface'

@Injectable()
export class OpenAIProvider implements AIProvider {

  private readonly logger = new Logger(OpenAIProvider.name)
  private readonly client: OpenAI

  constructor() {

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

  }

  async generate(systemPrompt: string, payload: any): Promise<string> {

    const structuredPrompt = `
SYSTEM INSTRUCTION:
${systemPrompt}

STRUCTURED INPUT:
${JSON.stringify(payload, null, 2)}

IMPORTANT:
- Use only provided structured data
- Do not calculate scores
- Maintain professional tone

LANGUAGE RULES:
If Telugu: Use modern spoken Telugu (AP/Telangana), avoid classical Sanskrit.
If Hindi: Use simple conversational Hindi.
If English: Use clear Indian English.

AUDIENCE: Competitive exam aspirants.
TONE: Simple, motivational, and practical.
REQUIRED: Clear next steps and study advice.

STRICT ANALYTICAL RULE:
The output must be strictly analytical and educational.
Do NOT include any branding, marketing content, product promotions, advertisements, or suggestions recommending any platform, service, institute, coaching center, or brand.

The response should only focus on objective analysis, academic insights, or structured guidance based on the provided data.
`

    try {

      const response = await this.client.chat.completions.create({

        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',

        messages: [
          { role: 'system', content: 'You are an institutional AI advisor.' },
          { role: 'user', content: structuredPrompt }
        ],

        temperature: 0.4,
        max_tokens: 3000

      })

      return response.choices[0]?.message?.content || ''

    } catch (error) {

      this.logger.error('OpenAI Error', error)
      throw error

    }

  }
}
