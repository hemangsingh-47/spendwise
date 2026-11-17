# SpendWise – Personal Expense Tracker

SpendWise is a personal finance and expense tracking mobile application built with **React Native (Expo)**, **Node.js**, **Express.js**, and **MongoDB**. Designed with a minimal black-and-white fintech aesthetic, it helps college students and young professionals track daily transactions, establish category-level monthly budgets, visualize cashflow trends with interactive analytics, upload receipt photos, and manage their personal profile securely.

---

## 📱 Features

- **Authentication & Security:**
  - Secure registration and login with JWT token persistence via AsyncStorage.
  - Salted password hashing with `bcrypt` (10 rounds).
  - Cross-user data isolation: every transaction, budget, and report strictly belongs to the authenticated user.
  - Profile management: update display name, preferred currency, and change account passwords.
- **Dynamic Cashflow Dashboard:**
  - Real-time Net Balance card showing live funds.
  - Inflow and outflow summary cards.
  - Quick action buttons (Add Expense, Add Income, All Records).
  - Monthly inflow vs. outflow summary overview.
  - Recent transactions list with navigation.
- **Transaction Management:**
  - Full CRUD operations: Create, Read, Update, and Delete income and expense entries.
  - Search by title or notes in real-time.
  - Filter transactions by type (All, Income, Expense) and category (Food, Transport, Education, etc.).
  - Pull-to-refresh on FlatLists synced with live MongoDB data.
- **Advanced Budgeting:**
  - Monthly and category-wise budget limits with real-time spending calculations.
  - Visual status progress tracks with three threshold levels:
    - Normal (`< 80%`)
    - Warning (`80% – 99%`)
    - Exceeded (`>= 100%`)
  - Duplicate budget prevention via MongoDB unique compound indexes.
- **Financial Analytics & Cashflow Trends:**
  - Key financial metrics: Monthly Inflow, Outflow, Net Savings, and Savings Rate percentage.
  - Month-over-month comparison indicating percentage increase or decrease.
  - 6-Month cashflow trend bar chart comparing monthly income vs. expenses.
  - Segmented category distribution track and itemized spending breakdown.
- **Receipt Photo Attachment:**
  - Capture receipts via camera or pick from the device photo gallery.
  - Multer middleware validating 5MB image limit and MIME types (JPEG, PNG, WebP).
  - Cloudinary cloud upload integration with automatic local disk storage fallback.
- **Local Notifications:**
  - Device-level notifications triggered when spending reaches 80% or 100% of a budget limit.
  - Duplicate prevention mechanism ensuring only one alert fires per category threshold per month.
- **Interactive Slide Navigation Drawer:**
  - Native gesture-driven side drawer with edge-swipe opening.
  - Fast shortcuts to all tabs, viva diagnostic tools, and account sign out.

---

## 🛠️ Technology Stack

### Frontend (Mobile App)
- **Framework:** React Native (Expo SDK 58)
- **Language:** JavaScript (ES6+, Functional Components & Hooks)
- **Navigation:** React Navigation (Native Stack, Bottom Tabs)
- **State Management:** React Context API (`AuthContext`, `TransactionContext`, `DrawerContext`)
- **HTTP Client:** Axios (configured with automated Bearer token injection and error handling)
- **Local Storage:** `@react-native-async-storage/async-storage`
- **Native Modules:** `expo-image-picker`, `expo-notifications`, `expo-status-bar`
- **Icons:** `@expo/vector-icons` (Ionicons)
- **Styling:** React Native `StyleSheet` with centralized fintech monochrome palette

### Backend (REST API)
- **Runtime:** Node.js (v20+ / v22+)
- **Framework:** Express.js (v4.21+)
- **Database:** MongoDB & Mongoose ODM (v8.9+)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **File Uploads:** `multer` & `cloudinary`
- **CORS & Environment:** `cors` & `dotenv`
- **Testing:** Standalone Node.js integration test runner with ephemeral HTTP servers

---

## 🎨 Minimal Fintech Design Palette

SpendWise follows a high-contrast monochrome design system:

