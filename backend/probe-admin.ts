import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const admin = await prisma.admin.findUnique({
    where: { id: 4 }
  });
  console.log('--- ADMIN 4 PROBE ---');
  console.log(admin ? JSON.stringify(admin) : 'Admin 4 NOT FOUND');
  console.log('----------------------');
  await prisma.$disconnect();
}

main();
