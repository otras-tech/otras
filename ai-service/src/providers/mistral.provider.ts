import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { AIProvider } from './provider.interface'

@Injectable()
export class MistralProvider implements AIProvider {

  private readonly logger = new Logger(MistralProvider.name)

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

        'https://api.mistral.ai/v1/chat/completions',

        {
          model: process.env.MISTRAL_MODEL || 'mistral-medium',
          messages: [
            { role: 'system', content: 'You are an institutional AI advisor.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 3000
        },

        {
          headers: {
            Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }

      )

      if (response.data && response.data.choices && response.data.choices[0]) {
        return response.data.choices[0].message.content;
      }
      throw new Error('Malformed response from Mistral');

    } catch (error) {

      this.logger.error('Mistral Error details:', error.response?.data || error.message);
      throw error;
    }

  }
}

