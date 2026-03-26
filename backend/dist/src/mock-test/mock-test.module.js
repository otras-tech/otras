"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockTestModule = void 0;
const common_1 = require("@nestjs/common");
const mock_test_service_1 = require("./mock-test.service");
const mock_test_controller_1 = require("./mock-test.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let MockTestModule = class MockTestModule {
};
exports.MockTestModule = MockTestModule;
exports.MockTestModule = MockTestModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [mock_test_controller_1.MockTestController],
        providers: [mock_test_service_1.MockTestService],
        exports: [mock_test_service_1.MockTestService],
    })
], MockTestModule);
//# sourceMappingURL=mock-test.module.js.map