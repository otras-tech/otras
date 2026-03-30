const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.exam.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'SSC CGL 2024',
    },
  });
  console.log('Exam created/verified:', exam);
  process.exit(0);
}

main();
