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
const prisma_service_1 = require("../../../prisma/prisma.service");
let StudyPlanRepository = class StudyPlanRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async userExists(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return !!user;
    }
    async createWithSchedule(data, days) {
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
    async findByUserId(userId) {
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
    async findById(id) {
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
    async updateActivityStatus(activityId, data) {
        return this.prisma.studyActivity.update({
            where: { id: activityId },
            data,
            include: { day: true }
        });
    }
    async relocateActivity(activityId, targetDayId) {
        return this.prisma.studyActivity.update({
            where: { id: activityId },
            data: {
                dayId: targetDayId,
                missed: true,
            },
        });
    }
    async updateDayDate(dayId, date) {
        return this.prisma.studyPlanDay.update({
            where: { id: dayId },
            data: { date },
        });
    }
    async createActivity(dayId, data) {
        return this.prisma.studyActivity.create({
            data: {
                dayId,
                ...data,
            },
        });
    }
    async delete(id) {
        return this.prisma.studyPlan.delete({ where: { id } });
    }
};
exports.StudyPlanRepository = StudyPlanRepository;
exports.StudyPlanRepository = StudyPlanRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudyPlanRepository);
//# sourceMappingURL=study-plan.repository.js.map