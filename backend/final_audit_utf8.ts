import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
const prisma = new PrismaClient();
async function main() {
    const exam = await prisma.exam.findFirst({
        orderBy: { id: 'desc' },
        include: { 
            subjects: { 
                include: { _count: { select: { questions: true } } } 
            }
        }
    });

    if (exam) {
        let output = `EXAM: ${exam.name} (ID: ${exam.id})\n`;
        exam.subjects.forEach(s => {
            output += `SUBJECT: ${s.name} | QUESTIONS IN BANK: ${s._count.questions}\n`;
        });
        fs.writeFileSync('exam_report.txt', output, 'utf8');
        console.log("Written to exam_report.txt");
    }
}
main().finally(() => prisma.$disconnect());
