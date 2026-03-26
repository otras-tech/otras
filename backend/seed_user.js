const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
      otrId: 'OTR12345',
      referralCode: 'REF12345'
    },
  });
  console.log('User created/verified:', user);
  process.exit(0);
}

main();
