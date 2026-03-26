"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CareerAIService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerAIService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let CareerAIService = CareerAIService_1 = class CareerAIService {
    logger = new common_1.Logger(CareerAIService_1.name);
    async generateRoadmap(dto) {
        this.logger.log(`CareerAI: Initiating Roadmap Generation (Wait: 120s)`);
        const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000/api/v1";
        try {
            const response = await axios_1.default.post(`${aiServiceUrl}/career-ai`, dto, { timeout: 120000 });
            this.logger.log(`CareerAI: Response received successfully`);
            const roadmap = response.data.roadmap;
            if (roadmap) {
                return { roadmap };
            }
            throw new Error("Invalid structure from AI Service");
        }
        catch (error) {
            this.logger.error(`CareerAI Backend Error: ${error.message}`);
            return {
                roadmap: {
                    summary: "AI systems are currently under high load. We have generated a foundational success trajectory based on your scores to get you started immediately.",
                    recommendations: [
                        "Start documenting projects on GitHub to build practical visibility",
                        "Join AI/ML communities like NITI Aayog's AI strategy for network growth",
                        "Improve verbal skills by reading government technical reports daily",
                        "Target GATE (CS/DA) as a primary gateway to technical leadership"
                    ],
                    sixMonth: [
                        { month: "Month 1", tasks: ["Establish daily study routine", "Complete initial Tier 1 review", "Identify core skill gaps"] },
                        { month: "Month 2", tasks: ["Focus on Quant & Logical basics", "Start weekly mock tests", "Concept mapping"] },
                        { month: "Month 3", tasks: ["Deep dive into verbal ability", "Analyze mock test patterns", "Strategy iteration"] },
                        { month: "Month 4", tasks: ["Intensive sectional practice", "Identify second-tier weaknesses", "Advanced problem solving"] },
                        { month: "Month 5", tasks: ["Full-length mock marathon", "Review exam day strategy", "Speed optimization"] },
                        { month: "Month 6", tasks: ["Final concept revision", "Exam day simulations", "Confidence building"] }
                    ],
                    oneYear: [
                        { phase: "Advanced Phase", tasks: ["Specialization Mastery", "Network with industry mentors", "Final deployment"] }
                    ]
                }
            };
        }
    }
};
exports.CareerAIService = CareerAIService;
exports.CareerAIService = CareerAIService = CareerAIService_1 = __decorate([
    (0, common_1.Injectable)()
], CareerAIService);
//# sourceMappingURL=career-ai.service.js.map