"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArthaModule = void 0;
const common_1 = require("@nestjs/common");
const artha_controller_1 = require("./artha.controller");
const artha_service_1 = require("./artha.service");
const artha_repository_1 = require("./repository/artha.repository");
const prisma_module_1 = require("../../prisma/prisma.module");
const tier3_metrics_service_1 = require("./tier3-metrics.service");
let ArthaModule = class ArthaModule {
};
exports.ArthaModule = ArthaModule;
exports.ArthaModule = ArthaModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [artha_controller_1.ArthaController],
        providers: [artha_service_1.ArthaService, artha_repository_1.ArthaRepository, tier3_metrics_service_1.Tier3MetricsService],
        exports: [artha_service_1.ArthaService],
    })
], ArthaModule);
//# sourceMappingURL=artha.module.js.map