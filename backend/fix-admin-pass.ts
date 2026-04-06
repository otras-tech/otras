import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const updated = await prisma.admin.update({
    where: { id: 4 },
    data: { password: hashedPassword }
  });
  
  console.log('--- ADMIN 4 PASSWORD RESET ---');
  console.log(`Success: ${updated.id === 4}`);
  console.log('------------------------------');
  await prisma.$disconnect();
}

main();
