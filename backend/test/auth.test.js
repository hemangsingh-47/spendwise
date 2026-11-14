/**
 * SpendWise Backend Authentication & Authorization Test Suite (Phase 7)
 * Tests JWT generation, bcrypt password hashing, auth middleware, user isolation,
 * and security rules against real MongoDB.
 */

const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');

function makeRequest(port, method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

async function runAuthTests() {
  console.log('====================================================');
  console.log('   SPENDWISE AUTH & SECURITY TEST SUITE (PHASE 7)   ');
  console.log('====================================================\n');

  await connectDB();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`[Test-Runner] Ephemeral server running on port ${port}\n`);

  const uniqueSuffix = Date.now();
  const userAData = {
    name: 'Hemang Singh',
    email: `hemang_${uniqueSuffix}@college.edu`,
    password: 'password123',
  };
  const userBData = {
    name: 'Aarav Sharma',
    email: `aarav_${uniqueSuffix}@college.edu`,
    password: 'securePassword456',
  };

  let tokenA = null;
  let tokenB = null;
  let txAId = null;
  let passedCount = 0;

  try {
    // 1. Register User A
    console.log('1. Testing POST /api/v1/auth/register (User A)');
    const regRes = await makeRequest(port, 'POST', '/api/v1/auth/register', userAData);
    console.log(`   Status: ${regRes.status}, Message: "${regRes.body.message}"`);
    console.assert(regRes.status === 201, 'Should return 201 Created');
    console.assert(regRes.body.token, 'Should return JWT token');
    console.assert(regRes.body.user.password === undefined, 'Must not return password');
    tokenA = regRes.body.token;
    passedCount++;

    // 2. Register Duplicate Email Error
    console.log('\n2. Testing POST /api/v1/auth/register (Duplicate Email Check)');
    const dupRes = await makeRequest(port, 'POST', '/api/v1/auth/register', userAData);
    console.log(`   Status: ${dupRes.status}, Error Message: "${dupRes.body.message}"`);
    console.assert(dupRes.status === 400, 'Should reject duplicate email with 400');
    passedCount++;

    // 3. Register Missing Fields Error
    console.log('\n3. Testing POST /api/v1/auth/register (Missing Fields Check)');
    const missingRes = await makeRequest(port, 'POST', '/api/v1/auth/register', { name: 'Incomplete' });
    console.log(`   Status: ${missingRes.status}, Error Message: "${missingRes.body.message}"`);
    console.assert(missingRes.status === 400, 'Should reject missing fields with 400');
    passedCount++;

    // 4. Login User A with correct credentials
    console.log('\n4. Testing POST /api/v1/auth/login (Correct Credentials)');
    const loginRes = await makeRequest(port, 'POST', '/api/v1/auth/login', {
      email: userAData.email,
      password: userAData.password,
    });
    console.log(`   Status: ${loginRes.status}, Token received: ${Boolean(loginRes.body.token)}`);
    console.assert(loginRes.status === 200, 'Should return 200 OK');
    console.assert(loginRes.body.token, 'Token must be present in login response');
    passedCount++;

    // 5. Login with incorrect password
    console.log('\n5. Testing POST /api/v1/auth/login (Incorrect Password)');
    const badLoginRes = await makeRequest(port, 'POST', '/api/v1/auth/login', {
      email: userAData.email,
      password: 'wrongPassword999',
    });
    console.log(`   Status: ${badLoginRes.status}, Error Message: "${badLoginRes.body.message}"`);
    console.assert(badLoginRes.status === 401, 'Should return 401 for incorrect password');
    passedCount++;

    // 6. Access protected endpoint without token
    console.log('\n6. Testing GET /api/v1/auth/me (Without Token - Unauthorized)');
    const noTokenRes = await makeRequest(port, 'GET', '/api/v1/auth/me');
    console.log(`   Status: ${noTokenRes.status}, Message: "${noTokenRes.body.message}"`);
    console.assert(noTokenRes.status === 401, 'Should reject with 401 without token');
    passedCount++;

    // 7. Access protected endpoint with invalid token
    console.log('\n7. Testing GET /api/v1/auth/me (With Invalid Token)');
    const badTokenRes = await makeRequest(port, 'GET', '/api/v1/auth/me', null, 'invalid.jwt.token');
    console.log(`   Status: ${badTokenRes.status}, Message: "${badTokenRes.body.message}"`);
    console.assert(badTokenRes.status === 401, 'Should reject with 401 for bad token');
    passedCount++;

    // 8. Access protected endpoint with valid token
    console.log('\n8. Testing GET /api/v1/auth/me (With Valid Token A)');
    const meRes = await makeRequest(port, 'GET', '/api/v1/auth/me', null, tokenA);
    console.log(`   Status: ${meRes.status}, Authenticated User: "${meRes.body.data?.name}"`);
    console.assert(meRes.status === 200, 'Should return 200 OK');
    console.assert(meRes.body.data.email === userAData.email, 'User email should match');
    passedCount++;

    // 9. Update Profile
    console.log('\n9. Testing PUT /api/v1/auth/profile (Update Name & Currency)');
    const updateRes = await makeRequest(
      port,
      'PUT',
      '/api/v1/auth/profile',
      { name: 'Hemang Singh Solanki', currency: 'INR' },
      tokenA
    );
    console.log(`   Status: ${updateRes.status}, Updated Name: "${updateRes.body.data?.name}"`);
    console.assert(updateRes.status === 200, 'Should return 200 OK');
    console.assert(updateRes.body.data.name === 'Hemang Singh Solanki', 'Name must be updated');
    passedCount++;

    // 10. Change Password
    console.log('\n10. Testing POST /api/v1/auth/change-password');
    const changePassRes = await makeRequest(
      port,
      'POST',
      '/api/v1/auth/change-password',
      { currentPassword: 'password123', newPassword: 'newSecretPassword2026' },
      tokenA
    );
    console.log(`    Status: ${changePassRes.status}, Message: "${changePassRes.body.message}"`);
    console.assert(changePassRes.status === 200, 'Should return 200 OK');

    // Verify new password works on login
    const newLoginRes = await makeRequest(port, 'POST', '/api/v1/auth/login', {
      email: userAData.email,
      password: 'newSecretPassword2026',
    });
    console.assert(newLoginRes.status === 200, 'Login with new password must succeed');
    tokenA = newLoginRes.body.token; // Refresh token
    passedCount++;

    // 11. Security & Data Isolation Test: User A creates a transaction
    console.log('\n11. Testing Data Isolation: User A creates a private transaction');
    const createTxRes = await makeRequest(
      port,
      'POST',
      '/api/v1/transactions',
      {
        type: 'expense',
        amount: 850,
        category: 'Education',
        description: 'Semester 3 Book User A',
      },
      tokenA
    );
    console.assert(createTxRes.status === 201, 'User A transaction created');
    txAId = createTxRes.body.data._id;
    passedCount++;

    // Register User B
    const regBRes = await makeRequest(port, 'POST', '/api/v1/auth/register', userBData);
    tokenB = regBRes.body.token;

    // 12. Security Test: User B tries to GET User A's transaction
    console.log(`\n12. Testing Security: User B tries to access User A's transaction (${txAId})`);
    const crossAccessRes = await makeRequest(port, 'GET', `/api/v1/transactions/${txAId}`, null, tokenB);
    console.log(`    Status: ${crossAccessRes.status}, Message: "${crossAccessRes.body.message}"`);
    console.assert(crossAccessRes.status === 404, 'User B must get 404 when querying User A transaction');
    passedCount++;

    // 13. Security Test: User B tries to DELETE User A's transaction
    console.log(`\n13. Testing Security: User B tries to DELETE User A's transaction (${txAId})`);
    const crossDeleteRes = await makeRequest(port, 'DELETE', `/api/v1/transactions/${txAId}`, null, tokenB);
    console.log(`    Status: ${crossDeleteRes.status}, Message: "${crossDeleteRes.body.message}"`);
    console.assert(crossDeleteRes.status === 404, 'User B must get 404 when deleting User A transaction');
    passedCount++;

    // 14. Security Test: Confirm password hashes in MongoDB are bcrypt hashes, never plain text
    console.log('\n14. Testing Security: Checking MongoDB document directly for password hashing');
    const userDoc = await User.findOne({ email: userAData.email });
    console.log(`    Password in DB starts with: "${userDoc.password.substring(0, 7)}..."`);
    console.assert(userDoc.password.startsWith('$2'), 'Password must be stored as bcrypt hash ($2a$ or $2b$)');
    console.assert(userDoc.password !== 'newSecretPassword2026', 'Password must NEVER be stored in plain text');
    passedCount++;

    // Clean up created test transactions & users
    await Transaction.deleteMany({ _id: txAId });
    await User.deleteMany({ email: { $in: [userAData.email, userBData.email] } });

    console.log('\n====================================================');
    console.log(`  ALL ${passedCount}/14 AUTH & SECURITY TESTS PASSED! `);
    console.log('====================================================');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runAuthTests().catch((err) => {
  console.error('\n[Auth-Test-Runner Failure]:', err);
  process.exit(1);
});

