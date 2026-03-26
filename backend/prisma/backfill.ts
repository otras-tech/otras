import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const code = `${user.firstName.toUpperCase()}${String(user.id).slice(-3)}`;
    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: code }
    });
    console.log(`Updated user ${user.id} with referral code ${code}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
