"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReschedulerService", {
    enumerable: true,
    get: function() {
        return ReschedulerService;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ReschedulerService = class ReschedulerService {
    async storeMissedTask(userId, activity) {
        this.logger.log(`Storing missed task for user ${userId}: ${activity.description}`);
        const tasks = this.missedTasks.get(userId) || [];
        tasks.push(activity);
        this.missedTasks.set(userId, tasks);
    // In a real scenario, we'd use Redis here:
    // await this.redis.lpush(`missed_tasks:${userId}`, JSON.stringify(activity));
    }
    async getMissedTasks(userId) {
        return this.missedTasks.get(userId) || [];
    }
    async clearMissedTasks(userId) {
        this.missedTasks.delete(userId);
    }
    constructor(){
        this.logger = new _common.Logger(ReschedulerService.name);
        this.missedTasks = new Map(); // userId -> missedTasks[]
    }
};
ReschedulerService = _ts_decorate([
    (0, _common.Injectable)()
], ReschedulerService);

//# sourceMappingURL=rescheduler.service.js.map