import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';

@Injectable()
export class StudyPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async userExists(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return !!user;
  }

  async createWithSchedule(data: CreateStudyPlanDto, days: any[]) {
    return this.prisma.studyPlan.create({
      data: {
        userId: data.userId,
        examId: data.examId,
        targetExam: data.targetExam,
        examDate: new Date(data.examDate),
        tier1Score: data.tier1Score,
        tier2Score: data.tier2Score,
        currentLevel: data.currentLevel,
        weakAreas: data.weakAreas,
        dailyStudyHours: data.dailyStudyHours,
        mockFrequency: data.mockFrequency,
        revisionStrategy: data.revisionStrategy,
        preferredStudyTimes: data.preferredStudyTimes,
        days: {
          create: days.map((dayPlan) => {
            const date = new Date(dayPlan.date);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
            return {
              day: dayName,
              date: date,
              activities: {
              create: dayPlan.activities.map((activity) => ({
                timeSlot: activity.timeSlot,
                description: activity.description,
                focusArea: activity.focusArea,
              })),
            },
          };
        }),
        },
      },
      include: {
        days: {
          include: {
            activities: {
              orderBy: { timeSlot: 'asc' }
            },
          },
          orderBy: { date: 'asc' }
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.studyPlan.findMany({
      where: { userId },
      include: {
        days: {
          include: {
            activities: {
              orderBy: { timeSlot: 'asc' }
            },
          },
          orderBy: { date: 'asc' }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.studyPlan.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            activities: {
              orderBy: { timeSlot: 'asc' }
            },
          },
          orderBy: { date: 'asc' }
        },
      },
    });
  }

  async updateActivityStatus(activityId: string, data: any) {
    return this.prisma.studyActivity.update({
      where: { id: activityId },
      data,
      include: { day: true }
    });
  }

  async relocateActivity(activityId: string, targetDayId: string) {
    return this.prisma.studyActivity.update({
      where: { id: activityId },
      data: {
        dayId: targetDayId,
        missed: true,
      },
    });
  }


  async updateDayDate(dayId: string, date: Date) {
    return this.prisma.studyPlanDay.update({
      where: { id: dayId },
      data: { date },
    });
  }

  async createActivity(dayId: string, data: { timeSlot: string; description: string; focusArea?: string }) {
    return this.prisma.studyActivity.create({
      data: {
        dayId,
        ...data,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.studyPlan.delete({ where: { id } });
  }
}
