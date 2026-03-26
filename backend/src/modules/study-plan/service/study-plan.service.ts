import { Injectable, Logger, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { StudyPlanRepository } from '../repository/study-plan.repository';
import { ReschedulerService } from './rescheduler.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';

interface StudyActivity {
  id: string;
  timeSlot: string;
  description: string;
  focusArea: string | null;
  completed: boolean;
  missed: boolean;
  dayId: string;
}

interface StudyPlanDay {
  id: string;
  day: string;
  date: Date | null;
  activities: StudyActivity[];
}

interface StudyPlan {
  id: string;
  days: StudyPlanDay[];
}

@Injectable()
export class StudyPlanService {
  private readonly logger = new Logger(StudyPlanService.name);

  constructor(
    private readonly repository: StudyPlanRepository,
    private readonly rescheduler: ReschedulerService,
  ) {}

  async generate(dto: CreateStudyPlanDto) {
    try {
      this.logger.log(`Study Plan: Generating plan for ${dto.targetExam}`);
      
      console.log(`Checking existence for User ID: ${dto.userId}`);
      const userExists = await this.repository.userExists(dto.userId);
      console.log(`User exists: ${userExists}`);
      if (!userExists) {
        throw new NotFoundException(`User with ID ${dto.userId} not found.`);
      }
      
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1';
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
          this.logger.error(`AI Service Error [${response.status}]: ${errorText}`);
          throw new InternalServerErrorException(`AI Service responded with ${response.status}: ${errorText}`);
        }

        const aiData = await response.json();
        console.log(`Backend: AI plan generated. Summary: ${aiData?.summary?.substring(0, 50)}...`);
        return this.assignSequentialDates(aiData);
      } catch (e) {
        this.logger.error(`AI Service Connection Failed: ${e.message}`);
        if (e.message.includes('ECONNREFUSED')) {
           throw new InternalServerErrorException(`AI Service at ${fullUrl} is not reachable. Please ensure the AI service is running.`);
        }
        throw new InternalServerErrorException(e.message || 'AI Service failed');
      }
    } catch (error) {
      this.logger.error("FATAL: StudyPlan Service Error:", error);
      if (error instanceof InternalServerErrorException) throw error;
      throw new BadRequestException(`Backend Error: ${error.message}`);
    }
  }

  async save(dto: CreateStudyPlanDto, aiData: any) {
    const processedData = this.assignSequentialDates(aiData);
    const { days } = processedData;
    
    const savedPlan = await this.repository.createWithSchedule(dto, days);
    this.logger.log(`Study Plan: Plan saved for ${dto.targetExam}`);
    return savedPlan;
  }

  private assignSequentialDates(aiData: any) {
    if (!aiData || !aiData.days) return aiData;

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);

    this.logger.log(`TODAY: ${today.toISOString()}`);
    this.logger.log(`START DATE (TOMORROW): ${startDate.toISOString()}`);

    const updatedDays = aiData.days.map((dayPlan, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);
      
      const dayName = currentDate.toLocaleDateString("en-US", { weekday: "short" });
      
      this.logger.log(`GENERATED DATE for Day ${index + 1}: ${currentDate.toISOString()}`);
      this.logger.log(`DAY NAME for Day ${index + 1}: ${dayName}`);
      
      return {
        ...dayPlan,
        date: currentDate,
        day: dayName
      };
    });

    return {
      ...aiData,
      days: updatedDays
    };
  }

  async findByUserId(userId: number) {
    const plans = await this.repository.findByUserId(userId);
    // Process missed tasks for all active plans
    for (const plan of plans) {
      await this.processMissedTasks(plan.id);
    }
    return this.repository.findByUserId(userId); // Re-fetch after processing
  }

  async findOne(id: string) {
    await this.processMissedTasks(id);
    return this.repository.findById(id);
  }


  async updateActivityStatus(activityId: string, userId: number, status: { completed?: boolean; missed?: boolean }) {
    this.logger.log(`Study Plan: Updating activity ${activityId} status (completed: ${status.completed}, missed: ${status.missed}) for user ${userId}`);
    let activity;
    try {
      activity = await this.repository.updateActivityStatus(activityId, { 
        completed: status.completed, 
        missed: status.missed 
      });
    } catch (e) {
      this.logger.error(`Failed to update activity ${activityId}: ${e.message}`);
      if (e.code === 'P2025') {
        throw new NotFoundException(`Activity with ID ${activityId} not found.`);
      }
      throw new InternalServerErrorException(`Failed to update activity: ${e.message}`);
    }

    if (status.completed) {
      this.logger.log(`Study Plan: Task completed - ${activity.description}`);
    }
    
    if (status.missed) {
      await this.rescheduler.storeMissedTask(userId, activity);
      // Determine which plan this activity belongs to
      const planId = (activity as any).day?.planId;
      if (planId) {
        const plan = await this.repository.findById(planId);
        if (plan && plan.days && plan.days.length > 0) {
          const lastDay = plan.days[plan.days.length - 1];
          await this.repository.relocateActivity(activity.id, lastDay.id);
          this.logger.log(`MANUAL RESCHEDULER: Relocated activity ${activityId} to last day [${lastDay.id}]`);
        }
      }
    }
    return activity;
  }

  async processMissedTasks(planId: string) {
    const plan = (await this.repository.findById(planId)) as any;
    if (!plan || !plan.days || plan.days.length === 0) return 0;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    this.logger.log(`AUTO-SCHEDULER: Checking missed tasks for plan ${planId}. Today: ${today.toLocaleDateString()}`);

    const lastDay = plan.days[plan.days.length - 1];
    let movedCount = 0;

    for (const day of plan.days) {
      if (!day.date) continue;
      
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      if (dayDate < today) {
        for (const activity of day.activities) {
          // If not completed and not already on the last day, move it
          if (!activity.completed && activity.dayId !== lastDay.id) {
            this.logger.log(`RELOCATING MISSED TASK: [${activity.id}] "${activity.description}" from ${dayDate.toLocaleDateString()} to FINAL DAY of schedule.`);
            await this.repository.relocateActivity(activity.id, lastDay.id);
            movedCount++;
          }
        }
      }
    }

    if (movedCount > 0) {
        this.logger.log(`AUTO-SCHEDULER: Relocated ${movedCount} tasks for plan ${planId}.`);
    }

    return movedCount;
  }

  async moveToNextDay(planId: string) {
    const movedCount = await this.processMissedTasks(planId);
    return { message: 'Missed tasks processed', movedCount };
  }

  async moveMissedTasks(planId: string) {
    const plan = (await this.repository.findById(planId)) as any;
    if (!plan) throw new NotFoundException('Plan not found');

    // Simulate time passing by shifting dates back
    for (const day of plan.days) {
      if (!day.date) continue;
      const originalDate = new Date(day.date);
      const newDate = new Date(originalDate.getTime() - (24 * 60 * 60 * 1000));
      await this.repository.updateDayDate(day.id, newDate);
    }

    const movedCount = await this.processMissedTasks(planId);
    return { 
      message: 'Simulation successful: Dates shifted and missed tasks relocated.', 
      movedCount 
    };
  }

  async simulateDayPassed(planId: string) {
    return this.moveMissedTasks(planId);
  }

  private async viewPlan(id: string) {
    return this.repository.findById(id);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}