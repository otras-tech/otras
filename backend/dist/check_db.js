"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function check() {
    const users = await prisma.user.findMany({ select: { id: true, email: true } });
    console.log("Users:", users);
    if (users.length > 0) {
        const userId = users[0].id.toString();
        const profile = await prisma.arthaProfile.findFirst({
            where: { userId: userId },
            include: { feedback: true }
        });
        console.log("Artha Profile:", JSON.stringify(profile, null, 2));
        const reports = await prisma.arthaRecentReport.findMany({
            where: { otrId: (await prisma.user.findUnique({ where: { id: parseInt(userId) } }))?.otrId }
        });
        console.log("Recent Reports:", JSON.stringify(reports, null, 2));
    }
}
check().catch(console.error);
//# sourceMappingURL=check_db.js.map