import { RoadmapService } from '../modules/roadmap/roadmap.service';
import { CareerService } from '../modules/career-guidance/career.service';
import { EligibilityService } from '../modules/eligibility-explainer/eligibility.service';
import { PerformanceService } from '../modules/performance/performance.service';
import { BurnoutService } from '../modules/burnout/burnout.service';
import { ReportService } from '../modules/report/report.service';
import { IntelligenceService } from '../modules/artha/intelligence.service';
export declare class AiController {
    private roadmap;
    private career;
    private eligibility;
    private performance;
    private burnout;
    private report;
    private intelligence;
    constructor(roadmap: RoadmapService, career: CareerService, eligibility: EligibilityService, performance: PerformanceService, burnout: BurnoutService, report: ReportService, intelligence: IntelligenceService);
    roadmapGen(body: any): Promise<any>;
    careerGen(body: any): Promise<any>;
    eligibilityGen(body: any): Promise<any>;
    performanceGen(body: any): Promise<any>;
    burnoutGen(body: any): Promise<any>;
    reportGen(body: any): Promise<any>;
    intelligenceGen(body: any): Promise<any>;
    generateAI(body: any): Promise<any>;
}
