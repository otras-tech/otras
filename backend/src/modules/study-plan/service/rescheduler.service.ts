import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReschedulerService {
  private readonly logger = new Logger(ReschedulerService.name);
  private missedTasks = new Map<number, any[]>(); // userId -> missedTasks[]

  async storeMissedTask(userId: number, activity: any) {
    this.logger.log(`Storing missed task for user ${userId}: ${activity.description}`);
    const tasks = this.missedTasks.get(userId) || [];
    tasks.push(activity);
    this.missedTasks.set(userId, tasks);
    
    // In a real scenario, we'd use Redis here:
    // await this.redis.lpush(`missed_tasks:${userId}`, JSON.stringify(activity));
  }

  async getMissedTasks(userId: number) {
    return this.missedTasks.get(userId) || [];
  }

  async clearMissedTasks(userId: number) {
    this.missedTasks.delete(userId);
  }
}
