# SpendWise Backend – Express.js & MongoDB REST API

This is the backend server for **SpendWise – Personal Expense Tracker**. It is designed with Node.js, Express.js, and MongoDB using Mongoose.

---

## 1. Directory Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js                        # MongoDB Mongoose connection
│   ├── controllers/
│   │   └── transactionController.js     # Transaction CRUD & validation logic
│   ├── middleware/
│   │   └── errorMiddleware.js           # 404 & Centralized error handler
│   ├── models/
│   │   ├── User.js                      # User Mongoose model
│   │   ├── Transaction.js               # Transaction Mongoose model
│   │   └── Budget.js                    # Budget Mongoose model
│   ├── routes/
│   │   ├── transactionRoutes.js         # /api/v1/transactions routes
│   │   ├── authRoutes.js                # Placeholder for Phase 7
│   │   └── budgetRoutes.js              # Placeholder for Phase 9
│   ├── app.js                           # Express application configuration
│   └── server.js                        # Server entry point & port listener
├── test/
│   └── api.test.js                      # Automated API endpoint test suite
├── .env.example                         # Environment configuration template
├── .gitignore                           # Ignored files (node_modules, .env)
└── package.json                         # Node dependencies & npm scripts
```

---

## 2. API Endpoints

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/api/v1/health` | Service health check | Implemented (Phase 6) |
| `POST` | `/api/v1/transactions` | Create a new transaction | Implemented (Phase 6) |
| `GET` | `/api/v1/transactions` | List transactions with filters & pagination | Implemented (Phase 6) |
| `GET` | `/api/v1/transactions/:id` | Get single transaction by ID | Implemented (Phase 6) |
| `PUT` | `/api/v1/transactions/:id` | Update transaction by ID | Implemented (Phase 6) |
| `DELETE` | `/api/v1/transactions/:id` | Delete transaction by ID | Implemented (Phase 6) |
| `ALL` | `/api/v1/auth/*` | User Auth & JWT endpoints | Placeholder (Phase 7) |
| `ALL` | `/api/v1/budgets/*` | Monthly budget management | Placeholder (Phase 9) |

---

## 3. How to Run Locally

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```

3. Start server:
   ```bash
   npm start
   # or for auto-reload during development:
   npm run dev
   ```

4. Run automated test suite:
   ```bash
   npm test
   ```
