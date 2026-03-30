import { PrismaClient } from '@prisma/client';

async function check() {
  const prisma = new PrismaClient();
  try {
    console.log('Checking refreshToken model...');
    if ((prisma as any).refreshToken) {
      console.log('SUCCESS: refreshToken exists on prisma client');
      console.log('Attempting to count records...');
      const count = await (prisma as any).refreshToken.count();
      console.log(`SUCCESS: Counted ${count} records`);
    } else {
      console.log('FAILURE: refreshToken DOES NOT EXIST on prisma client');
    }
  } catch (err) {
    console.error('Error checking prisma client:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
