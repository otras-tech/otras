import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("=== LATEST 3 EXAMS AUDIT ===");
    const exams = await prisma.exam.findMany({
        orderBy: { id: 'desc' },
        take: 3,
        include: {
            subjects: {
                include: {
                    _count: { select: { questions: true } }
                }
            },
            tests: {
                orderBy: { id: 'desc' },
                take: 1,
                include: {
                    questions: {
                        include: { subject: true }
                    }
                }
            }
        }
    });

    for (const exam of exams) {
        console.log(`\nEXAM: ${exam.name} (ID: ${exam.id})`);
        console.log(`Target Questions (noOfQuestions): ${exam.noOfQuestions || 100}`);
        console.log(`REGISTERED SUBJECTS (${exam.subjects.length}):`);
        exam.subjects.forEach(s => {
            console.log(` - ID: ${s.id} | Name: ${s.name} | Bank Count: ${s._count.questions}`);
        });

        if (exam.tests.length > 0) {
            const test = exam.tests[0];
            console.log(`LATEST TEST: ${test.name} (ID: ${test.id})`);
            const subjCountsInTest = {};
            test.questions.forEach(q => {
                const subName = q.subject?.name || 'Unknown';
                subjCountsInTest[subName] = (subjCountsInTest[subName] || 0) + 1;
            });
            console.log(`SUBJECTS PHYSICALLY IN TEST:`);
            Object.entries(subjCountsInTest).forEach(([name, count]) => {
                console.log(` - ${name}: ${count} questions`);
            });
        } else {
            console.log("No tests generated.");
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
