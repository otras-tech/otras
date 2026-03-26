
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attempts = await prisma.arthaQuestionAttempt.findMany();
  console.log('ArthaQuestionAttempt count:', attempts.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
