import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const exam = await prisma.exam.findUnique({
    where: { id: 7 },
    include: {
      subjects: true,
      tests: { include: { questions: true } }
    }
  });
  console.log('Exam 7:', JSON.stringify(exam, null, 2));
  if (exam?.subjects) {
      for (const sub of exam.subjects) {
          const count = await prisma.question.count({ where: { subjectId: sub.id } });
          console.log(`Subject ${sub.name} (ID: ${sub.id}): ${count} questions`);
      }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
