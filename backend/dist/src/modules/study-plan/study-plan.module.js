"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanModule = void 0;
const common_1 = require("@nestjs/common");
const study_plan_controller_1 = require("./controller/study-plan.controller");
const study_plan_service_1 = require("./service/study-plan.service");
const study_plan_repository_1 = require("./repository/study-plan.repository");
const rescheduler_service_1 = require("./service/rescheduler.service");
const prisma_module_1 = require("../../prisma/prisma.module");
let StudyPlanModule = class StudyPlanModule {
};
exports.StudyPlanModule = StudyPlanModule;
exports.StudyPlanModule = StudyPlanModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [study_plan_controller_1.StudyPlanController],
        providers: [study_plan_service_1.StudyPlanService, study_plan_repository_1.StudyPlanRepository, rescheduler_service_1.ReschedulerService],
        exports: [study_plan_service_1.StudyPlanService],
    })
], StudyPlanModule);
//# sourceMappingURL=study-plan.module.js.map