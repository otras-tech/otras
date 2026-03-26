"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tier3MetricsService = void 0;
const common_1 = require("@nestjs/common");
let Tier3MetricsService = class Tier3MetricsService {
    calculateAccuracy(correctCount, attemptedQuestions) {
        if (attemptedQuestions === 0)
            return 0;
        return (correctCount / attemptedQuestions) * 100;
    }
    calculateSpeed(totalTimeInSeconds, attemptedQuestions) {
        if (attemptedQuestions === 0)
            return 0;
        return totalTimeInSeconds / attemptedQuestions;
    }
    calculateConsistency(attempts) {
        if (attempts.length < 5)
            return 100;
        const groupSize = 5;
        const groups = [];
        for (let i = 0; i < attempts.length; i += groupSize) {
            const group = attempts.slice(i, i + groupSize);
            if (group.length === 0)
                continue;
            const groupCorrect = group.filter(a => a.isCorrect).length;
            const groupAccuracy = (groupCorrect / group.length) * 100;
            groups.push(groupAccuracy);
        }
        if (groups.length < 2)
            return 100;
        const n = groups.length;
        const mean = groups.reduce((a, b) => a + b, 0) / n;
        const variance = groups.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
        const stdDev = Math.sqrt(variance);
        const consistency = Math.max(0, 100 - stdDev);
        return Math.round(consistency);
    }
};
exports.Tier3MetricsService = Tier3MetricsService;
exports.Tier3MetricsService = Tier3MetricsService = __decorate([
    (0, common_1.Injectable)()
], Tier3MetricsService);
//# sourceMappingURL=tier3-metrics.service.js.map