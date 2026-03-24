import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const examId = 18; 
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            subjects: {
                include: {
                    _count: { select: { questions: true } }
                }
            }
        }
    });

    if (!exam) { console.log(`Exam ${examId} not found`); return; }

    console.log(`Exam: ${exam.name} (ID: ${exam.id})`);
    console.log(`Configured Questions (targetCount): ${exam.noOfQuestions}`);
    exam.subjects.forEach(s => {
        console.log(` - Subject: ${s.name} (ID: ${s.id}) | Physical Questions in Database: ${s._count.questions}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
