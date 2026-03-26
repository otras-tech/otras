const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.findUnique({ where: { id: 1 } });
  console.log('User 1:', user1);
  const allUsers = await prisma.user.findMany({ take: 5 });
  console.log('Sample Users:', allUsers.map(u => ({ id: u.id, email: u.email })));
  process.exit();
}

main();
