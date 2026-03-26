"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CareerAIService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerAIService = void 0;
const common_1 = require("@nestjs/common");
const runAIService_1 = require("../../utils/runAIService");
const prompt_1 = require("./prompt");
let CareerAIService = CareerAIService_1 = class CareerAIService {
    constructor() {
        this.logger = new common_1.Logger(CareerAIService_1.name);
    }
    async generate(dto) {
        try {
            this.logger.log(`CareerAI: Generating roadmap for ${dto.language}`);
            const prompt = (0, prompt_1.roadmapPrompt)(dto);
            const result = await (0, runAIService_1.runAIService)(prompt, dto.language, {
                jsonMode: true,
                expectedFields: ['summary', 'recommendations', 'sixMonth', 'oneYear']
            });
            return { roadmap: result };
        }
        catch (error) {
            this.logger.error(`CareerAI generation failed: ${error.message}`);
            return {
                roadmap: this.getFallbackPlan(),
                error: error.message
            };
        }
    }
    getFallbackPlan() {
        return {
            summary: "AI plan temporarily unavailable. Returning safe guidance.",
            recommendations: ["Self-evaluation", "Review basics", "Identify goals"],
            sixMonth: [
                { month: "Month 1", tasks: ["Focus on foundational logic", "Complete first assessment unit"] },
                { month: "Month 2", tasks: ["Quantitative aptitude drill", "Develop reading habits"] },
                { month: "Month 3", tasks: ["Verbal speed exercises", "Weekly mock simulation"] },
                { month: "Month 4", tasks: ["Topic-wise strength mapping", "Strategy development"] },
                { month: "Month 5", tasks: ["Full-length timed mock tests", "Weak area focus"] },
                { month: "Month 6", tasks: ["Final concept polish", "Exam day readiness"] }
            ],
            oneYear: [
                { phase: "Advanced Mastery", tasks: ["Senior level certifications", "Implementation projects"] }
            ]
        };
    }
};
exports.CareerAIService = CareerAIService;
exports.CareerAIService = CareerAIService = CareerAIService_1 = __decorate([
    (0, common_1.Injectable)()
], CareerAIService);
//# sourceMappingURL=career.service.js.map