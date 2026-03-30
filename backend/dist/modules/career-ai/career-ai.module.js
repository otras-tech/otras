"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CareerAIModule", {
    enumerable: true,
    get: function() {
        return CareerAIModule;
    }
});
const _common = require("@nestjs/common");
const _bullmq = require("@nestjs/bullmq");
const _careeraicontroller = require("./controller/career-ai.controller");
const _careeraiservice = require("./service/career-ai.service");
const _careeraiprocessor = require("./service/career-ai.processor");
const _notificationgateway = require("../../common/notification.gateway");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CareerAIModule = class CareerAIModule {
};
CareerAIModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _bullmq.BullModule.registerQueue({
                name: 'career-ai'
            })
        ],
        controllers: [
            _careeraicontroller.CareerAIController
        ],
        providers: [
            _careeraiservice.CareerAIService,
            _careeraiprocessor.CareerAIProcessor,
            _notificationgateway.NotificationGateway
        ],
        exports: [
            _careeraiservice.CareerAIService
        ]
    })
], CareerAIModule);

//# sourceMappingURL=career-ai.module.js.map