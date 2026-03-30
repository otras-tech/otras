import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
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
