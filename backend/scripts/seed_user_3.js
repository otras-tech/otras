const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      email: 'test3@example.com',
      firstName: 'Test',
      lastName: 'User 3',
      password: 'password123',
      otrId: 'OTR33333',
      referralCode: 'REF33333'
    },
  });
  console.log('User 3 created/verified:', user);
  process.exit(0);
}

main();
