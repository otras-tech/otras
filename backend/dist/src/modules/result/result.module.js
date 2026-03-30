"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultModule = void 0;
const common_1 = require("@nestjs/common");
const result_service_1 = require("./result.service");
const result_controller_1 = require("./result.controller");
const user_module_1 = require("../user/user.module");
const bullmq_1 = require("@nestjs/bullmq");
const result_processor_1 = require("./result.processor");
const bullmq_2 = require("@nestjs/bullmq");
let ResultModule = class ResultModule {
};
exports.ResultModule = ResultModule;
exports.ResultModule = ResultModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            ...(process.env.DISABLE_REDIS === 'true'
                ? []
                : [
                    bullmq_1.BullModule.registerQueue({
                        name: 'result-calculation',
                    }),
                ]),
        ],
        providers: [
            result_service_1.ResultService,
            result_processor_1.ResultProcessor,
            ...(process.env.DISABLE_REDIS === 'true'
                ? [
                    {
                        provide: (0, bullmq_2.getQueueToken)('result-calculation'),
                        useValue: { add: async () => ({ id: 'fake-job-id' }) },
                    },
                ]
                : []),
        ],
        controllers: [result_controller_1.ResultController],
        exports: [result_service_1.ResultService],
    })
], ResultModule);
//# sourceMappingURL=result.module.js.map