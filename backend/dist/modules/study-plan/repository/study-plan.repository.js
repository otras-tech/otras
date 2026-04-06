"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let StudyPlanRepository = class StudyPlanRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async userExists(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, isDeleted: false },
            select: { id: true },
        });
        return !!user;
    }
    async createPlanWithSchedule(dto, days) {
        const data = {
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
                create: days.map((day) => ({
                    date: day.date ? new Date(day.date) : null,
                    day: day.day ??
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
    async findByUserId(userId) {
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
    async findById(id) {
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
    async findActivityWithDay(activityId) {
        return this.prisma.studyActivity.findFirst({
            where: { id: activityId, isDeleted: false },
            include: { day: { select: { id: true, planId: true, date: true } } },
        });
    }
    async updateActivityStatus(activityId, data) {
        const updateData = {};
        if (data.completed !== undefined)
            updateData.completed = data.completed;
        if (data.missed !== undefined)
            updateData.missed = data.missed;
        return this.prisma.studyActivity.update({
            where: { id: activityId },
            data: updateData,
            include: { day: { select: { id: true, planId: true, date: true } } },
        });
    }
    async relocateActivity(activityId, targetDayId) {
        return this.prisma.studyActivity.update({
            where: { id: activityId },
            data: { dayId: targetDayId },
        });
    }
    async relocateMultipleActivities(activityIds, targetDayId) {
        return this.prisma.studyActivity.updateMany({
            where: { id: { in: activityIds } },
            data: { dayId: targetDayId },
        });
    }
    async updateDayDate(dayId, newDate) {
        return this.prisma.studyPlanDay.update({
            where: { id: dayId },
            data: { date: newDate },
        });
    }
    async deleteByUserId(userId) {
        return this.prisma.studyPlan.updateMany({
            where: { userId },
            data: { isDeleted: true },
        });
    }
    async delete(id) {
        return this.prisma.studyPlan.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
};
exports.StudyPlanRepository = StudyPlanRepository;
exports.StudyPlanRepository = StudyPlanRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudyPlanRepository);
//# sourceMappingURL=study-plan.repository.js.map