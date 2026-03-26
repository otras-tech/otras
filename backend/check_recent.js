const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // find the exam named 'abc' or 'test 2' which the user might have created recently
    const exams = await prisma.exam.findMany({
        orderBy: { id: 'desc' },
        take: 3,
        include: {
            tests: { include: { questions: true } },
            subjects: { include: { questions: true } }
        }
    });

    for (const ex of exams) {
        console.log(`\nExam: ${ex.name} | config noOfQ: ${ex.noOfQuestions}`);
        
        const totalAvail = ex.subjects.reduce((sum, s) => sum + s.questions.length, 0);
        console.log(`  -> Connected Subjects: ${ex.subjects.length} | Total available Qs in pool: ${totalAvail}`);

        for (const t of ex.tests) {
            console.log(`  -> Test: ${t.name} (id: ${t.id}) | Loaded Qs: ${t.questions.length}`);
        }
    }
}

main().catch(console.error).finally(()=>prisma.$disconnect());
