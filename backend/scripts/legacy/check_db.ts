
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  console.log("Users:", users);
  
  if (users.length > 0) {
    const userId = users[0].id.toString(); // Assuming first user for test
    const profile = await prisma.arthaProfile.findFirst({
        where: { userId: userId },
        include: { feedback: true }
    });
    console.log("Artha Profile:", JSON.stringify(profile, null, 2));
    
    const foundUser = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    const reports = await prisma.arthaRecentReport.findMany({
        where: { otrId: foundUser?.otrId ?? undefined }
    });
    console.log("Recent Reports:", JSON.stringify(reports, null, 2));
  }
}

check().catch(console.error);
