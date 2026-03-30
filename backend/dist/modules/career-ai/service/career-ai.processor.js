"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CareerAIProcessor", {
    enumerable: true,
    get: function() {
        return CareerAIProcessor;
    }
});
const _bullmq = require("@nestjs/bullmq");
const _common = require("@nestjs/common");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _notificationgateway = require("../../../common/notification.gateway");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CareerAIProcessor = class CareerAIProcessor extends _bullmq.WorkerHost {
    async process(job) {
        const userId = job.data.userId;
        this.logger.log(`Processing job ${job.id} for userId: ${userId}`);
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1';
        try {
            // Simulate/Trigger AI processing
            const response = await _axios.default.post(`${aiServiceUrl}/career-ai`, job.data, {
                timeout: 120000
            });
            this.logger.log(`Job ${job.id} completed successfully`);
            const roadmap = response.data.roadmap;
            // Realtime Notification
            if (userId) {
                this.notifications.sendToUser(userId, 'roadmap-completed', {
                    jobId: job.id,
                    roadmap: roadmap
                });
            }
            return roadmap;
        } catch (error) {
            this.logger.error(`Job ${job.id} failed: ${error.message}`);
            if (userId) {
                this.notifications.sendToUser(userId, 'roadmap-failed', {
                    jobId: job.id,
                    error: 'AI generation failed. Retrying...'
                });
            }
            throw error;
        }
    }
    constructor(notifications){
        super(), this.notifications = notifications, this.logger = new _common.Logger(CareerAIProcessor.name);
    }
};
CareerAIProcessor = _ts_decorate([
    (0, _bullmq.Processor)('career-ai'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _notificationgateway.NotificationGateway === "undefined" ? Object : _notificationgateway.NotificationGateway
    ])
], CareerAIProcessor);

//# sourceMappingURL=career-ai.processor.js.map