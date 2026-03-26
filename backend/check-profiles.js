const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.arthaProfile.findMany({ include: { assessments: true } }).then(res => console.log(JSON.stringify(res, null, 2))).finally(() => p.$disconnect());
