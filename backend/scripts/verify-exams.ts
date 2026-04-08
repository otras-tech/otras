import { PrismaClient } from '@prisma/client';

async function verify() {
  const prisma = new PrismaClient();
  
  const count = await prisma.exam.count();
  console.log(`\n📊 Total exams in DB: ${count.toLocaleString()}\n`);

  const sample = await prisma.exam.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      shortDescription: true,
      cutoff: true,
      pattern: true,
      noOfQuestions: true,
      createdAt: true,
    },
  });

  console.log('Sample rows:');
  console.table(sample.map(r => ({
    id: r.id,
    name: r.name.substring(0, 40),
    category: r.shortDescription,
    cutoff: r.cutoff,
    pattern: r.pattern,
    questions: r.noOfQuestions,
  })));

  // Category distribution
  const all = await prisma.exam.findMany({ select: { shortDescription: true } });
  const dist: Record<string, number> = {};
  for (const row of all) {
    const cat = row.shortDescription?.split('|')[0].trim() ?? 'Unknown';
    dist[cat] = (dist[cat] || 0) + 1;
  }
  console.log('\nCategory Distribution:');
  console.table(dist);

  await prisma.$disconnect();
}

verify();
