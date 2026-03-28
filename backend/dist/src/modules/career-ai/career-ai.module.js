"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerAIModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const career_ai_controller_1 = require("./controller/career-ai.controller");
const career_ai_service_1 = require("./service/career-ai.service");
const career_ai_processor_1 = require("./service/career-ai.processor");
const notification_gateway_1 = require("../../common/notification.gateway");
let CareerAIModule = class CareerAIModule {
};
exports.CareerAIModule = CareerAIModule;
exports.CareerAIModule = CareerAIModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'career-ai',
            }),
        ],
        controllers: [career_ai_controller_1.CareerAIController],
        providers: [career_ai_service_1.CareerAIService, career_ai_processor_1.CareerAIProcessor, notification_gateway_1.NotificationGateway],
        exports: [career_ai_service_1.CareerAIService],
    })
], CareerAIModule);
//# sourceMappingURL=career-ai.module.js.map