"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PypModule = void 0;
const common_1 = require("@nestjs/common");
const pyp_service_1 = require("./pyp.service");
const pyp_controller_1 = require("./pyp.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let PypModule = class PypModule {
};
exports.PypModule = PypModule;
exports.PypModule = PypModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [pyp_service_1.PypService],
        controllers: [pyp_controller_1.PypController]
    })
], PypModule);
//# sourceMappingURL=pyp.module.js.map