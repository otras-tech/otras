"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StudyPlanModule", {
    enumerable: true,
    get: function() {
        return StudyPlanModule;
    }
});
const _common = require("@nestjs/common");
const _studyplancontroller = require("./controller/study-plan.controller");
const _studyplanservice = require("./service/study-plan.service");
const _studyplanrepository = require("./repository/study-plan.repository");
const _reschedulerservice = require("./service/rescheduler.service");
const _prismamodule = require("../../prisma/prisma.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let StudyPlanModule = class StudyPlanModule {
};
StudyPlanModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule
        ],
        controllers: [
            _studyplancontroller.StudyPlanController
        ],
        providers: [
            _studyplanservice.StudyPlanService,
            _studyplanrepository.StudyPlanRepository,
            _reschedulerservice.ReschedulerService
        ],
        exports: [
            _studyplanservice.StudyPlanService
        ]
    })
], StudyPlanModule);

//# sourceMappingURL=study-plan.module.js.map