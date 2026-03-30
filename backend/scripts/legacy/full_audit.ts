import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
const prisma = new PrismaClient();
async function main() {
    const exams = await prisma.exam.findMany({
        include: { 
            subjects: { 
                include: { _count: { select: { questions: true } } } 
            }
        }
    });

    let output = "=== FULL EXAM AUDIT ===\n";
    exams.forEach(exam => {
        output += `\nEXAM: ${exam.name} (ID: ${exam.id}) - Subjects Expected: ${exam.subjects.length}\n`;
        exam.subjects.forEach(s => {
            output += ` - Subject: ${s.name} (ID: ${s.id}) | Questions in DB: ${s._count.questions}\n`;
        });
    });
    fs.writeFileSync('full_audit_report.txt', output, 'utf8');
}
main().finally(() => prisma.$disconnect());
