
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.arthaProfile.findMany({
    include: { assessments: true }
  });
  console.log('ArthaProfiles:', JSON.stringify(profiles, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
