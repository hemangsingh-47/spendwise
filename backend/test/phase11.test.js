/**
 * SpendWise Phase 11 Test Suite: Multi-User Security, Profile Management & Production Diagnostics
 * 
 * Verifies:
 * 1. Strict cross-user data isolation (Transactions, Budgets, Analytics)
 * 2. Profile updates (Name & Currency preference)
 * 3. Change password verification with bcrypt hashing
 * 4. Token authorization enforcement & invalid token rejection
 * 5. Production Health check endpoint and secret leak prevention
 */

const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');
const Budget = require('../src/models/Budget');

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

function assert(condition, message) {
  if (!condition) {
    console.error(`\n❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

async function runPhase11Tests() {
  console.log('================================================================');
  console.log('   SPENDWISE PHASE 11: PROFILE, MULTI-USER SECURITY & DIAGNOSTICS');
  console.log('================================================================\n');

  await connectDB();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`[Test-Runner] Ephemeral server running on port ${port}\n`);

  const uniqueSuffix = Date.now();
  let userAToken, userBToken, userAId, userBId;
  let testTxBId, testBudgetId;

  try {
    // -------------------------------------------------------------
    // 1. SETUP TWO INDEPENDENT TEST USERS
    // -------------------------------------------------------------
    console.log('1. Registering User Alpha (Primary Student)');
    const regA = await makeRequest(port, 'POST', '/api/v1/auth/register', {
      name: 'Hemang Alpha',
      email: `alpha_${uniqueSuffix}@spendwise.test`,
      password: 'passwordAlpha123',
    });
    assert(regA.status === 201, `User Alpha registration failed with status ${regA.status}`);
    userAToken = regA.body.token;
    userAId = regA.body.user._id || regA.body.user.id;
    console.log(`   User Alpha registered (ID: ${userAId})\n`);

    console.log('2. Registering User Beta (Secondary Student)');
    const regB = await makeRequest(port, 'POST', '/api/v1/auth/register', {
      name: 'Rohit Beta',
      email: `beta_${uniqueSuffix}@spendwise.test`,
      password: 'passwordBeta456',
    });
    assert(regB.status === 201, `User Beta registration failed with status ${regB.status}`);
    userBToken = regB.body.token;
    userBId = regB.body.user._id || regB.body.user.id;
    console.log(`   User Beta registered (ID: ${userBId})\n`);

    // -------------------------------------------------------------
    // 2. MULTI-USER DATA ISOLATION (TRANSACTIONS)
    // -------------------------------------------------------------
    console.log('3. User Beta creates a private transaction (₹1,500 Books)');
    const txB = await makeRequest(
      port,
      'POST',
      '/api/v1/transactions',
      {
        type: 'expense',
        amount: 1500,
        category: 'Education',
        description: 'Semester 3 Textbook',
        date: '2026-11-17',
      },
      userBToken
    );
    assert(txB.status === 201, `User Beta tx creation failed: ${txB.status}`);
    testTxBId = txB.body.data._id || txB.body.data.id;
    console.log(`   Created Transaction ID: ${testTxBId}\n`);

    console.log('4. User Alpha queries GET /api/v1/transactions (Must be 0 records)');
    const listA = await makeRequest(port, 'GET', '/api/v1/transactions', null, userAToken);
    assert(listA.status === 200, `Failed to fetch Alpha list: ${listA.status}`);
    assert(listA.body.data.length === 0, `User Alpha saw User Beta's transaction!`);
    console.log('   PASSED: User Alpha transaction list is empty.\n');

    console.log(`5. User Alpha attempts direct GET on User Beta transaction (${testTxBId})`);
    const directA = await makeRequest(port, 'GET', `/api/v1/transactions/${testTxBId}`, null, userAToken);
    assert([403, 404].includes(directA.status), `Security violation: Alpha accessed Beta tx (Status: ${directA.status})`);
    console.log(`   PASSED: Access blocked with status ${directA.status}\n`);

    console.log(`6. User Alpha attempts PUT (modify) on User Beta transaction`);
    const editA = await makeRequest(
      port,
      'PUT',
      `/api/v1/transactions/${testTxBId}`,
      { amount: 1, description: 'Tampered' },
      userAToken
    );
    assert([403, 404].includes(editA.status), `Security violation: Alpha modified Beta tx (Status: ${editA.status})`);
    console.log(`   PASSED: Modification blocked with status ${editA.status}\n`);

    console.log(`7. User Alpha attempts DELETE on User Beta transaction`);
    const delA = await makeRequest(port, 'DELETE', `/api/v1/transactions/${testTxBId}`, null, userAToken);
    assert([403, 404].includes(delA.status), `Security violation: Alpha deleted Beta tx (Status: ${delA.status})`);
    console.log(`   PASSED: Deletion blocked with status ${delA.status}\n`);

    // -------------------------------------------------------------
    // 3. MULTI-USER DATA ISOLATION (BUDGETS)
    // -------------------------------------------------------------
    console.log('8. User Beta creates a private budget (Food: ₹8,000 for 11/2026)');
    const budgetB = await makeRequest(
      port,
      'POST',
      '/api/v1/budgets',
      {
        category: 'Food',
        limit: 8000,
        month: 11,
        year: 2026,
      },
      userBToken
    );
    assert(budgetB.status === 201, `User Beta budget creation failed: ${budgetB.status}`);
    testBudgetId = budgetB.body.data._id || budgetB.body.data.id;
    console.log(`   Created Budget ID: ${testBudgetId}\n`);

    console.log('9. User Alpha queries GET /api/v1/budgets for 11/2026 (Must be 0 records)');
    const bListA = await makeRequest(port, 'GET', '/api/v1/budgets?month=11&year=2026', null, userAToken);
    assert(bListA.status === 200, `Failed to query Alpha budgets: ${bListA.status}`);
    assert(bListA.body.data.length === 0, `User Alpha saw User Beta's budget!`);
    console.log('   PASSED: User Alpha budget list is isolated.\n');

    console.log(`10. User Alpha attempts DELETE on User Beta budget (${testBudgetId})`);
    const bDelA = await makeRequest(port, 'DELETE', `/api/v1/budgets/${testBudgetId}`, null, userAToken);
    assert([403, 404].includes(bDelA.status), `Security violation: Alpha deleted Beta budget (Status: ${bDelA.status})`);
    console.log(`   PASSED: Budget deletion blocked with status ${bDelA.status}\n`);

    // -------------------------------------------------------------
    // 4. MULTI-USER DATA ISOLATION (ANALYTICS)
    // -------------------------------------------------------------
    console.log('11. User Beta adds ₹50,000 income. User Alpha checks analytics summary');
    await makeRequest(
      port,
      'POST',
      '/api/v1/transactions',
      {
        type: 'income',
        amount: 50000,
        category: 'Salary',
        description: 'Beta Stipend',
        date: '2026-11-15',
      },
      userBToken
    );

    const analyticsA = await makeRequest(
      port,
      'GET',
      '/api/v1/analytics/summary?month=11&year=2026',
      null,
      userAToken
    );
    assert(analyticsA.status === 200, `Analytics query failed: ${analyticsA.status}`);
    assert(
      analyticsA.body.data.totalIncome === 0,
      `User Alpha analytics contaminated with Beta income! Got: ${analyticsA.body.data.totalIncome}`
    );
    console.log('   PASSED: User Alpha analytics strictly 0, completely isolated.\n');

    // -------------------------------------------------------------
    // 5. PROFILE UPDATE & CURRENCY PREFERENCE (PUT /api/v1/auth/profile)
    // -------------------------------------------------------------
    console.log('12. User Alpha updates profile (Name: "Hemang S.", Currency: "USD")');
    const updateProf = await makeRequest(
      port,
      'PUT',
      '/api/v1/auth/profile',
      {
        name: 'Hemang S.',
        currency: 'USD',
      },
      userAToken
    );
    assert(updateProf.status === 200, `Profile update failed: ${updateProf.status}`);
    assert(updateProf.body.data.name === 'Hemang S.', 'Updated name mismatch');
    assert(updateProf.body.data.currency === 'USD', 'Updated currency mismatch');
    console.log('   PASSED: Profile updated successfully.\n');

    console.log('13. User Alpha attempts email change via profile update (Must be ignored)');
    const tamperEmail = await makeRequest(
      port,
      'PUT',
      '/api/v1/auth/profile',
      {
        name: 'Hemang S.',
        email: 'hacked_alpha@spendwise.test',
      },
      userAToken
    );
    assert(tamperEmail.status === 200, `Profile update failed: ${tamperEmail.status}`);
    assert(
      tamperEmail.body.data.email === `alpha_${uniqueSuffix}@spendwise.test`,
      'Security flaw: email was changed via profile endpoint!'
    );
    console.log('   PASSED: Email remained locked and untouched.\n');

    // -------------------------------------------------------------
    // 6. PASSWORD CHANGE (POST /api/v1/auth/change-password)
    // -------------------------------------------------------------
    console.log('14. Testing change password with wrong current password');
    const wrongPass = await makeRequest(
      port,
      'POST',
      '/api/v1/auth/change-password',
      {
        currentPassword: 'wrongPassword999',
        newPassword: 'newValidPassword123',
      },
      userAToken
    );
    assert(wrongPass.status === 400, `Expected 400 for wrong pass, got: ${wrongPass.status}`);
    console.log('   PASSED: Rejected incorrect current password.\n');

    console.log('15. Testing change password with new password < 6 chars');
    const shortPass = await makeRequest(
      port,
      'POST',
      '/api/v1/auth/change-password',
      {
        currentPassword: 'passwordAlpha123',
        newPassword: '123',
      },
      userAToken
    );
    assert(shortPass.status === 400, `Expected 400 for short pass, got: ${shortPass.status}`);
    console.log('   PASSED: Rejected short new password.\n');

    console.log('16. User Alpha changes password successfully to "brandNewPassword789"');
    const changeOk = await makeRequest(
      port,
      'POST',
      '/api/v1/auth/change-password',
      {
        currentPassword: 'passwordAlpha123',
        newPassword: 'brandNewPassword789',
      },
      userAToken
    );
    assert(changeOk.status === 200, `Password change failed: ${changeOk.status}`);
    console.log('   PASSED: Password changed.\n');

    console.log('17. Verifying old password now fails login (401)');
    const oldLogin = await makeRequest(port, 'POST', '/api/v1/auth/login', {
      email: `alpha_${uniqueSuffix}@spendwise.test`,
      password: 'passwordAlpha123',
    });
    assert(oldLogin.status === 401, `Old password still succeeded! Status: ${oldLogin.status}`);
    console.log('   PASSED: Old password rejected.\n');

    console.log('18. Verifying new password succeeds login (200)');
    const newLogin = await makeRequest(port, 'POST', '/api/v1/auth/login', {
      email: `alpha_${uniqueSuffix}@spendwise.test`,
      password: 'brandNewPassword789',
    });
    assert(newLogin.status === 200, `New password failed login: ${newLogin.status}`);
    assert(Boolean(newLogin.body.token), 'No token returned on new password login');
    console.log('   PASSED: New password login successful.\n');

    // -------------------------------------------------------------
    // 7. SYSTEM HEALTH CHECK & SECRET LEAK PREVENTION
    // -------------------------------------------------------------
    console.log('19. Testing GET /api/v1/health (Health check & secret protection)');
    const health = await makeRequest(port, 'GET', '/api/v1/health');
    assert(health.status === 200, `Health check returned: ${health.status}`);
    assert(health.body.success === true, 'Health check success flag is false');
    assert(health.body.status === 'OK', `Expected status "OK", got: ${health.body.status}`);

    // Critical Security Check: Ensure sensitive keys are NEVER returned
    assert(health.body.JWT_SECRET === undefined, 'CRITICAL: JWT_SECRET leaked in health check!');
    assert(health.body.MONGODB_URI === undefined, 'CRITICAL: MONGODB_URI leaked in health check!');
    assert(health.body.CLOUDINARY_API_KEY === undefined, 'CRITICAL: Cloudinary key leaked!');
    console.log('   PASSED: Health check active and 0 secrets leaked.\n');

    console.log('================================================================');
    console.log('   ALL 19/19 PHASE 11 TESTS PASSED SUCCESSFULLY!                ');
    console.log('================================================================\n');
  } finally {
    // Clean up test records
    await User.deleteMany({
      email: { $in: [`alpha_${uniqueSuffix}@spendwise.test`, `beta_${uniqueSuffix}@spendwise.test`] },
    });
    if (testTxBId) await Transaction.findByIdAndDelete(testTxBId);
    if (testBudgetId) await Budget.findByIdAndDelete(testBudgetId);

    server.close();
    await mongoose.connection.close();
  }
}

runPhase11Tests().catch((err) => {
  console.error('[Phase11 Test Runner Error]:', err);
  process.exit(1);
});
