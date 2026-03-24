import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const examId = 18; // Based on previous output truncation
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            subjects: {
                include: {
                    _count: { select: { questions: true } }
                }
            },
            tests: {
                include: {
                    questions: {
                        include: { subject: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    if (!exam) { console.log("Exam 18 not found"); return; }

    console.log(`\nExam: ${exam.name} (ID: ${exam.id})`);
    console.log(`Total Subjects Associated: ${exam.subjects.length}`);
    exam.subjects.forEach(s => {
        console.log(` - Subject: ${s.name} (ID: ${s.id}) | Questions in Bank: ${s._count.questions}`);
    });

    if (exam.tests.length > 0) {
        const test = exam.tests[0];
        console.log(`Latest Test: ${test.name} (ID: ${test.id})`);
        const subjectCounts = {};
        test.questions.forEach(q => {
            const subName = q.subject?.name || 'Unknown';
            subjectCounts[subName] = (subjectCounts[subName] || 0) + 1;
        });
        console.log(`Subjects truly in Test questions: ${Object.keys(subjectCounts).length}`);
        Object.entries(subjectCounts).forEach(([name, count]) => {
            console.log(` - ${name}: ${count} questions`);
        });
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
