import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ActivityStatusUpdate } from '../../../common/types/types';

interface MissedTask {
  activityId: string;
  description: string;
  timeSlot: string;
  date: string;
}

@Injectable()
export class ReschedulerService {
  private missedTasks = new Map<number, MissedTask[]>(); // userId -> missedTasks[]

  async storeMissedTask(userId: number, activity: MissedTask) {
    const tasks = this.missedTasks.get(userId) || [];
    tasks.push(activity);
    this.missedTasks.set(userId, tasks);
    // In a real scenario, we'd use Redis here:
    // await this.redis.lpush(`missed_tasks:${userId}`, JSON.stringify(activity));
  }

  async getMissedTasks(userId: number): Promise<MissedTask[]> {
    return this.missedTasks.get(userId) || [];
  }

  async clearMissedTasks(userId: number): Promise<void> {
    this.missedTasks.delete(userId);
  }
}
