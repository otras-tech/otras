import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import {
  StudyPlanDayInput,
  ActivityStatusUpdate,
} from '../../../common/types/types';
import { CreateStudyPlanDto } from '../dto/create-study-plan.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudyPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async userExists(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
      select: { id: true },
    });
    return !!user;
  }

  async createPlanWithSchedule(dto: CreateStudyPlanDto, days: any[]) {
    const data: Prisma.StudyPlanCreateInput = {
      user: { connect: { id: dto.userId } },
      targetExam: dto.targetExam,
      examDate: new Date(dto.examDate),
      tier1Score: dto.tier1Score,
      tier2Score: dto.tier2Score,
      currentLevel: dto.currentLevel,
      weakAreas: dto.weakAreas,
      dailyStudyHours: dto.dailyStudyHours,
      mockFrequency: dto.mockFrequency,
      revisionStrategy: dto.revisionStrategy,
      preferredStudyTimes: dto.preferredStudyTimes,
      days: {
        create: (days as StudyPlanDayInput[]).map((day) => ({
          date: day.date ? new Date(day.date) : null,
          day:
            day.day ??
            (day.date
              ? new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                })
              : ''),
          activities: {
            create: day.activities.map((act) => ({
              timeSlot: act.timeSlot,
              description: act.description,
              focusArea: act.focusArea,
            })),
          },
        })),
      },
    };

    if (dto.examId) {
      data.exam = { connect: { id: dto.examId } };
    }

    return this.prisma.studyPlan.create({
      data,
      include: {
        days: { include: { activities: true } },
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.studyPlan.findFirst({
      where: { userId, isDeleted: false },
      include: {
        days: {
          where: { isDeleted: false },
          include: { activities: { where: { isDeleted: false } } },
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.studyPlan.findFirst({
      where: { id, isDeleted: false },
      include: {
        days: {
          where: { isDeleted: false },
          include: { activities: { where: { isDeleted: false } } },
          orderBy: { date: 'asc' },
        },
      },
    });
  }

  async findActivityWithDay(activityId: string) {
    return this.prisma.studyActivity.findFirst({
      where: { id: activityId, isDeleted: false },
      include: { day: { select: { id: true, planId: true, date: true } } },
    });
  }

  async updateActivityStatus(activityId: string, data: ActivityStatusUpdate) {
    const updateData: Prisma.StudyActivityUpdateInput = {};
    if (data.completed !== undefined) updateData.completed = data.completed;
    if (data.missed !== undefined) updateData.missed = data.missed;

    return this.prisma.studyActivity.update({
      where: { id: activityId },
      data: updateData,
      include: { day: { select: { id: true, planId: true, date: true } } },
    });
  }

  async relocateActivity(activityId: string, targetDayId: string) {
    return this.prisma.studyActivity.update({
      where: { id: activityId },
      data: { dayId: targetDayId },
    });
  }

  async updateDayDate(dayId: string, newDate: Date) {
    return this.prisma.studyPlanDay.update({
      where: { id: dayId },
      data: { date: newDate },
    });
  }

  async deleteByUserId(userId: number) {
    return this.prisma.studyPlan.updateMany({
      where: { userId },
      data: { isDeleted: true },
    });
  }

  async delete(id: string) {
    return this.prisma.studyPlan.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
