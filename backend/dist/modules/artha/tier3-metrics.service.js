"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Tier3MetricsService", {
    enumerable: true,
    get: function() {
        return Tier3MetricsService;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let Tier3MetricsService = class Tier3MetricsService {
    calculateAccuracy(correctCount, attemptedQuestions) {
        if (attemptedQuestions === 0) return 0;
        return correctCount / attemptedQuestions * 100;
    }
    calculateSpeed(totalTimeInSeconds, attemptedQuestions) {
        if (attemptedQuestions === 0) return 0;
        return totalTimeInSeconds / attemptedQuestions;
    }
    calculateConsistency(attempts) {
        if (attempts.length < 5) return 100; // Not enough data for consistency, default to high
        const groupSize = 5;
        const groups = [];
        for(let i = 0; i < attempts.length; i += groupSize){
            const group = attempts.slice(i, i + groupSize);
            if (group.length === 0) continue;
            const groupCorrect = group.filter((a)=>a.isCorrect).length;
            const groupAccuracy = groupCorrect / group.length * 100;
            groups.push(groupAccuracy);
        }
        if (groups.length < 2) return 100;
        const n = groups.length;
        const mean = groups.reduce((a, b)=>a + b, 0) / n;
        const variance = groups.reduce((a, b)=>a + Math.pow(b - mean, 2), 0) / n;
        const stdDev = Math.sqrt(variance);
        // Consistency = 100 - StandardDeviation
        // Usually stdDev for accuracy (0-100) won't exceed 50-60 in extreme cases
        const consistency = Math.max(0, 100 - stdDev);
        return Math.round(consistency);
    }
};
Tier3MetricsService = _ts_decorate([
    (0, _common.Injectable)()
], Tier3MetricsService);

//# sourceMappingURL=tier3-metrics.service.js.map