import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BATCH_SIZE = 1000;

async function backfill() {
  console.log('Starting production-grade batch backfill of relational scores...');

  // 1. Backfill Results (Cursor-based pagination for scale)
  let lastResultId = 0;
  let resultsProcessCount = 0;

  while (true) {
    const results = await (prisma.result as any).findMany({
      where: {
        id: { gt: lastResultId },
        isDeleted: false,
        subjectScores: { none: {} },
      },
      take: BATCH_SIZE,
      orderBy: { id: 'asc' },
      select: { id: true, subjectBreakdown: true },
    });

    if (results.length === 0) break;

    for (const result of results) {
      const breakdown = result.subjectBreakdown as any;
      if (!breakdown || typeof breakdown !== 'object') continue;

      const subjectNames = Object.keys(breakdown);
      const subjects = await prisma.subject.findMany({
        where: { name: { in: subjectNames, mode: 'insensitive' } },
        select: { id: true, name: true },
      });

      const subjectMap = new Map(
        subjects.map((s) => [s.name.toLowerCase(), s.id]),
      );

      const scoreData = Object.entries(breakdown)
        .map(([name, data]: [string, any]) => ({
          resultId: result.id,
          subjectId: subjectMap.get(name.toLowerCase()) || 0,
          correct: data.correct || 0,
          wrong: data.wrong || 0,
          score: data.score || 0,
        }))
        .filter((s) => s.subjectId !== 0);

      if (scoreData.length > 0) {
        // Idempotent: Delete existing if any (unlikely with {none:{}} but safer)
        await (prisma as any).subjectScore.deleteMany({ where: { resultId: result.id } });
        await (prisma as any).subjectScore.createMany({ data: scoreData });
      }
      lastResultId = result.id;
    }
    resultsProcessCount += results.length;
    console.log(`Processed ${resultsProcessCount} Results...`);
  }

  // 2. Backfill Mock Test Attempts (Cursor-based pagination for scale)
  let lastAttemptId = 0;
  let attemptsProcessCount = 0;

  while (true) {
    const attempts = await (prisma.mockTestAttempt as any).findMany({
      where: {
        id: { gt: lastAttemptId },
        isDeleted: false,
        subjectScores: { none: {} },
      },
      take: BATCH_SIZE,
      orderBy: { id: 'asc' },
      select: { id: true, subjectBreakdown: true },
    });

    if (attempts.length === 0) break;

    for (const attempt of attempts) {
      const breakdown = attempt.subjectBreakdown as any;
      if (!breakdown || typeof breakdown !== 'object') continue;

      const subjectNames = Object.keys(breakdown);
      const subjects = await prisma.subject.findMany({
        where: { name: { in: subjectNames, mode: 'insensitive' } },
        select: { id: true, name: true },
      });

      const subjectMap = new Map(
        subjects.map((s) => [s.name.toLowerCase(), s.id]),
      );

      const scoreData = Object.entries(breakdown)
        .map(([name, data]: [string, any]) => {
          const subjectId = subjectMap.get(name.toLowerCase());
          if (!subjectId) return null;

          const isObject = typeof data === 'object' && data !== null;
          return {
            mockAttemptId: attempt.id,
            subjectId,
            score: isObject ? (data.score ?? 0) : (data ?? 0),
            correct: isObject ? (data.correct ?? 0) : 0,
            wrong: isObject ? (data.wrong ?? 0) : 0,
          };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null);

      if (scoreData.length > 0) {
        // Idempotent
        await (prisma as any).mockAttemptScore.deleteMany({ where: { mockAttemptId: attempt.id } });
        await (prisma as any).mockAttemptScore.createMany({ data: scoreData });
      }
      lastAttemptId = attempt.id;
    }
    attemptsProcessCount += attempts.length;
    console.log(`Processed ${attemptsProcessCount} Mock Attempts...`);
  }

  console.log('Backfill completed successfully.');
}

// @ts-ignore
backfill()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    typeof process !== 'undefined' && process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
