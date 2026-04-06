// ✅ STANDALONE AUTHENTICATION VERIFIER
// Run this with "npx ts-node verify-token.ts" to isolate secret issues.

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const path = require('path');

// 1. Load the same env as the server
dotenv.config();

const secret = (process.env.JWT_ACCESS_SECRET || 'secret').trim();
console.log('--- JWT SECURITY PROBE ---');
console.log(`Secret Source: ${process.env.JWT_ACCESS_SECRET ? '.env' : 'FALLBACK'}`);
console.log(`Secret Length: ${secret.length}`);
console.log(`Secret Prefix: ${secret.substring(0, 4)}...`);

// 2. Mock Payload
const payload = {
    sub: 4,
    email: 'adminBindu@example.com',
    role: 'ADMIN',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
};

// 3. Test Cycle
try {
    console.log('\n[1] Testing Signing...');
    const token = jwt.sign(payload, secret);
    console.log('Token generated successfully.');
    console.log(`Token Prefix: ${token.substring(0, 20)}...`);

    console.log('\n[2] Testing Verification...');
    const decoded = jwt.verify(token, secret);
    console.log('Verification Success!');
    console.log('Decoded Payload:', JSON.stringify(decoded, null, 2));

    console.log('\n--- VERIFICATION PASSED ---');
    console.log('If your server still says 401, the issue is with NESTJS CONFIG LOADING.');
} catch (err) {
    console.error('\n--- VERIFICATION FAILED ---');
    console.error(err);
}
