const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const exams = await prisma.exam.findMany({
    take: 5
  });
  console.log('Valid Exams:', exams);
  process.exit(0);
}

main();
