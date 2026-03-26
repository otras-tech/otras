import { Injectable } from '@nestjs/common';

@Injectable()
export class Tier3MetricsService {
  calculateAccuracy(correctCount: number, attemptedQuestions: number): number {
    if (attemptedQuestions === 0) return 0;
    return (correctCount / attemptedQuestions) * 100;
  }

  calculateSpeed(totalTimeInSeconds: number, attemptedQuestions: number): number {
    if (attemptedQuestions === 0) return 0;
    return totalTimeInSeconds / attemptedQuestions;
  }

  calculateConsistency(attempts: { isCorrect: boolean }[]): number {
    if (attempts.length < 5) return 100; // Not enough data for consistency, default to high

    const groupSize = 5;
    const groups: number[] = [];

    for (let i = 0; i < attempts.length; i += groupSize) {
      const group = attempts.slice(i, i + groupSize);
      if (group.length === 0) continue;
      const groupCorrect = group.filter(a => a.isCorrect).length;
      const groupAccuracy = (groupCorrect / group.length) * 100;
      groups.push(groupAccuracy);
    }

    if (groups.length < 2) return 100;

    const n = groups.length;
    const mean = groups.reduce((a, b) => a + b, 0) / n;
    const variance = groups.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    // Consistency = 100 - StandardDeviation
    // Usually stdDev for accuracy (0-100) won't exceed 50-60 in extreme cases
    const consistency = Math.max(0, 100 - stdDev);
    return Math.round(consistency);
  }
}
