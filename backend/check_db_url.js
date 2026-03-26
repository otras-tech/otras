
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('Connected successfully!');
  } catch (e) {
    console.error('Connection failed:');
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
