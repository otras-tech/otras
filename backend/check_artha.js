const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkArtha() {
  const subjects = await prisma.subject.findMany();
  console.log('--- SUBJECTS ---');
  subjects.forEach(s => console.log(`- ${s.name}`));
}

checkArtha().catch(console.error).finally(() => prisma.$disconnect());
