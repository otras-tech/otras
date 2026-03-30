import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CareerAIService {
  private readonly logger = new Logger(CareerAIService.name);

  constructor(@InjectQueue('career-ai') private careerAIQueue: Queue) {}

  async generateRoadmap(dto: any) {
    this.logger.log(
      `CareerAI: Enqueuing Roadmap Generation Job for User ${dto.userId}`,
    );

    // Push the logic to a background job
    const job = await this.careerAIQueue.add('generate-roadmap', dto, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });

    this.logger.log(`CareerAI: Job ${job.id} created successfully`);

    // Return early with the Job ID so the UI can poll/wait without timing out
    return {
      jobId: job.id,
      message:
        'AI Roadmap generation started as a background process. Please check back in a few moments.',
    };
  }

  async getJobStatus(jobId: string) {
    const job = await this.careerAIQueue.getJob(jobId);
    if (!job) return { status: 'not_found' };

    const status = await job.getState();
    return {
      id: job.id,
      status: status,
      result: job.returnvalue,
      progress: job.progress,
      failedReason: job.failedReason,
    };
  }
}