| Color Role | Hex Code | Purpose |
|---|---|---|
| **Black** | `#000000` | Primary buttons, active tabs, header icons, text emphasis |
| **Dark** | `#171717` | Card headings, high-priority labels |
| **Dark Grey** | `#404040` | Secondary icons, subtitle headers |
| **Fintech Grey** | `#737373` | Metadata, date labels, transaction counts |
| **Light Grey** | `#A3A3A3` | Disabled elements, subtle borders |
| **Border** | `#E5E5E5` | Structural dividers and card outlines |
| **Background** | `#F5F5F5` | Main application screen backdrop |
| **Card** | `#FAFAFA` | Elevated surfaces and containers |
| **White** | `#FFFFFF` | Primary card backgrounds, button text |

---

## 📂 Project Directory Structure

```text
SpendWise/
│
├── assets/                          # App icons, splash screens, and mock receipts
├── backend/                         # Node.js & Express REST API
│   ├── src/
│   │   ├── config/                  # Database (db.js) & Cloudinary configuration
│   │   ├── controllers/             # authController, transactionController, budgetController, analyticsController
│   │   ├── middleware/              # authMiddleware, uploadMiddleware, errorMiddleware
│   │   ├── models/                  # User.js, Transaction.js, Budget.js
│   │   ├── routes/                  # authRoutes, transactionRoutes, budgetRoutes, analyticsRoutes
│   │   ├── app.js                   # Express app setup and middleware mounting
│   │   └── server.js                # Server entry point with IP network logging
│   ├── test/                        # Automated test suites (api, auth, budget, analytics, phase11)
│   ├── .env.example                 # Example backend environment variables
│   ├── render.yaml                  # Render cloud deployment configuration
│   └── package.json                 # Backend dependencies & test scripts
│
├── src/                             # React Native mobile source code
│   ├── components/                  # Reusable UI components
│   │   ├── charts/                  # MonthlyBarChart.js, CategoryPieChart.js
│   │   ├── dashboard/               # BalanceCard, SummaryCard, TransactionItem, QuickActions
│   │   └── navigation/              # SlideDrawer.js
│   ├── constants/                   # api.js, routes.js
│   ├── context/                     # AuthContext.js, TransactionContext.js, DrawerContext.js
│   ├── navigation/                  # AuthNavigator.js, MainTabNavigator.js, navigationRef.js
│   ├── screens/                     # Dashboard, Transactions, Budgets, Analytics, Profile, Add/Edit
│   ├── services/                    # api.js, authService, transactionService, budgetService, analyticsService, notificationService
│   ├── styles/                      # theme.js (monochrome design tokens)
│   └── utils/                       # currency.js, validators.js
│
├── docs/                            # Documentation & Viva study material
│   ├── DEVELOPMENT_NOTES.md         # Detailed logs, Hinglish explanations, 65 viva Q&As
│   ├── PROJECT_ARCHITECTURE.md      # Data flows, sequence diagrams, security architecture
│   └── PHASE_TRACKER.md             # 12-phase milestone verification tracker
│
├── App.js                           # Root application component mounting providers
├── app.json                         # Expo configuration (package: com.hemangsingh.spendwise)
├── eas.json                         # EAS Build configuration for APK generation
├── package.json                     # Frontend dependencies
└── README.md                        # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn
- MongoDB (running locally at `mongodb://localhost:27017` or via MongoDB Atlas connection URI)
- Expo Go app on your physical mobile phone (Android / iOS)

---

### Step 1: Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env

# 4. Start the backend server
npm start
```

The backend server will run at:
- **Local:** `http://localhost:5000/api/v1/health`
- **Network (Wi-Fi):** `http://<YOUR_LOCAL_IP>:5000/api/v1/health`

---

### Step 2: Frontend Setup
```bash
# 1. From project root directory, install dependencies
npm install

# 2. Start the Expo development server
npx expo start
```

- **Physical Android Phone:** Scan the QR code displayed in your terminal using the **Expo Go** application. Ensure your phone and PC are connected to the same Wi-Fi network.
- **Android Emulator:** Press `a` in the terminal to launch on an active Android Virtual Device (AVD).

---

## 🧪 Automated Testing

SpendWise contains automated integration test suites validating all API endpoints, JWT security, data isolation, and calculations against real MongoDB instances:

```bash
# Run all 5 backend test suites
npm test --prefix backend
```

