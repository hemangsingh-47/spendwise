/**
 * SpendWise Budget Management Test Suite (Phase 9)
 * Tests all 15 critical requirements for budget management:
 * 1. Create a new budget
 * 2. Fetch all budgets
 * 3. Fetch one budget
 * 4. Edit a budget
 * 5. Delete a budget
 * 6. Reject a zero or negative budget limit
 * 7. Reject duplicate budgets for the same category/month/year
 * 8. Calculate category-wise expenses correctly
 * 9. Calculate remaining budget correctly
 * 10. Verify income is excluded from spending
 * 11. Verify monthly calculations
 * 12. Verify zero-spending categories
 * 13. Verify 80% warning threshold
 * 14. Verify 100% exceeded warning threshold
 * 15. Verify one user cannot access another user's budgets
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

async function runBudgetTests() {
  console.log('====================================================');
  console.log('    SPENDWISE BUDGET MANAGEMENT TEST SUITE (PHASE 9) ');
  console.log('====================================================\n');

  await connectDB();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`[Test-Runner] Ephemeral server running on port ${port}\n`);

  const uniqueSuffix = Date.now();

  try {
    // Setup User A
    const resRegA = await makeRequest(port, 'POST', '/api/v1/auth/register', {
      name: 'Budget Student A',
      email: `budget_a_${uniqueSuffix}@college.edu`,
      password: 'password123',
    });
    const tokenA = resRegA.body.token;
    const userA = resRegA.body.user;

    // Setup User B
    const resRegB = await makeRequest(port, 'POST', '/api/v1/auth/register', {
      name: 'Budget Student B',
      email: `budget_b_${uniqueSuffix}@college.edu`,
      password: 'password123',
    });
    const tokenB = resRegB.body.token;

    const testMonth = 11;
    const testYear = 2026;

    // 1. Create a new budget (Food: ₹5,000)
    console.log('1. Testing POST /api/v1/budgets (Create Food Budget ₹5,000)');
    const resCreate = await makeRequest(port, 'POST', '/api/v1/budgets', {
      category: 'Food',
      limit: 5000,
      month: testMonth,
      year: testYear,
    }, tokenA);
    if (resCreate.status !== 201 || !resCreate.body.data?.id) {
      throw new Error(`Failed to create budget: ${JSON.stringify(resCreate.body)}`);
    }
    const foodBudgetId = resCreate.body.data.id;
    console.log(`   Status: ${resCreate.status}, Created Budget ID: ${foodBudgetId}`);

    // 2. Fetch all budgets
    console.log('\n2. Testing GET /api/v1/budgets (Fetch Budgets for User A)');
    const resList = await makeRequest(port, 'GET', `/api/v1/budgets?month=${testMonth}&year=${testYear}`, null, tokenA);
    if (resList.status !== 200 || resList.body.count !== 1) {
      throw new Error(`Expected 1 budget, got ${resList.body.count}`);
    }
    console.log(`   Status: ${resList.status}, Total budgets: ${resList.body.count}`);

    // 3. Fetch one budget by ID
    console.log(`\n3. Testing GET /api/v1/budgets/${foodBudgetId}`);
    const resGetOne = await makeRequest(port, 'GET', `/api/v1/budgets/${foodBudgetId}`, null, tokenA);
    if (resGetOne.status !== 200 || resGetOne.body.data.category !== 'Food') {
      throw new Error(`Failed to get budget: ${JSON.stringify(resGetOne.body)}`);
    }
    console.log(`   Status: ${resGetOne.status}, Category: "${resGetOne.body.data.category}"`);

    // 4. Edit budget limit
    console.log(`\n4. Testing PUT /api/v1/budgets/${foodBudgetId} (Update limit to ₹6,000)`);
    const resUpdate = await makeRequest(port, 'PUT', `/api/v1/budgets/${foodBudgetId}`, {
      limit: 6000,
    }, tokenA);
    if (resUpdate.status !== 200 || resUpdate.body.data.limit !== 6000) {
      throw new Error(`Failed to update budget limit: ${JSON.stringify(resUpdate.body)}`);
    }
    console.log(`   Status: ${resUpdate.status}, Updated Limit: ₹${resUpdate.body.data.limit}`);

    // 5. Create and Delete a secondary budget
    console.log('\n5. Testing DELETE /api/v1/budgets/:id (Create & Delete "Books" budget)');
    const resBooks = await makeRequest(port, 'POST', '/api/v1/budgets', {
      category: 'Books',
      limit: 2000,
      month: testMonth,
      year: testYear,
    }, tokenA);
    const booksId = resBooks.body.data.id;
    const resDel = await makeRequest(port, 'DELETE', `/api/v1/budgets/${booksId}`, null, tokenA);
    if (resDel.status !== 200 || !resDel.body.success) {
      throw new Error(`Failed to delete budget: ${JSON.stringify(resDel.body)}`);
    }
    console.log(`   Status: ${resDel.status}, Deleted: ${resDel.body.message}`);

    // 6. Reject zero or negative limit
    console.log('\n6. Testing POST /api/v1/budgets with negative limit (-500)');
    const resNeg = await makeRequest(port, 'POST', '/api/v1/budgets', {
      category: 'Travel',
      limit: -500,
      month: testMonth,
      year: testYear,
    }, tokenA);
    if (resNeg.status !== 400) {
      throw new Error(`Expected 400 for negative limit, got ${resNeg.status}`);
    }
    console.log(`   Status: ${resNeg.status}, Error Message: "${resNeg.body.message}"`);

    // 7. Reject duplicate budget for same category/month/year
    console.log('\n7. Testing Duplicate Budget check (Food for 11/2026)');
    const resDup = await makeRequest(port, 'POST', '/api/v1/budgets', {
      category: 'Food',
      limit: 3000,
      month: testMonth,
      year: testYear,
    }, tokenA);
    if (resDup.status !== 400) {
      throw new Error(`Expected 400 for duplicate budget, got ${resDup.status}`);
    }
    console.log(`   Status: ${resDup.status}, Error Message: "${resDup.body.message}"`);

    // 8. Calculate category-wise expenses correctly
    console.log('\n8. Testing Category-wise Expense calculation');
    // Add two Food expenses for User A: ₹1,500 + ₹1,000 = ₹2,500
    await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'expense',
      amount: 1500,
      category: 'Food',
      description: 'Hostel Mess Fee',
      date: new Date(testYear, testMonth - 1, 5).toISOString(),
    }, tokenA);
    await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'expense',
      amount: 1000,
      category: 'Food',
      description: 'Groceries and Snacks',
      date: new Date(testYear, testMonth - 1, 10).toISOString(),
    }, tokenA);

    const resCheckFood = await makeRequest(port, 'GET', `/api/v1/budgets/${foodBudgetId}`, null, tokenA);
    if (resCheckFood.body.data.spent !== 2500) {
      throw new Error(`Expected spent=2500, got ${resCheckFood.body.data.spent}`);
    }
    console.log(`   Status: 200, Spent: ₹${resCheckFood.body.data.spent} / ₹${resCheckFood.body.data.limit}`);

    // 9. Calculate remaining budget correctly
    console.log('\n9. Testing Remaining Budget calculation');
    const expectedRemaining = 6000 - 2500; // 3500
    if (resCheckFood.body.data.remaining !== expectedRemaining) {
      throw new Error(`Expected remaining=${expectedRemaining}, got ${resCheckFood.body.data.remaining}`);
    }
    console.log(`   Remaining Amount: ₹${resCheckFood.body.data.remaining} (Correct)`);

    // 10. Verify Income is excluded from spending
    console.log('\n10. Testing Income exclusion (Add ₹10,000 salary under Food)');
    await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'income',
      amount: 10000,
      category: 'Food',
      description: 'Food Stipend',
      date: new Date(testYear, testMonth - 1, 12).toISOString(),
    }, tokenA);
    const resAfterIncome = await makeRequest(port, 'GET', `/api/v1/budgets/${foodBudgetId}`, null, tokenA);
    if (resAfterIncome.body.data.spent !== 2500) {
      throw new Error(`Income was mistakenly counted in spending! spent=${resAfterIncome.body.data.spent}`);
    }
    console.log(`   Spent remains ₹2500 despite ₹10,000 Income added (Correct)`);

    // 11. Verify Monthly Calculations (Transaction in different month must not count)
    console.log('\n11. Testing Month boundary (Add Food expense in different month)');
    await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'expense',
      amount: 4000,
      category: 'Food',
      description: 'October Food Bill',
      date: new Date(testYear, testMonth - 2, 15).toISOString(), // Month 10
    }, tokenA);
    const resMonthBound = await makeRequest(port, 'GET', `/api/v1/budgets/${foodBudgetId}`, null, tokenA);
    if (resMonthBound.body.data.spent !== 2500) {
      throw new Error(`Different month expense leaked into calculation! spent=${resMonthBound.body.data.spent}`);
    }
    console.log(`   Different month expense excluded, spent remains ₹2500 (Correct)`);

    // 12. Verify Zero-spending category
    console.log('\n12. Testing Zero-spending category budget (Transport: ₹2,000)');
    const resTransport = await makeRequest(port, 'POST', '/api/v1/budgets', {
      category: 'Transport',
      limit: 2000,
      month: testMonth,
      year: testYear,
    }, tokenA);
    if (resTransport.body.data.spent !== 0 || resTransport.body.data.percentage !== 0 || resTransport.body.data.status !== 'normal') {
      throw new Error(`Zero spending failed: ${JSON.stringify(resTransport.body.data)}`);
    }
    console.log(`   Transport Spent: ₹${resTransport.body.data.spent}, Progress: 0%, Status: "${resTransport.body.data.status}"`);

    // 13. Verify 80% Warning threshold
    console.log('\n13. Testing 80% Warning threshold');
    // Transport limit is ₹2,000. Add ₹1,650 expense (82.5% -> warning)
    await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'expense',
      amount: 1650,
      category: 'Transport',
      description: 'Monthly Bus Pass',
      date: new Date(testYear, testMonth - 1, 15).toISOString(),
    }, tokenA);
    const resWarn = await makeRequest(port, 'GET', `/api/v1/budgets/${resTransport.body.data.id}`, null, tokenA);
    if (resWarn.body.data.status !== 'warning' || resWarn.body.data.percentage < 80) {
      throw new Error(`Expected warning status, got ${resWarn.body.data.status} with ${resWarn.body.data.percentage}%`);
    }
    console.log(`   Percentage: ${resWarn.body.data.percentage}%, Status: "${resWarn.body.data.status}" (Correct Warning)`);

    // 14. Verify 100% Exceeded threshold
    console.log('\n14. Testing 100% Exceeded threshold');
    // Add another ₹500 to Transport (Total 2150 / 2000 = 107.5% -> exceeded)
    await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'expense',
      amount: 500,
      category: 'Transport',
      description: 'Auto Rickshaw Fare',
      date: new Date(testYear, testMonth - 1, 16).toISOString(),
    }, tokenA);
    const resExceeded = await makeRequest(port, 'GET', `/api/v1/budgets/${resTransport.body.data.id}`, null, tokenA);
    if (resExceeded.body.data.status !== 'exceeded' || resExceeded.body.data.percentage < 100) {
      throw new Error(`Expected exceeded status, got ${resExceeded.body.data.status} with ${resExceeded.body.data.percentage}%`);
    }
    console.log(`   Percentage: ${resExceeded.body.data.percentage}%, Status: "${resExceeded.body.data.status}" (Correct Exceeded)`);

    // 15. Verify User Isolation: User B cannot access User A's budget
    console.log('\n15. Testing User Isolation (User B attempts to GET User A\'s Food Budget)');
    const resIso = await makeRequest(port, 'GET', `/api/v1/budgets/${foodBudgetId}`, null, tokenB);
    if (resIso.status !== 404) {
      throw new Error(`Expected 404 for User B, got ${resIso.status}`);
    }
    console.log(`   Status: ${resIso.status}, Message: "${resIso.body.message}" (Isolation Verified)`);

    // Clean up test data
    await User.deleteMany({ email: { $in: [`budget_a_${uniqueSuffix}@college.edu`, `budget_b_${uniqueSuffix}@college.edu`] } });
    await Budget.deleteMany({ month: testMonth, year: testYear });
    await Transaction.deleteMany({ description: { $in: ['Hostel Mess Fee', 'Groceries and Snacks', 'Food Stipend', 'October Food Bill', 'Monthly Bus Pass', 'Auto Rickshaw Fare'] } });

    console.log('\n====================================================');
    console.log('  ALL 15/15 BUDGET MANAGEMENT TESTS PASSED!          ');
    console.log('====================================================\n');
  } finally {
    server.close();
    await mongoose.connection.close();
  }
}

runBudgetTests().catch((err) => {
  console.error('\n[Budget-Test-Runner Failure]:', err);
  process.exit(1);
});
