import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { OpenAiProvider } from '../providers/openai.provider';
import { buildPrompt } from '../utils/prompt-builder';
import { CareerAiJobData } from '../../../common/types/types';

@Processor('career-ai')
export class AiProcessor extends WorkerHost {
  private readonly logger = new Logger(AiProcessor.name);

  constructor(private readonly openAiProvider: OpenAiProvider) {
    super();
  }

  async process(
    job: Job<CareerAiJobData>,
  ): Promise<{ status: string; roadmap: unknown }> {
    const { data, language, roadmapId } = job.data;
    this.logger.log(
      `Processing career-ai job ${job.id} for roadmap ${roadmapId}`,
    );

    try {
      // Logic from AiService
      const response = await fetch('http://127.0.0.1:8000/api/v1/career-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-language': language,
        },
        body: JSON.stringify({
          ...data,
          language,
        }),
      });

      let roadmap: unknown;
      if (response.ok) {
        roadmap = await response.json();
      } else {
        this.logger.warn(
          `AI Service call failed (status ${response.status}), falling back to OpenAI`,
        );
        const prompt = buildPrompt(data, language);
        const systemPrompt = 'You are an institutional career advisor.';
        roadmap = await this.openAiProvider.generateCompletion(
          systemPrompt,
          prompt,
        );
      }

      // Here we would typically update the Roadmap model in DB
      // Note: AiService didn't have a repository originally, I should probably add one or update the roadmap status here.

      this.logger.log(`Career roadmap generated for ${roadmapId}`);
      return { status: 'completed', roadmap };
    } catch (error) {
      this.logger.error(
        `Failed to process career-ai job ${job.id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
