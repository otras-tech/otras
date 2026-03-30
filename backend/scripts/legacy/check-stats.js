const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check(referrerId) {
  const [referrals, referrer] = await Promise.all([
    prisma.referral.findMany({ where: { referrerId } }),
    prisma.user.findUnique({
      where: { id: referrerId },
      select: { credits: true, referralCode: true, otrId: true },
    }),
  ]);

  const totalReferrals = referrals.length;
  const successReferrals = referrals.filter(r => r.status === 'Qualified Referral').length;
  const creditsEarned = referrals.reduce((sum, r) => sum + (r.creditsEarned || 0), 0);
  const mockTestsEarned = Math.floor(successReferrals / 10);

  const result = {
    totalReferrals,
    successReferrals,
    creditsEarned,
    mockTestsEarned,
    availableCredits: referrer?.credits ?? 0,
    referralCode: referrer?.referralCode ?? '',
    referrals,
  };
  console.log(`Referral Stats for user ${referrerId}:`, JSON.stringify(result, null, 2));

  await prisma.$disconnect();
}

const userId = 22; // Let's check the friend (user 22)
check(userId);
