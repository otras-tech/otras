
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const exams = await prisma.exam.findMany({
    where: { name: { contains: 'Tier', mode: 'insensitive' } },
    include: { tests: true }
  });
  console.log(JSON.stringify(exams, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
