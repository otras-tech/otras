import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StudyPlanRepository } from '../repository/study-plan.repository';
import { ReschedulerService } from './rescheduler.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
import { CacheService } from '../../../common/cache/cache.service';

@Injectable()
export class StudyPlanService {
  private readonly logger = new Logger(StudyPlanService.name);

  constructor(
    private readonly repository: StudyPlanRepository,
    private readonly rescheduler: ReschedulerService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {}

  async generate(requesterId: number, requesterRole: string, dto: CreateStudyPlanDto) {
    if (requesterId !== dto.userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Cannot generate study plan for another user');
    }

    try {
      this.logger.log(`Study Plan: Generating plan for ${dto.targetExam}`);

      const userExists = await this.repository.userExists(dto.userId);
      if (!userExists) {
        throw new NotFoundException(`User with ID ${dto.userId} not found.`);
      }

      const aiServiceUrl =
        this.configService.get('AI_SERVICE_URL') ||
        'http://localhost:8000/api/v1';
      const fullUrl = `${aiServiceUrl}/study-plan`;
      this.logger.log(`Calling AI Service at: ${fullUrl}`);

      try {
        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
          signal: AbortSignal.timeout(120000), // 120s timeout
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.logger.error(
            `AI Service Error [${response.status}]: ${errorText}`,
          );
          throw new InternalServerErrorException(
            `AI Service responded with ${response.status}: ${errorText}`,
          );
        }

        const aiData = await response.json();
        this.logger.log(
          `AI plan generated. Summary: ${aiData?.summary?.substring(0, 50)}...`,
        );
        return this.assignSequentialDates(aiData);
      } catch (e) {
        const err = e as Error;
        this.logger.error(`AI Service Connection Failed: ${err.message}`);
        if (err.message.includes('ECONNREFUSED')) {
          throw new InternalServerErrorException(
            `AI Service at ${fullUrl} is not reachable. Please ensure the AI service is running.`,
          );
        }
        throw new InternalServerErrorException(
          err.message || 'AI Service failed',
        );
      }
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException || error instanceof InternalServerErrorException) throw error;
      this.logger.error('FATAL: StudyPlan Service Error:', error);
      throw new BadRequestException(
        `Backend Error: ${(error as Error).message}`,
      );
    }
  }

  async save(
    requesterId: number,
    requesterRole: string,
    dto: CreateStudyPlanDto,
    aiData: Record<string, unknown> & { days?: unknown[] },
  ) {
    if (requesterId !== dto.userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Cannot save study plan for another user');
    }

    const processedData = this.assignSequentialDates(aiData);
    const days = (processedData.days as Record<string, unknown>[]) || [];

    const savedPlan = await this.repository.createPlanWithSchedule(dto, days);
    this.logger.log(`Study Plan: Plan saved for ${dto.targetExam}`);

    // Invalidate caches
    await this.cacheService.safeInvalidate([`study_plan_user:${dto.userId}`]);

    return savedPlan;
  }


  private assignSequentialDates(
    aiData: Record<string, unknown> & { days?: unknown[] },
  ) {
    if (!aiData || !aiData.days) return aiData;

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);

    const updatedDays = (aiData.days as Record<string, unknown>[]).map(
      (dayPlan, index) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);

        const dayName = currentDate.toLocaleDateString('en-US', {
          weekday: 'short',
        });

        return {
          ...dayPlan,
          date: currentDate,
          day: dayName,
        };
      },
    );

    return {
      ...aiData,
      days: updatedDays,
    };
  }

  async findByUserId(
    requesterId: number,
    requesterRole: string,
    userId: number,
  ) {
    if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    const cacheKey = `study_plan_user:${userId}`;
    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const plan = await this.repository.findByUserId(userId);
        if (plan) {
          await this.processMissedTasks(plan.id);
          // Re-fetch after processing missed tasks to ensure fresh state in cache
          return this.repository.findByUserId(userId);
        }
        return null;
      },
      600000, // 10 minutes cache
    );
  }

  async findOne(requesterId: number, requesterRole: string, id: string) {
    const plan = await this.repository.findById(id);
    if (!plan) throw new NotFoundException('Plan not found');

    if (
      requesterId !== plan.userId &&
      requesterRole.toUpperCase() !== 'ADMIN'
    ) {
      throw new ForbiddenException('Access denied');
    }

    await this.processMissedTasks(id);
    return this.repository.findById(id);
  }


  async updateActivityStatus(
    requesterId: number,
    requesterRole: string,
    activityId: string,
    userId: number,
    status: { completed?: boolean; missed?: boolean },
  ) {
    if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    this.logger.log(
      `Study Plan: Updating activity ${activityId} (completed: ${status.completed}, missed: ${status.missed})`,
    );

    let activity;
    try {
      activity = await this.repository.updateActivityStatus(activityId, {
        completed: status.completed,
        missed: status.missed,
      });
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === 'P2025') {
        throw new NotFoundException(`Activity with ID ${activityId} not found.`);
      }
      throw new InternalServerErrorException(`Failed to update activity: ${err.message}`);
    }

    if (status.missed) {
      const activityWithDay =
        await this.repository.findActivityWithDay(activityId);
      if (activityWithDay) {
        const day = (activityWithDay as any).day;
        await this.rescheduler.storeMissedTask(userId, {
          activityId: activityWithDay.id,
          description: activityWithDay.description,
          timeSlot: activityWithDay.timeSlot,
          date: day?.date?.toISOString() ?? '',
        });
        const planId = day?.planId;
        if (planId) {
          const plan = await this.repository.findById(planId);
          const days = (plan as any)?.days;
          if (plan && days && days.length > 0) {
            const lastDay = days[days.length - 1];
            await this.repository.relocateActivity(
              activityWithDay.id,
              lastDay.id,
            );
            this.logger.log(
              `Rescheduled: Relocated missed activity ${activityId} to last day`,
            );
          }
        }
      }
    }

    // Invalidate caches
    await this.cacheService.safeInvalidate([`study_plan_user:${userId}`]);

    return activity;
  }


  async processMissedTasks(planId: string) {
    const plan = await this.repository.findById(planId);
    if (!plan || !(plan as any).days || (plan as any).days.length === 0)
      return 0;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = (plan as any).days;
    const lastDay = days[days.length - 1];

    const activityIdsToRelocate: string[] = [];

    for (const day of days) {
      if (!day.date) continue;
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      if (dayDate < today) {
        for (const activity of day.activities) {
          if (!activity.completed && activity.dayId !== lastDay.id) {
            activityIdsToRelocate.push(activity.id);
          }
        }
      }
    }

    // 🔥 HIGH-SCALE OPTIMIZATION: BATCH RELOCATION
    // replaces O(N) DB calls with a single O(1) trip
    if (activityIdsToRelocate.length > 0) {
      await this.repository.relocateMultipleActivities(
        activityIdsToRelocate,
        lastDay.id,
      );
      this.logger.log(
        `Batch relocated ${activityIdsToRelocate.length} missed activities for Plan ${planId}`,
      );
    }
    return activityIdsToRelocate.length;
  }


  async simulateDayPassed(requesterId: number, requesterRole: string, planId: string) {
    const plan = await this.repository.findById(planId);
    if (!plan) throw new NotFoundException('Plan not found');

    if (requesterId !== plan.userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    const days = (plan as any).days;
    for (const day of days) {
      if (!day.date) continue;
      const newDate = new Date(new Date(day.date).getTime() - 24 * 60 * 60 * 1000);
      await this.repository.updateDayDate(day.id, newDate);
    }

    const movedCount = await this.processMissedTasks(planId);
    return { message: 'Simulation successful: Missed tasks relocated.', movedCount };
  }

  async delete(requesterId: number, requesterRole: string, id: string) {
    const plan = await this.repository.findById(id);
    if (!plan) throw new NotFoundException('Plan not found');

    if (requesterId !== plan.userId && requesterRole.toUpperCase() !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }
    return this.repository.delete(id);
  }
}
