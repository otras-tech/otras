import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { AIProvider } from './provider.interface'

@Injectable()
export class LlamaProvider implements AIProvider {

  private readonly logger = new Logger(LlamaProvider.name)

  async generate(systemPrompt: string, payload: any): Promise<string> {

    const prompt = `
SYSTEM INSTRUCTION:
${systemPrompt}

STRUCTURED INPUT:
${JSON.stringify(payload, null, 2)}

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

      const response = await axios.post(

        process.env.LLAMA_URL || 'http://localhost:11434/api/generate',

        {
          model: process.env.LLAMA_MODEL || 'llama3',
          prompt,
          stream: false
        }

      )

      return response.data.response

    } catch (error) {

      this.logger.error('Llama Error', error)
      throw error

    }

  }
}
