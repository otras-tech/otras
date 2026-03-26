export interface AIResponse {

  text: string

  provider: string

  model: string

  tokensUsed?: number

  latencyMs?: number

  createdAt?: number

}

export interface StructuredAIResponse {

  success: boolean

  data: AIResponse | null

  error?: string

}
