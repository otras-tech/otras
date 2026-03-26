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
var StudyPlanService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanService = void 0;
const common_1 = require("@nestjs/common");
const prompt_1 = require("./prompt");
const runAIService_1 = require("../../utils/runAIService");
let StudyPlanService = StudyPlanService_1 = class StudyPlanService {
    constructor() {
        this.logger = new common_1.Logger(StudyPlanService_1.name);
    }
    async generate(input) {
        const totalDays = input.planDurationDays || 7;
        const chunkSize = 5;
        const chunks = Math.ceil(totalDays / chunkSize);
        this.logger.log(`StudyPlan: Generating ${totalDays} days in ${chunks} chunks.`);
        let allDays = [];
        let summaries = [];
        let recommendations = [];
        const chunkPromises = Array.from({ length: chunks }, (_, i) => {
            const startDay = (i * chunkSize) + 1;
            const daysToGen = Math.min(chunkSize, totalDays - (i * chunkSize));
            const prompt = (0, prompt_1.studyPlanPrompt)(input, daysToGen, startDay);
            return (0, runAIService_1.runAIService)(prompt, input.language, {
                jsonMode: true,
                expectedFields: ['summary', 'days']
            });
        });
        const results = await Promise.all(chunkPromises);
        for (const result of results) {
            if (result) {
                if (Array.isArray(result.days))
                    allDays = [...allDays, ...result.days];
                if (result.summary)
                    summaries.push(result.summary);
                if (Array.isArray(result.recommendations)) {
                    recommendations = [...recommendations, ...result.recommendations];
                }
            }
        }
        if (allDays.length === 0) {
            this.logger.error("Failed to generate any days for the study plan.");
            return this.getFallback();
        }
        allDays.sort((a, b) => a.dayNumber - b.dayNumber);
        const uniqueDays = Array.from(new Map(allDays.map(d => [d.dayNumber, d])).values());
        this.logger.log(`StudyPlan: Final merged plan contains ${uniqueDays.length} unique days.`);
        return {
            planDurationDays: uniqueDays.length,
            summary: summaries.join(" | "),
            recommendations: [...new Set(recommendations)],
            days: uniqueDays
        };
    }
    getFallback() {
        return {
            days: [],
            summary: "AI study plan generation failed. Returning safe template.",
            recommendations: []
        };
    }
};
exports.StudyPlanService = StudyPlanService;
exports.StudyPlanService = StudyPlanService = StudyPlanService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StudyPlanService);
//# sourceMappingURL=study-plan.service.js.map