import { registerAs } from '@nestjs/config'

export default registerAs('mistral', () => ({

  apiKey: process.env.MISTRAL_API_KEY,

  endpoint:
    process.env.MISTRAL_ENDPOINT ||
    'https://api.mistral.ai/v1/chat/completions',

  model: process.env.MISTRAL_MODEL || 'mistral-medium',

  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '6000'),

  timeout: parseInt(process.env.AI_TIMEOUT || '90000'),

}))
