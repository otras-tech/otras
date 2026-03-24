"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const exam = await prisma.exam.findFirst({
        orderBy: { id: 'desc' },
        include: { subjects: { include: { _count: { select: { questions: true } } } } }
    });
    if (exam) {
        console.log(`EXAM: ${exam.name} (ID: ${exam.id})`);
        exam.subjects.forEach(s => {
            console.log(`SUBJECT: ${s.name} (ID: ${s.id}) COUNT: ${s._count.questions}`);
        });
    }
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=final_audit.js.map