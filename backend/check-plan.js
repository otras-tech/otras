const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check(userId) {
  const plans = await prisma.studyPlan.findMany({
    where: { userId },
    include: {
      days: {
        include: { activities: true },
        orderBy: { date: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  console.log('Latest Study Plan:', JSON.stringify(plans[0], null, 2));
  await prisma.$disconnect();
}

check(9);
