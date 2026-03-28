import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import axios from 'axios';
import { NotificationGateway } from '../../../common/notification.gateway';

@Processor('career-ai')
export class CareerAIProcessor extends WorkerHost {
  private readonly logger = new Logger(CareerAIProcessor.name);

  constructor(private readonly notifications: NotificationGateway) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const userId = job.data.userId;
    this.logger.log(`Processing job ${job.id} for userId: ${userId}`);
    
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000/api/v1";
    
    try {
      // Simulate/Trigger AI processing
      const response = await axios.post(
          `${aiServiceUrl}/career-ai`,
          job.data,
          { timeout: 120000 }
      );
      
      this.logger.log(`Job ${job.id} completed successfully`);
      const roadmap = response.data.roadmap;

      // Realtime Notification
      if (userId) {
        this.notifications.sendToUser(userId, 'roadmap-completed', {
          jobId: job.id,
          roadmap: roadmap
        });
      }

      return roadmap;
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
      
      if (userId) {
        this.notifications.sendToUser(userId, 'roadmap-failed', {
          jobId: job.id,
          error: "AI generation failed. Retrying..."
        });
      }

      throw error; 
    }
  }
}
