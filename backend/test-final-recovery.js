const http = require('http');

async function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function main() {
  console.log('🚀 INITIALIZING FINAL RECOVERY PROBE (500K-USER SCALE)');
  
  // 1. LOGIN
  console.log('\n--- STEP 1: ADMIN LOGIN ---');
  const loginRes = await request({
    hostname: 'localhost', port: 4000, path: '/api/v1/admin/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'adminBinduA@example.com', password: 'password123' });
  
  if (loginRes.statusCode !== 201 && loginRes.statusCode !== 200) {
    console.error('❌ LOGIN FAILED:', loginRes.statusCode, loginRes.body);
    return;
  }
  const token = loginRes.body.access_token || loginRes.body.accessToken;
  console.log('✅ LOGIN SUCCESS. Token Length:', token.length);

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 2. CREATE CATEGORY
  console.log('\n--- STEP 2: CREATE CATEGORY ---');
  const catRes = await request({
    hostname: 'localhost', port: 4000, path: '/api/v1/categories', method: 'POST',
    headers: authHeaders
  }, { name: `PROBE_CAT_${Date.now()}` });
  console.log(`STATUS: ${catRes.statusCode}`, catRes.body.success ? '✅ SUCCESS' : '❌ FAILED');

  // 3. CREATE SUBJECT
  console.log('\n--- STEP 3: CREATE SUBJECT ---');
  const subRes = await request({
    hostname: 'localhost', port: 4000, path: '/api/v1/subjects', method: 'POST',
    headers: authHeaders
  }, { name: `PROBE_SUB_${Date.now()}`, examId: 1, categoryId: 1 });
  console.log(`STATUS: ${subRes.statusCode}`, subRes.body.success ? '✅ SUCCESS' : '❌ FAILED');

  // 4. CREATE JOB
  console.log('\n--- STEP 4: CREATE JOB ---');
  const jobRes = await request({
    hostname: 'localhost', port: 4000, path: '/api/v1/jobs', method: 'POST',
    headers: authHeaders
  }, { title: `PROBE_JOB_${Date.now()}`, description: "Verification probe", deadline: "2026-12-31T23:59:59Z", status: "Open" });
  console.log(`STATUS: ${jobRes.statusCode}`, jobRes.body.success ? '✅ SUCCESS' : '❌ FAILED');

  console.log('\n--- AUDIT COMPLETE ---');
}

main().catch(console.error);
