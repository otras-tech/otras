"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Fetching profiles...");
    const profiles = await prisma.arthaProfile.findMany({
        select: {
            userId: true,
            readinessIndex: true,
            tier1Progress: true,
            tier2Progress: true,
            tier3Progress: true,
            percentile: true
        }
    });
    console.log(JSON.stringify(profiles, null, 2));
    const assessments = await prisma.arthaAssessment.findMany({
        select: {
            profileId: true,
            tier: true,
            readinessIndex: true
        }
    });
    console.log("Assessments readiness:", JSON.stringify(assessments, null, 2));
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=check_readiness.js.map