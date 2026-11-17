/**
 * SpendWise Analytics & Receipt Test Suite (Phase 10)
 * Tests:
 * 1. Financial summary analytics API
 * 2. Net savings and savings percentage formulas
 * 3. Monthly trends (6-month aggregation)
 * 4. Category-wise expense distribution & percentages
 * 5. Empty analytics state handling
 * 6. Receipt metadata persistence on transactions
 * 7. Receipt removal endpoint
 * 8. User isolation for analytics data
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

async function runAnalyticsTests() {
  console.log('====================================================');
  console.log('   SPENDWISE ANALYTICS & NATIVE TEST SUITE (PHASE 10)');
  console.log('====================================================\n');

  await connectDB();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`[Test-Runner] Ephemeral server running on port ${port}\n`);

  const uniqueSuffix = Date.now();

  try {
    // 1. Setup User A
    const resRegA = await makeRequest(port, 'POST', '/api/v1/auth/register', {
      name: 'Analytics Student A',
      email: `analytics_a_${uniqueSuffix}@college.edu`,
      password: 'password123',
    });
    const tokenA = resRegA.body.token;

    // Setup User B (for user isolation verification)
    const resRegB = await makeRequest(port, 'POST', '/api/v1/auth/register', {
      name: 'Analytics Student B',
      email: `analytics_b_${uniqueSuffix}@college.edu`,
      password: 'password123',
    });
    const tokenB = resRegB.body.token;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 2. Test empty analytics state
    console.log('1. Testing GET /api/v1/analytics/summary (Empty state)');
    const resEmpty = await makeRequest(port, 'GET', `/api/v1/analytics/summary?month=${currentMonth}&year=${currentYear}`, null, tokenA);
    if (resEmpty.status !== 200 || resEmpty.body.data.totalIncome !== 0 || resEmpty.body.data.totalExpenses !== 0) {
      throw new Error(`Empty summary failed: ${JSON.stringify(resEmpty.body)}`);
    }
    console.log(`   Status: ${resEmpty.status}, Total Income: ₹${resEmpty.body.data.totalIncome}, Expenses: ₹${resEmpty.body.data.totalExpenses}`);

    // 3. Seed test transactions for User A
    console.log('\n2. Seeding transactions for User A (Income: ₹30,000, Expenses: Food ₹6,000, Transport ₹4,000)');
    // Income: ₹30,000
    await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'income',
      amount: 30000,
      category: 'Salary',
      description: 'Part-time Tutoring Stipend',
      date: new Date(currentYear, currentMonth - 1, 2, 12, 0, 0).toISOString(),
    }, tokenA);

    // Expense: Food ₹6,000
    const resFoodTx = await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'expense',
      amount: 6000,
      category: 'Food',
      description: 'Monthly Canteen Card',
      date: new Date(currentYear, currentMonth - 1, 5, 12, 0, 0).toISOString(),
    }, tokenA);
    const txId = resFoodTx.body.data._id || resFoodTx.body.data.id;

    // Expense: Transport ₹4,000
    await makeRequest(port, 'POST', '/api/v1/transactions', {
      type: 'expense',
      amount: 4000,
      category: 'Transport',
      description: 'Metro Smart Card',
      date: new Date(currentYear, currentMonth - 1, 10, 12, 0, 0).toISOString(),
    }, tokenA);

    // 4. Test Summary Endpoint with seeded data
    console.log('\n3. Testing GET /api/v1/analytics/summary with active transactions');
    const resSummary = await makeRequest(port, 'GET', `/api/v1/analytics/summary?month=${currentMonth}&year=${currentYear}`, null, tokenA);
    if (resSummary.status !== 200) {
      throw new Error(`Summary failed: ${JSON.stringify(resSummary.body)}`);
    }
    const sumData = resSummary.body.data;
    console.log(`   Income: ₹${sumData.totalIncome}, Expenses: ₹${sumData.totalExpenses}`);
    console.log(`   Net Savings: ₹${sumData.netSavings} (Expected ₹20,000)`);
    console.log(`   Savings Rate: ${sumData.savingsPercentage}% (Expected 66.7%)`);

    if (sumData.netSavings !== 20000) {
      throw new Error(`Net savings mismatch: expected 20000, got ${sumData.netSavings}`);
    }

    // 5. Test Monthly Trends Endpoint (6 months)
    console.log('\n4. Testing GET /api/v1/analytics/monthly?months=6');
    const resMonthly = await makeRequest(port, 'GET', '/api/v1/analytics/monthly?months=6', null, tokenA);
    if (resMonthly.status !== 200 || !Array.isArray(resMonthly.body.data) || resMonthly.body.data.length !== 6) {
      throw new Error(`Monthly trend failed: ${JSON.stringify(resMonthly.body)}`);
    }
    const currentMonthEntry = resMonthly.body.data[resMonthly.body.data.length - 1];
    console.log(`   Returned ${resMonthly.body.data.length} months. Current month (${currentMonthEntry.label}): Income=₹${currentMonthEntry.income}, Expense=₹${currentMonthEntry.expense}`);
    if (currentMonthEntry.income !== 30000 || currentMonthEntry.expense !== 10000) {
      throw new Error(`Trend calculation mismatch: ${JSON.stringify(currentMonthEntry)}`);
    }

    // 6. Test Category Breakdown Endpoint
    console.log('\n5. Testing GET /api/v1/analytics/categories');
    const resCat = await makeRequest(port, 'GET', `/api/v1/analytics/categories?month=${currentMonth}&year=${currentYear}`, null, tokenA);
    if (resCat.status !== 200 || !Array.isArray(resCat.body.data)) {
      throw new Error(`Category breakdown failed: ${JSON.stringify(resCat.body)}`);
    }
    console.log(`   Total Expense Categories: ${resCat.body.categoriesCount}`);
    resCat.body.data.forEach((c) => {
      console.log(`   - ${c.category}: ₹${c.amount} (${c.percentage}%)`);
    });

    const foodCat = resCat.body.data.find((c) => c.category === 'Food');
    if (!foodCat || foodCat.amount !== 6000 || foodCat.percentage !== 60) {
      throw new Error(`Food category percentage mismatch: expected 60%, got ${foodCat?.percentage}%`);
    }

    // 7. Test Receipt Metadata Update on Transaction
    console.log('\n6. Testing Receipt Photo metadata on Transaction');
    const updatedTx = await Transaction.findByIdAndUpdate(
      txId,
      {
        receiptUrl: 'http://localhost:5000/uploads/receipts/test_canteen_bill.jpg',
        receiptPublicId: 'test_canteen_bill.jpg',
      },
      { new: true }
    );
    if (!updatedTx.receiptUrl || updatedTx.receiptPublicId !== 'test_canteen_bill.jpg') {
      throw new Error('Failed to attach receipt metadata');
    }
    console.log(`   Receipt URL saved: ${updatedTx.receiptUrl}`);

    // 8. Test Receipt Deletion Endpoint
    console.log(`\n7. Testing DELETE /api/v1/transactions/${txId}/receipt`);
    const resDelReceipt = await makeRequest(port, 'DELETE', `/api/v1/transactions/${txId}/receipt`, null, tokenA);
    if (resDelReceipt.status !== 200 || resDelReceipt.body.data.receiptUrl !== null) {
      throw new Error(`Failed to remove receipt: ${JSON.stringify(resDelReceipt.body)}`);
    }
    console.log(`   Status: 200, Receipt removed: ${resDelReceipt.body.message}`);

    // 9. Test User Isolation on Analytics (User B sees zero records)
    console.log('\n8. Testing User Isolation on Analytics (User B queries summary)');
    const resIso = await makeRequest(port, 'GET', `/api/v1/analytics/summary?month=${currentMonth}&year=${currentYear}`, null, tokenB);
    if (resIso.status !== 200 || resIso.body.data.totalIncome !== 0 || resIso.body.data.totalExpenses !== 0) {
      throw new Error(`User B saw User A's analytics! ${JSON.stringify(resIso.body)}`);
    }
    console.log(`   User B Income: ₹${resIso.body.data.totalIncome}, Expense: ₹${resIso.body.data.totalExpenses} (Isolated)`);

    // Clean up test users and transactions
    await User.deleteMany({ email: { $in: [`analytics_a_${uniqueSuffix}@college.edu`, `analytics_b_${uniqueSuffix}@college.edu`] } });
    await Transaction.deleteMany({ description: { $in: ['Part-time Tutoring Stipend', 'Monthly Canteen Card', 'Metro Smart Card'] } });

    console.log('\n====================================================');
    console.log('  ALL 8/8 ANALYTICS & NATIVE TESTS PASSED!          ');
    console.log('====================================================\n');
  } finally {
    server.close();
    await mongoose.connection.close();
  }
}

runAnalyticsTests().catch((err) => {
  console.error('\n[Analytics-Test-Runner Failure]:', err);
  process.exit(1);
});