### Test Coverage Summary (67 / 67 Tests Passed)
1. **API Integration Suite (`api.test.js`):** 11/11 Passed (Transactions CRUD, input validations, negative amount rejection, ObjectId casting).
2. **Auth & Security Suite (`auth.test.js`):** 14/14 Passed (User registration, duplicate email handling, login authentication, invalid tokens, bcrypt hash verification).
3. **Budget Management Suite (`budget.test.js`):** 15/15 Passed (Monthly limit CRUD, duplicate category constraints, real-time spending calculations, 80%/100% threshold states).
4. **Analytics & Native Suite (`analytics.test.js`):** 8/8 Passed (Monthly aggregation, net savings, 6-month trends, category breakdowns, receipt metadata).
5. **Phase 11 Multi-User Security & Diagnostics (`phase11.test.js`):** 19/19 Passed (Cross-user data isolation, profile updates, password change verification, health check secret protection).

---

## 📡 REST API Summary

All endpoints (except health and public auth) require the `Authorization: Bearer <JWT_TOKEN>` header:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/health` | Service health status and uptime | No |
| `POST` | `/api/v1/auth/register` | Register new user account | No |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain JWT | No |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | **Yes** |
| `PUT` | `/api/v1/auth/profile` | Update user display name & preferred currency | **Yes** |
| `POST` | `/api/v1/auth/change-password` | Change account password with bcrypt | **Yes** |
| `GET` | `/api/v1/transactions` | Fetch user transactions (filterable) | **Yes** |
| `POST` | `/api/v1/transactions` | Record a new expense or income | **Yes** |
| `GET` | `/api/v1/transactions/:id` | Fetch specific transaction details | **Yes** |
| `PUT` | `/api/v1/transactions/:id` | Update an existing transaction | **Yes** |
| `DELETE` | `/api/v1/transactions/:id` | Delete transaction & associated photo | **Yes** |
| `POST` | `/api/v1/transactions/:id/receipt` | Upload receipt photo (Multer / Cloudinary) | **Yes** |
| `DELETE` | `/api/v1/transactions/:id/receipt` | Remove receipt photo from transaction | **Yes** |
| `GET` | `/api/v1/budgets` | Fetch active category budgets for a month | **Yes** |
| `POST` | `/api/v1/budgets` | Create category monthly budget limit | **Yes** |
| `PUT` | `/api/v1/budgets/:id` | Update budget target limit | **Yes** |
| `DELETE` | `/api/v1/budgets/:id` | Delete budget limit | **Yes** |
| `GET` | `/api/v1/analytics/summary` | Cashflow overview (Income, Expenses, Savings) | **Yes** |
| `GET` | `/api/v1/analytics/monthly` | 6-Month cashflow trend dataset | **Yes** |
| `GET` | `/api/v1/analytics/categories` | Monthly category spending distribution | **Yes** |

---

## ☁️ Deployment Configuration

### Backend Deployment (Render)
SpendWise includes `backend/render.yaml` for automated Web Service deployment on [Render](https://render.com/):
1. Connect your GitHub repository to Render.
2. Create a new Web Service using Blueprint or Web Service option.
3. Set the Root Directory to `backend`.
4. Configure the environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI` (your MongoDB Atlas connection string)
   - `JWT_SECRET` (secure random string)
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_ORIGIN=*`
5. The service will build via `npm install` and run via `npm start`.

### Frontend Production Backend Connection
In production builds, set the backend URL via:
```bash
EXPO_PUBLIC_API_URL=https://your-backend-service.onrender.com/api/v1
```
The app will automatically communicate with the deployed cloud backend rather than the local IP address.

---

## 🎓 College Course Context

- **Course:** Mobile Application Development using React Native (Semester 3 / CSE)
- **Student:** Hemang Singh (Second-year Computer Science Engineering)
- **Topics Covered:**
  - Unit 1: React Native Core Components & Styling
  - Unit 2: Navigation & Multi-screen Workflows
  - Unit 3: REST API Integration, Context API, Local Storage (`AsyncStorage`)
  - Unit 4: Camera (`expo-image-picker`), Notifications (`expo-notifications`), File Storage
  - Unit 5: Performance Optimization & State Management
  - Unit 6: Automated Testing, Multi-user Security, and Deployment Preparation

---

## 📄 License
This project is licensed under the MIT License.
