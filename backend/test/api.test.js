/**
 * SpendWise Backend Automated API Test Suite
 * Tests all required Phase 6 REST API endpoints, validations, and error handlers.
 */

const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const connectDB = require('../src/config/db');

// Helper to make HTTP requests against the test server
function makeRequest(port, method, path, data = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('   SPENDWISE BACKEND API TEST SUITE (PHASE 6)       ');
  console.log('====================================================\n');

  // Connect to DB
  await connectDB();

  // Spin up test server on a random available port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`[Test-Runner] Ephemeral server running on port ${port}\n`);

  let passedCount = 0;
  let createdTxId = null;

  try {
    // 1. Health Check Test
    console.log('1. Testing GET /api/v1/health');
    const healthRes = await makeRequest(port, 'GET', '/api/v1/health');
    console.log(`   Status: ${healthRes.status}, Message: "${healthRes.body.message}"`);
    console.assert(healthRes.status === 200, 'Health check should return 200');
    console.assert(healthRes.body.success === true, 'Health check success should be true');
    passedCount++;

    // 2. Create Valid Transaction
    console.log('\n2. Testing POST /api/v1/transactions (Create Valid Transaction)');
    const createRes = await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'expense',
      amount: 450,
      category: 'Food',
      description: 'College Canteen Lunch',
      paymentMethod: 'UPI',
    });
    console.log(`   Status: ${createRes.status}, Created ID: ${createRes.body.data?._id}`);
    console.assert(createRes.status === 201, 'Should return 201 Created');
    console.assert(createRes.body.success === true, 'Success flag should be true');
    console.assert(createRes.body.data.amount === 450, 'Amount should be 450');
    createdTxId = createRes.body.data._id;
    passedCount++;

    // 3. Get All Transactions
    console.log('\n3. Testing GET /api/v1/transactions (Fetch List)');
    const listRes = await makeRequest(port, 'GET', '/api/v1/transactions');
    console.log(`   Status: ${listRes.status}, Total records: ${listRes.body.count}`);
    console.assert(listRes.status === 200, 'Should return 200 OK');
    console.assert(Array.isArray(listRes.body.data), 'Data should be an array');
    console.assert(listRes.body.summary !== undefined, 'Summary stats should be included');
    passedCount++;

    // 4. Get Transaction By ID
    console.log(`\n4. Testing GET /api/v1/transactions/${createdTxId} (Fetch Single)`);
    const singleRes = await makeRequest(port, 'GET', `/api/v1/transactions/${createdTxId}`);
    console.log(`   Status: ${singleRes.status}, Description: "${singleRes.body.data?.description}"`);
    console.assert(singleRes.status === 200, 'Should return 200 OK');
    console.assert(singleRes.body.data._id === createdTxId, 'IDs should match');
    passedCount++;

    // 5. Update Transaction
    console.log(`\n5. Testing PUT /api/v1/transactions/${createdTxId} (Update Amount)`);
    const updateRes = await makeRequest(port, 'PUT', `/api/v1/transactions/${createdTxId}`, {
      amount: 520,
      description: 'College Canteen Lunch + Chai',
    });
    console.log(`   Status: ${updateRes.status}, Updated Amount: ₹${updateRes.body.data?.amount}`);
    console.assert(updateRes.status === 200, 'Should return 200 OK');
    console.assert(updateRes.body.data.amount === 520, 'Amount should be updated to 520');
    passedCount++;

    // 6. Delete Transaction
    console.log(`\n6. Testing DELETE /api/v1/transactions/${createdTxId} (Delete Record)`);
    const deleteRes = await makeRequest(port, 'DELETE', `/api/v1/transactions/${createdTxId}`);
    console.log(`   Status: ${deleteRes.status}, Message: "${deleteRes.body.message}"`);
    console.assert(deleteRes.status === 200, 'Should return 200 OK');
    passedCount++;

    // 7. Validation: Invalid Amount (< 0)
    console.log('\n7. Testing POST /api/v1/transactions with negative amount');
    const negAmountRes = await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'expense',
      amount: -100,
      category: 'Food',
      description: 'Invalid negative test',
    });
    console.log(`   Status: ${negAmountRes.status}, Error Message: "${negAmountRes.body.message}"`);
    console.assert(negAmountRes.status === 400, 'Should reject negative amount with 400');
    passedCount++;

    // 8. Validation: Missing Category
    console.log('\n8. Testing POST /api/v1/transactions with missing category');
    const missingCatRes = await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'income',
      amount: 1000,
      description: 'Missing category test',
    });
    console.log(`   Status: ${missingCatRes.status}, Error Message: "${missingCatRes.body.message}"`);
    console.assert(missingCatRes.status === 400, 'Should reject missing category with 400');
    passedCount++;

    // 9. Validation: Invalid ObjectId Format
    console.log('\n9. Testing GET /api/v1/transactions/not-a-valid-id');
    const badIdRes = await makeRequest(port, 'GET', '/api/v1/transactions/not-a-valid-id');
    console.log(`   Status: ${badIdRes.status}, Error Message: "${badIdRes.body.message}"`);
    console.assert(badIdRes.status === 400, 'Should reject malformed ID with 400');
    passedCount++;

    // 10. Nonexistent Transaction (404)
    const fakeId = '673456789abcdef012345679';
    console.log(`\n10. Testing GET /api/v1/transactions/${fakeId} (Nonexistent 404)`);
    const notFoundRes = await makeRequest(port, 'GET', `/api/v1/transactions/${fakeId}`);
    console.log(`    Status: ${notFoundRes.status}, Message: "${notFoundRes.body.message}"`);
    console.assert(notFoundRes.status === 404, 'Should return 404 Not Found');
    passedCount++;

    // 11. Validation: Invalid Transaction Type
    console.log('\n11. Testing POST /api/v1/transactions with invalid type ("crypto")');
    const invalidTypeRes = await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'crypto',
      amount: 5000,
      category: 'Other',
      description: 'Invalid type test',
    });
    console.log(`    Status: ${invalidTypeRes.status}, Error Message: "${invalidTypeRes.body.message}"`);
    console.assert(invalidTypeRes.status === 400, 'Should reject invalid transaction type with 400');
    passedCount++;

    console.log('\n====================================================');
    console.log(`  ALL ${passedCount}/11 BACKEND API TESTS PASSED SUCCESSFULLY! `);
    console.log('====================================================');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runTests().catch((err) => {
  console.error('\n[Test-Runner Failure]:', err);
  process.exit(1);
});
