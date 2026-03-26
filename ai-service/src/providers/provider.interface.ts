// ======================================================
// AI Provider Interface
// Unified contract for all LLM providers
// (OpenAI, Mistral, Llama, Future models)
// ======================================================

export interface AIProvider {
  /**
   * Generates AI response using structured prompt
   * @param systemPrompt System instruction for the AI model
   * @param payload Structured JSON payload from backend
   */
  generate(systemPrompt: string, payload: Record<string, any>): Promise<string>;
}

// ======================================================
// Optional Advanced Interface (Future Extension)
// Useful if you later support streaming / embeddings
// ======================================================

export interface AdvancedAIProvider extends AIProvider {

  /**
   * Streaming generation (future upgrade)
   */
  streamGenerate?(
    systemPrompt: string,
    payload: Record<string, any>,
    onChunk: (chunk: string) => void
  ): Promise<void>

  /**
   * Embedding generation (for RAG)
   */
  createEmbedding?(text: string): Promise<number[]>

}

// ======================================================
// Structured Prompt Format
// Ensures all providers receive identical prompt format
// ======================================================

export interface PromptPayload {

  systemInstruction: string

  structuredInput: Record<string, any>

  metadata?: {
    module?: string
    userId?: string
    timestamp?: number
  }

}

// ======================================================
// AI Response Structure
// Future enterprise-ready response format
// ======================================================

export interface AIResponse {

  text: string

  provider: string

  model: string

  tokensUsed?: number

  latencyMs?: number

}
