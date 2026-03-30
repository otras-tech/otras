const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const referrals = await prisma.referral.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { referrer: true }
  });
  console.log('Recent Referrals:', JSON.stringify(referrals, null, 2));

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('Recent Users:', JSON.stringify(users.map(u => ({ id: u.id, email: u.email, credits: u.credits, otrId: u.otrId })), null, 2));
  
  await prisma.$disconnect();
}

check();
