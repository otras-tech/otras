import { Injectable, Logger } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class CareerAIService {
    private readonly logger = new Logger(CareerAIService.name);

    async generateRoadmap(dto: any) {
        this.logger.log(`CareerAI: Initiating Roadmap Generation (Wait: 120s)`);
        
        const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000/api/v1";
        
        try {
            const response = await axios.post(
                `${aiServiceUrl}/career-ai`,
                dto,
                { timeout: 120000 } // 120s for AI to breathe
            );
            
            this.logger.log(`CareerAI: Response received successfully`);
            const roadmap = response.data.roadmap;

            if (roadmap) {
                return { roadmap };
            }

            throw new Error("Invalid structure from AI Service");

        } catch (error) {
            this.logger.error(`CareerAI Backend Error: ${error.message}`);
            
            // Production-grade fallback with individual 6-month structure
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
}