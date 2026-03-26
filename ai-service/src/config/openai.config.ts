import { registerAs } from '@nestjs/config'

export default registerAs('openai', () => ({

  apiKey: process.env.OPENAI_API_KEY,

  model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',

  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),

  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2000'),

  timeout: parseInt(process.env.AI_TIMEOUT || '30000'),

}))
