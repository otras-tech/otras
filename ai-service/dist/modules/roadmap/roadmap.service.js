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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapService = void 0;
const common_1 = require("@nestjs/common");
const roadmap_prompt_1 = require("./roadmap.prompt");
const runAIService_1 = require("../../utils/runAIService");
let RoadmapService = class RoadmapService {
    constructor() { }
    async generate(payload) {
        return (0, runAIService_1.runAIService)((0, roadmap_prompt_1.roadmapPrompt)(payload), payload.language, {
            jsonMode: true,
            expectedFields: ['overview', 'plan', 'strategy', 'advisory']
        });
    }
};
exports.RoadmapService = RoadmapService;
exports.RoadmapService = RoadmapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RoadmapService);
//# sourceMappingURL=roadmap.service.js.map