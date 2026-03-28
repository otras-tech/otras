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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CareerAIProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerAIProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const notification_gateway_1 = require("../../../common/notification.gateway");
let CareerAIProcessor = CareerAIProcessor_1 = class CareerAIProcessor extends bullmq_1.WorkerHost {
    notifications;
    logger = new common_1.Logger(CareerAIProcessor_1.name);
    constructor(notifications) {
        super();
        this.notifications = notifications;
    }
    async process(job) {
        const userId = job.data.userId;
        this.logger.log(`Processing job ${job.id} for userId: ${userId}`);
        const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000/api/v1";
        try {
            const response = await axios_1.default.post(`${aiServiceUrl}/career-ai`, job.data, { timeout: 120000 });
            this.logger.log(`Job ${job.id} completed successfully`);
            const roadmap = response.data.roadmap;
            if (userId) {
                this.notifications.sendToUser(userId, 'roadmap-completed', {
                    jobId: job.id,
                    roadmap: roadmap
                });
            }
            return roadmap;
        }
        catch (error) {
            this.logger.error(`Job ${job.id} failed: ${error.message}`);
            if (userId) {
                this.notifications.sendToUser(userId, 'roadmap-failed', {
                    jobId: job.id,
                    error: "AI generation failed. Retrying..."
                });
            }
            throw error;
        }
    }
};
exports.CareerAIProcessor = CareerAIProcessor;
exports.CareerAIProcessor = CareerAIProcessor = CareerAIProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('career-ai'),
    __metadata("design:paramtypes", [notification_gateway_1.NotificationGateway])
], CareerAIProcessor);
//# sourceMappingURL=career-ai.processor.js.map