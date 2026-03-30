const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.subject.findMany().then(console.log).finally(() => p.$disconnect());
