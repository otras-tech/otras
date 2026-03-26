const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const exams = await prisma.exam.findMany({
        include: {
            tests: { include: { questions: true } },
            subjects: { include: { questions: true } }
        }
    });

    for (const ex of exams) {
        console.log(`Exam: ${ex.name} | config noOfQ: ${ex.noOfQuestions}`);
        
        // Sum total available questions across subjects
        const totalAvail = ex.subjects.reduce((sum, s) => sum + s.questions.length, 0);
        console.log(`  -> Connected Subjects: ${ex.subjects.length} | Total available Qs in pool: ${totalAvail}`);

        for (const t of ex.tests) {
            console.log(`  -> Test: ${t.name} | Loaded Qs: ${t.questions.length}`);
        }
        console.log('---');
    }
}

main().catch(console.error).finally(()=>prisma.$disconnect());
