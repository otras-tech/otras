
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const prisma = new PrismaClient();

async function debugAuth() {
  console.log('--- Auth Debugger ---');
  
  const secret = (process.env.JWT_ACCESS_SECRET || 'secret').trim();
  console.log('Secret (trimmed) length:', secret.length);
  
  // 1. Check User 1
  const user = await prisma.user.findFirst({
    where: { id: 1 }
  });
  
  if (!user) {
    console.error('❌ User 1 NOT FOUND in database.');
  } else {
    console.log('✅ User 1 found:', { id: user.id, email: user.email, role: user.role, isDeleted: user.isDeleted });
  }

  // 2. Generate a token manually
  const payload = { sub: 1, email: 'debug@example.com', role: 'ADMIN', jti: 'test-jti' };
  const token = jwt.sign(payload, secret, { expiresIn: '1m' });
  console.log('✅ Generated debug token.');

  // 3. Verify it immediately
  try {
    const decoded = jwt.verify(token, secret);
    console.log('✅ Token verification successful (immediate):', decoded);
  } catch (e) {
    console.error('❌ Token verification FAILED (immediate):', e.message);
  }

  // 4. Decode the user provided token if possible
  const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQmluZHVAZXhhbXBsZS5jb20iLCJzdWIiOjQsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTI4NjUzNiwiZXhwIjoxNzc1MzcyOTM2fQ.UrrFTUSn9hez9eEspyfhKEpbGXrPjxZb6tFxnj3lKTA';
  try {
    const decodedUserToken = jwt.verify(userToken, secret);
    console.log('✅ User provided token is VALID with current secret:', decodedUserToken);
  } catch (e) {
    console.error('❌ User provided token is INVALID with current secret:', e.message);
  }

  await prisma.$disconnect();
}

debugAuth();
