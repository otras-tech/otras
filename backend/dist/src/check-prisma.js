"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function check() {
    const prisma = new client_1.PrismaClient();
    try {
        console.log('Checking refreshToken model...');
        if (prisma.refreshToken) {
            console.log('SUCCESS: refreshToken exists on prisma client');
            console.log('Attempting to count records...');
            const count = await prisma.refreshToken.count();
            console.log(`SUCCESS: Counted ${count} records`);
        }
        else {
            console.log('FAILURE: refreshToken DOES NOT EXIST on prisma client');
        }
    }
    catch (err) {
        console.error('Error checking prisma client:', err);
    }
    finally {
        await prisma.$disconnect();
    }
}
check();
//# sourceMappingURL=check-prisma.js.map