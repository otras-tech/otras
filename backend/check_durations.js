
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const mockTests = await prisma.mockTest.findMany({
    select: { id: true, title: true, duration: true }
  });
  console.log('MockTests:', JSON.stringify(mockTests, null, 2));
  
  const exams = await prisma.exam.findMany({
    select: { id: true, name: true }
  });
  console.log('Exams:', JSON.stringify(exams, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
