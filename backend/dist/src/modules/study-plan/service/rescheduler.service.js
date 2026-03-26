"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReschedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReschedulerService = void 0;
const common_1 = require("@nestjs/common");
let ReschedulerService = ReschedulerService_1 = class ReschedulerService {
    logger = new common_1.Logger(ReschedulerService_1.name);
    missedTasks = new Map();
    async storeMissedTask(userId, activity) {
        this.logger.log(`Storing missed task for user ${userId}: ${activity.description}`);
        const tasks = this.missedTasks.get(userId) || [];
        tasks.push(activity);
        this.missedTasks.set(userId, tasks);
    }
    async getMissedTasks(userId) {
        return this.missedTasks.get(userId) || [];
    }
    async clearMissedTasks(userId) {
        this.missedTasks.delete(userId);
    }
};
exports.ReschedulerService = ReschedulerService;
exports.ReschedulerService = ReschedulerService = ReschedulerService_1 = __decorate([
    (0, common_1.Injectable)()
], ReschedulerService);
//# sourceMappingURL=rescheduler.service.js.map