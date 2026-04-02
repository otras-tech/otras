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
const config_1 = require("@nestjs/config");
const study_plan_repository_1 = require("../repository/study-plan.repository");
const rescheduler_service_1 = require("./rescheduler.service");
let StudyPlanService = StudyPlanService_1 = class StudyPlanService {
    repository;
    rescheduler;
    configService;
    logger = new common_1.Logger(StudyPlanService_1.name);
    constructor(repository, rescheduler, configService) {
        this.repository = repository;
        this.rescheduler = rescheduler;
        this.configService = configService;
    }
    async generate(requesterId, requesterRole, dto) {
        if (requesterId !== dto.userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Cannot generate study plan for another user');
        }
        try {
            this.logger.log(`Study Plan: Generating plan for ${dto.targetExam}`);
            const userExists = await this.repository.userExists(dto.userId);
            if (!userExists) {
                throw new common_1.NotFoundException(`User with ID ${dto.userId} not found.`);
            }
            const aiServiceUrl = this.configService.get('AI_SERVICE_URL') ||
                'http://localhost:8000/api/v1';
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
                this.logger.log(`AI plan generated. Summary: ${aiData?.summary?.substring(0, 50)}...`);
                return this.assignSequentialDates(aiData);
            }
            catch (e) {
                const err = e;
                this.logger.error(`AI Service Connection Failed: ${err.message}`);
                if (err.message.includes('ECONNREFUSED')) {
                    throw new common_1.InternalServerErrorException(`AI Service at ${fullUrl} is not reachable. Please ensure the AI service is running.`);
                }
                throw new common_1.InternalServerErrorException(err.message || 'AI Service failed');
            }
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException || error instanceof common_1.InternalServerErrorException)
                throw error;
            this.logger.error('FATAL: StudyPlan Service Error:', error);
            throw new common_1.BadRequestException(`Backend Error: ${error.message}`);
        }
    }
    async save(requesterId, requesterRole, dto, aiData) {
        if (requesterId !== dto.userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Cannot save study plan for another user');
        }
        const processedData = this.assignSequentialDates(aiData);
        const days = processedData.days || [];
        const savedPlan = await this.repository.createPlanWithSchedule(dto, days);
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
        const updatedDays = aiData.days.map((dayPlan, index) => {
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
        });
        return {
            ...aiData,
            days: updatedDays,
        };
    }
    async findByUserId(requesterId, requesterRole, userId) {
        if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        const plan = await this.repository.findByUserId(userId);
        if (plan) {
            await this.processMissedTasks(plan.id);
        }
        return this.repository.findByUserId(userId);
    }
    async findOne(requesterId, requesterRole, id) {
        const plan = await this.repository.findById(id);
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        if (requesterId !== plan.userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.processMissedTasks(id);
        return this.repository.findById(id);
    }
    async updateActivityStatus(requesterId, requesterRole, activityId, userId, status) {
        if (requesterId !== userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        this.logger.log(`Study Plan: Updating activity ${activityId} (completed: ${status.completed}, missed: ${status.missed})`);
        let activity;
        try {
            activity = await this.repository.updateActivityStatus(activityId, {
                completed: status.completed,
                missed: status.missed,
            });
        }
        catch (e) {
            const err = e;
            if (err.code === 'P2025') {
                throw new common_1.NotFoundException(`Activity with ID ${activityId} not found.`);
            }
            throw new common_1.InternalServerErrorException(`Failed to update activity: ${err.message}`);
        }
        if (status.missed) {
            const activityWithDay = await this.repository.findActivityWithDay(activityId);
            if (activityWithDay) {
                const day = activityWithDay.day;
                await this.rescheduler.storeMissedTask(userId, {
                    activityId: activityWithDay.id,
                    description: activityWithDay.description,
                    timeSlot: activityWithDay.timeSlot,
                    date: day?.date?.toISOString() ?? '',
                });
                const planId = day?.planId;
                if (planId) {
                    const plan = await this.repository.findById(planId);
                    const days = plan?.days;
                    if (plan && days && days.length > 0) {
                        const lastDay = days[days.length - 1];
                        await this.repository.relocateActivity(activityWithDay.id, lastDay.id);
                        this.logger.log(`Rescheduled: Relocated missed activity ${activityId} to last day`);
                    }
                }
            }
        }
        return activity;
    }
    async processMissedTasks(planId) {
        const plan = await this.repository.findById(planId);
        if (!plan || !plan.days || plan.days.length === 0)
            return 0;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const days = plan.days;
        const lastDay = days[days.length - 1];
        let movedCount = 0;
        for (const day of days) {
            if (!day.date)
                continue;
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0);
            if (dayDate < today) {
                for (const activity of day.activities) {
                    if (!activity.completed && activity.dayId !== lastDay.id) {
                        await this.repository.relocateActivity(activity.id, lastDay.id);
                        movedCount++;
                    }
                }
            }
        }
        return movedCount;
    }
    async simulateDayPassed(requesterId, requesterRole, planId) {
        const plan = await this.repository.findById(planId);
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        if (requesterId !== plan.userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        const days = plan.days;
        for (const day of days) {
            if (!day.date)
                continue;
            const newDate = new Date(new Date(day.date).getTime() - 24 * 60 * 60 * 1000);
            await this.repository.updateDayDate(day.id, newDate);
        }
        const movedCount = await this.processMissedTasks(planId);
        return { message: 'Simulation successful: Missed tasks relocated.', movedCount };
    }
    async delete(requesterId, requesterRole, id) {
        const plan = await this.repository.findById(id);
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        if (requesterId !== plan.userId && requesterRole.toUpperCase() !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.repository.delete(id);
    }
};
exports.StudyPlanService = StudyPlanService;
exports.StudyPlanService = StudyPlanService = StudyPlanService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [study_plan_repository_1.StudyPlanRepository,
        rescheduler_service_1.ReschedulerService,
        config_1.ConfigService])
], StudyPlanService);
//# sourceMappingURL=study-plan.service.js.map