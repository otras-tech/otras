const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const content = fs.readFileSync(envPath, 'utf8');

console.log('--- .env RAW AUDIT ---');
const lines = content.split(/\r?\n/);
lines.forEach((line, i) => {
  if (line.includes('JWT_ACCESS_SECRET')) {
    console.log(`Line ${i + 1}: Found JWT_ACCESS_SECRET. Length: ${line.split('=')[1]?.length || 0}`);
  }
  if (line.includes('JWT_REFRESH_SECRET')) {
    console.log(`Line ${i + 1}: Found JWT_REFRESH_SECRET. Length: ${line.split('=')[1]?.length || 0}`);
  }
});
console.log('----------------------');
