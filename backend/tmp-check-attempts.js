const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attempts = await prisma.mockTestAttempt.findMany({
    take: 15,
    orderBy: { attemptedAt: 'desc' },
    select: { id: true, otrId: true, score: true, totalMarks: true, submitTime: true, attemptedAt: true }
  });
  console.table(attempts.map(a => ({
    id: a.id,
    otrId: a.otrId,
    score: a.score,
    totalMarks: a.totalMarks,
    submitTime: a.submitTime ? 'SET' : 'NULL',
    attemptedAt: a.attemptedAt.toISOString()
  })));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
