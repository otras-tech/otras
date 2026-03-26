import { registerAs } from '@nestjs/config'

export default registerAs('ai', () => ({

  defaultProvider:
    process.env.DEFAULT_AI_PROVIDER || 'openai',

  timeout: parseInt(process.env.AI_TIMEOUT || '30000'),

  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2000'),

}))
