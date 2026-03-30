"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const ai_controller_1 = require("./ai.controller");
const ai_service_1 = require("./ai.service");
const openai_provider_1 = require("./providers/openai.provider");
const bullmq_1 = require("@nestjs/bullmq");
const prisma_module_1 = require("../../database/prisma.module");
const config_1 = require("@nestjs/config");
const ai_processor_1 = require("./processor/ai.processor");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            config_1.ConfigModule,
            ...(process.env.DISABLE_REDIS === 'true'
                ? []
                : [
                    bullmq_1.BullModule.registerQueue({
                        name: 'career-ai'
                    }),
                ]),
        ],
        controllers: [ai_controller_1.AiController],
        providers: [
            ai_service_1.AiService,
            openai_provider_1.OpenAiProvider,
            ai_processor_1.AiProcessor,
            ...(process.env.DISABLE_REDIS === 'true'
                ? [
                    {
                        provide: 'BullQueue_career-ai',
                        useValue: { add: async () => ({ id: 'fake-ai-job-id' }) },
                    },
                ]
                : []),
        ],
        exports: [ai_service_1.AiService]
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map