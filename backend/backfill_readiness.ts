import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Backfilling missing readiness indexes...");
    const profiles = await prisma.arthaProfile.findMany({
        where: {
            readinessIndex: { equals: 0 }
        }
    });

    for (const profile of profiles) {
        let score = 0;
        const aptitude = (profile.logicalScore + profile.quantScore + profile.verbalScore) / 3 || 0;
        
        // Simple heuristic for backfill based on progress
        if (profile.tier3Progress > 0) {
            score = (aptitude * 0.3) + 30 + 10; // Dummy fallback
        } else if (profile.tier2Progress > 0) {
            score = (aptitude * 0.4) + 20; 
        } else if (profile.tier1Progress > 0) {
            score = aptitude * 0.5;
        }

        const calculated = Math.min(100, Math.max(0, Math.round(score)));
        if (calculated > 0) {
            await prisma.arthaProfile.update({
                where: { id: profile.id },
                data: { readinessIndex: calculated }
            });
            console.log(`Updated profile ${profile.userId} to readiness: ${calculated}`);
        }
    }
    console.log("Done backfilling.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
