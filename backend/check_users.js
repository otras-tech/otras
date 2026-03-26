const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    select: { id: true, email: true }
  });
  console.log('Valid User IDs:', users);
  process.exit(0);
}

main();
