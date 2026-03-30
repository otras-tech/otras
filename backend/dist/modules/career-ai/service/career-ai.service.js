"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CareerAIService", {
    enumerable: true,
    get: function() {
        return CareerAIService;
    }
});
const _common = require("@nestjs/common");
const _bullmq = require("@nestjs/bullmq");
const _bullmq1 = require("bullmq");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let CareerAIService = class CareerAIService {
    async generateRoadmap(dto) {
        this.logger.log(`CareerAI: Enqueuing Roadmap Generation Job for User ${dto.userId}`);
        // Push the logic to a background job
        const job = await this.careerAIQueue.add('generate-roadmap', dto, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000
            },
            removeOnComplete: true,
            removeOnFail: false
        });
        this.logger.log(`CareerAI: Job ${job.id} created successfully`);
        // Return early with the Job ID so the UI can poll/wait without timing out
        return {
            jobId: job.id,
            message: 'AI Roadmap generation started as a background process. Please check back in a few moments.'
        };
    }
    async getJobStatus(jobId) {
        const job = await this.careerAIQueue.getJob(jobId);
        if (!job) return {
            status: 'not_found'
        };
        const status = await job.getState();
        return {
            id: job.id,
            status: status,
            result: job.returnvalue,
            progress: job.progress,
            failedReason: job.failedReason
        };
    }
    constructor(careerAIQueue){
        this.careerAIQueue = careerAIQueue;
        this.logger = new _common.Logger(CareerAIService.name);
    }
};
CareerAIService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _bullmq.InjectQueue)('career-ai')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _bullmq1.Queue === "undefined" ? Object : _bullmq1.Queue
    ])
], CareerAIService);

//# sourceMappingURL=career-ai.service.js.map