"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const tests = await prisma.test.findMany({
        include: {
            exam: { include: { subjects: true } },
            questions: { include: { subject: true } }
        },
        orderBy: { id: 'desc' },
        take: 1
    });
    console.log(JSON.stringify(tests, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=get_tests.js.map