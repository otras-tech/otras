
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const latestProfile = await prisma.arthaProfile.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { feedback: true }
  });
  
  if (latestProfile) {
    console.log("Latest Artha Profile:");
    console.log("User ID:", latestProfile.userId);
    console.log("Scores: L:", latestProfile.logicalScore, " Q:", latestProfile.quantScore, " V:", latestProfile.verbalScore);
    console.log("Percentile:", latestProfile.percentile);
    console.log("Readiness:", latestProfile.readinessIndex);
    
    if (latestProfile.feedback) {
       console.log("Latest Feedback Tier:", latestProfile.feedback.tier);
       console.log("Feedback Insight:", latestProfile.feedback.readinessInsight);
    }
  } else {
    console.log("No profiles found.");
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
