import { registerAs } from '@nestjs/config'

export default registerAs('llama', () => ({

  endpoint:
    process.env.LLAMA_ENDPOINT ||
    'http://localhost:11434/api/generate',

  model: process.env.LLAMA_MODEL || 'llama3',

  timeout: parseInt(process.env.AI_TIMEOUT || '30000'),

}))
