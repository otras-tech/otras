const http = require('http');

const data = JSON.stringify({
  title: "Senior Backend Engineer",
  description: "We are looking for a Node.js expert...",
  deadline: "2026-12-31T23:59:59Z",
  status: "Open"
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/v1/jobs',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQmluZHVAZXhhbXBsZS5jb20iLCJzdWIiOjQsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTI4OTI2OSwiZXhwIjoxNzc1Mzc1NjY5fQ.ReO7VnF1j7hv4XnR-9sssQHTZi7WnBT3roXkKXQSDuw',
    'Accept': '*/*'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
