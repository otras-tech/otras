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
var StudyPlanService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanService = void 0;
const common_1 = require("@nestjs/common");
const study_plan_repository_1 = require("../repository/study-plan.repository");
const rescheduler_service_1 = require("./rescheduler.service");
let StudyPlanService = StudyPlanService_1 = class StudyPlanService {
    repository;
    rescheduler;
    logger = new common_1.Logger(StudyPlanService_1.name);
    constructor(repository, rescheduler) {
        this.repository = repository;
        this.rescheduler = rescheduler;
    }
    async generate(dto) {
        try {
            this.logger.log(`Study Plan: Generating plan for ${dto.targetExam}`);
            console.log(`Checking existence for User ID: ${dto.userId}`);
            const userExists = await this.repository.userExists(dto.userId);
            console.log(`User exists: ${userExists}`);
            if (!userExists) {
                throw new common_1.NotFoundException(`User with ID ${dto.userId} not found.`);
            }
            const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1';
            const fullUrl = `${aiServiceUrl}/study-plan`;
            this.logger.log(`Calling AI Service at: ${fullUrl}`);
            try {
                const response = await fetch(fullUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dto),
                    signal: AbortSignal.timeout(120000),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    this.logger.error(`AI Service Error [${response.status}]: ${errorText}`);
                    throw new common_1.InternalServerErrorException(`AI Service responded with ${response.status}: ${errorText}`);
                }
                const aiData = await response.json();
                console.log(`Backend: AI plan generated. Summary: ${aiData?.summary?.substring(0, 50)}...`);
                return this.assignSequentialDates(aiData);
            }
            catch (e) {
                this.logger.error(`AI Service Connection Failed: ${e.message}`);
                if (e.message.includes('ECONNREFUSED')) {
                    throw new common_1.InternalServerErrorException(`AI Service at ${fullUrl} is not reachable. Please ensure the AI service is running.`);
                }
                throw new common_1.InternalServerErrorException(e.message || 'AI Service failed');
            }
        }
        catch (error) {
            this.logger.error("FATAL: StudyPlan Service Error:", error);
            if (error instanceof common_1.InternalServerErrorException)
                throw error;
            throw new common_1.BadRequestException(`Backend Error: ${error.message}`);
        }
    }
    async save(dto, aiData) {
        const processedData = this.assignSequentialDates(aiData);
        const { days } = processedData;
        const savedPlan = await this.repository.createWithSchedule(dto, days);
        this.logger.log(`Study Plan: Plan saved for ${dto.targetExam}`);
        return savedPlan;
    }
    assignSequentialDates(aiData) {
        if (!aiData || !aiData.days)
            return aiData;
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
    async findByUserId(userId) {
        const plans = await this.repository.findByUserId(userId);
        for (const plan of plans) {
            await this.processMissedTasks(plan.id);
        }
        return this.repository.findByUserId(userId);
    }
    async findOne(id) {
        await this.processMissedTasks(id);
        return this.repository.findById(id);
    }
    async updateActivityStatus(activityId, userId, status) {
        this.logger.log(`Study Plan: Updating activity ${activityId} status (completed: ${status.completed}, missed: ${status.missed}) for user ${userId}`);
        let activity;
        try {
            activity = await this.repository.updateActivityStatus(activityId, {
                completed: status.completed,
                missed: status.missed
            });
        }
        catch (e) {
            this.logger.error(`Failed to update activity ${activityId}: ${e.message}`);
            if (e.code === 'P2025') {
                throw new common_1.NotFoundException(`Activity with ID ${activityId} not found.`);
            }
            throw new common_1.InternalServerErrorException(`Failed to update activity: ${e.message}`);
        }
        if (status.completed) {
            this.logger.log(`Study Plan: Task completed - ${activity.description}`);
        }
        if (status.missed) {
            await this.rescheduler.storeMissedTask(userId, activity);
            const planId = activity.day?.planId;
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
    async processMissedTasks(planId) {
        const plan = (await this.repository.findById(planId));
        if (!plan || !plan.days || plan.days.length === 0)
            return 0;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.logger.log(`AUTO-SCHEDULER: Checking missed tasks for plan ${planId}. Today: ${today.toLocaleDateString()}`);
        const lastDay = plan.days[plan.days.length - 1];
        let movedCount = 0;
        for (const day of plan.days) {
            if (!day.date)
                continue;
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0);
            if (dayDate < today) {
                for (const activity of day.activities) {
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
    async moveToNextDay(planId) {
        const movedCount = await this.processMissedTasks(planId);
        return { message: 'Missed tasks processed', movedCount };
    }
    async moveMissedTasks(planId) {
        const plan = (await this.repository.findById(planId));
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        for (const day of plan.days) {
            if (!day.date)
                continue;
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
    async simulateDayPassed(planId) {
        return this.moveMissedTasks(planId);
    }
    async viewPlan(id) {
        return this.repository.findById(id);
    }
    async delete(id) {
        return this.repository.delete(id);
    }
};
exports.StudyPlanService = StudyPlanService;
exports.StudyPlanService = StudyPlanService = StudyPlanService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [study_plan_repository_1.StudyPlanRepository,
        rescheduler_service_1.ReschedulerService])
], StudyPlanService);
//# sourceMappingURL=study-plan.service.js.map