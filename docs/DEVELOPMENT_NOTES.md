# SpendWise – Development Notes & Viva Preparation Guide

This document contains step-by-step development logs, conceptual explanations in simple Hinglish, and viva questions with answers. It is tailored for college assignments and oral viva examinations.

---

# PHASE 1: PROJECT SETUP & ARCHITECTURE

## 1. What We Built & Configured
- Initialized an Expo-managed React Native project using standard JavaScript.
- Configured project metadata in `app.json` (App Name: `SpendWise`, Slug: `spendwise`).
- Set up a clean folder structure (`src/components`, `src/screens`, `src/navigation`, `src/styles`, `src/utils`, `src/constants`, `docs/`).
- Verified dependencies (`expo`, `react`, `react-native`, `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`).
- Created initial minimal working screen displaying SpendWise metadata.

---

## 2. Core Concepts Explained (Hinglish Explanation)

### A. What is React Native?
- **English:** React Native is an open-source mobile application framework created by Meta (Facebook). It allows developers to build natively-rendering mobile apps for iOS and Android using JavaScript and React.
- **Hinglish:** React Native ek aisa framework hai jisse hum JavaScript aur React ka use karke Android aur iOS dono ke liye native apps bana sakte hain. Humein Java, Kotlin ya Swift alag-alag seekhne ki zaroorat nahi padti. Code ek baar likha jaata hai aur dono platforms par native components render hote hain.

### B. What is Expo?
- **English:** Expo is an open-source framework and platform for universal React applications. It wraps around React Native and provides developer tools, pre-configured build chains, and easy device testing via Expo Go without requiring Android Studio or Xcode initially.
- **Hinglish:** Expo React Native ka ek wrapper ya ecosystem hai jo setup ko bohot aasan bana deta hai. Expo Go app ke through hum apne real mobile phone par QR code scan karke live app test kar sakte hain bina heavy Android Studio install kiye.

### C. Why are we using JavaScript instead of TypeScript?
- **English:** JavaScript is dynamic, beginner-friendly, and has zero compilation/type-definition boilerplate, making it ideal for learning React Native fundamentals, rapid prototyping, and college vivas.
- **Hinglish:** JavaScript beginner-friendly hai. Isme complex data types aur interfaces ka extra syntax nahi hota, jisse 2nd year students easily concepts (jaise hooks, props, state, components) samajh sakte hain aur viva me confidently explain kar sakte hain.

### D. What is `App.js`?
- **English:** `App.js` is the root component of the React Native application. When Expo boots the app, it mounts `App.js` inside the root container.
- **Hinglish:** `App.js` hamare poore application ka main entry point (main gate) hota hai. App start hone par sabse pehle yahi file load hoti hai aur yahi se navigation aur screens render hoti hain.

### E. What is `package.json`?
- **English:** A manifest file containing project metadata, dependencies (external libraries), and run scripts (e.g., `npm start`, `npm run android`).
- **Hinglish:** `package.json` project ka ID card aur configuration file hai. Isme project ka naam, version, installed libraries (dependencies) aur run karne ke scripts store rehte hain.

### F. What is `node_modules`?
- **English:** The directory where npm downloads and stores all third-party libraries and transitive dependencies required by the project.
- **Hinglish:** Jab hum `npm install` chalate hain, toh saare downloaded packages `node_modules` folder me save hote hain. Yeh folder bohot heavy hota hai isliye isko `.gitignore` me daal kar Git par push nahi karte.

### G. What is `StyleSheet`?
- **English:** A React Native abstraction similar to CSS StyleSheets that optimizes style declaration, validates property keys, and converts style objects to internal IDs for performance.
- **Hinglish:** React Native me CSS files nahi hoti. Hum `StyleSheet.create({...})` use karke JavaScript objects ke through styling karte hain. Yeh syntax CSS jaisa lagta hai (camelCase jaise `backgroundColor`, `fontSize`) aur fast performance deta hai.

### H. Why are folders separated (`src/`, `components/`, `screens/`, `navigation/`)?
- **English:** Separation of concerns makes code modular, maintainable, testable, and reusable. Screens handle page-level views while components handle reusable UI widgets.
- **Hinglish:** Agar hum saara code ek hi file me likhenge toh code messy ho jayega aur bug dhundhna mushkil hoga. Folder separation se code organized rehta hai:
  - `components/` me chote reusable buttons aur inputs rehte hain.
  - `screens/` me poore page (Login, Register) rehte hain.
  - `styles/` me colors aur theme rehti hai.

### I. How to run the project?
1. Open terminal in the project root directory.
2. Run `npx expo start` or `npm start`.
3. Press `a` for Android Emulator, or scan the QR code using the **Expo Go** app on your physical Android phone.

---


# PHASE 2: UI DESIGN SYSTEM & REUSABLE COMPONENTS

## 1. What We Built
- Created `src/styles/theme.js` containing centralized design tokens:
  - Exact Black & White palette (`#000000`, `#171717`, `#404040`, `#737373`, `#A3A3A3`, `#E5E5E5`, `#F5F5F5`, `#FAFAFA`, `#FFFFFF`) plus subtle semantic feedback tokens (`#DC2626`, `#16A34A`).
  - Standardized typography scale (H1: 28, H2: 24, H3: 20, Body: 16, Secondary Body: 14, Caption: 12).
  - Consistent spacing scale (4, 8, 12, 16, 20, 24, 32).
  - Standard border radii (Small: 8, Medium: 12, Large: 16).
  - Standard layout constants (button height, input height, screen padding).
- Created reusable components in `src/components/`:
  - `Button.js` (Primary, Secondary, Disabled, Loading state, custom overrides).
  - `Input.js` (Label, Placeholder, SecureTextEntry toggle with Show/Hide, Focus outline, Error message).
  - `Card.js` (White & Card backgrounds, subtle border, rounded corners, soft shadow).
  - `ScreenContainer.js` (SafeAreaView wrapper, background fill, KeyboardAvoidingView, ScrollView for keyboard handling).
  - `Typography.js` (Reusable Text wrappers for H1, H2, H3, Body, SecondaryBody, Caption).
- Created `src/screens/DesignSystemPreviewScreen.js` to render and visually inspect all design system components together.

---

## 2. Core Concepts Explained (Hinglish Explanation)

### A. Why is a centralized `theme.js` useful?
- **English:** Centralizing styling tokens (colors, font sizes, margins) ensures visual consistency across all screens, prevents magic numbers/hex strings in code, and makes global style updates instant by modifying a single file.
- **Hinglish:** Agar hum har component me `#000000` ya `padding: 16` manually type karenge, toh app me inconsistency aayegi aur agar future me color change karna ho toh 50 jagah edit karna padega. `theme.js` me sab define karne se single place se poori app ka look & feel control ho jata hai (Single Source of Truth).

### B. How do reusable components work?
- **English:** Reusable components are modular React functional components designed to be used in multiple places with different data. They accept inputs via `props` and return JSX.
- **Hinglish:** Reusable components jaise `Button` ya `Input` ek template (saancha) ki tarah hote hain. Hum unhe ek baar banate hain aur poore project me baar-baar use karte hain. Har baar naye props (jaise title, onPress) pass karke unka content change kar lete hain.

### C. How do `props` work?
- **English:** Props (short for properties) are read-only inputs passed from a parent component to a child component, allowing components to be dynamic and customizable.
- **Hinglish:** Props parent component se child component me data pass karne ka tareeka hai (jaise function arguments). Example: `<Button title="Login" onPress={handleLogin} />` me `title` aur `onPress` props hain jo Button component ko batate hain ki kya text dikhana hai aur click par kya karna hai.

### D. How does `StyleSheet.create` work?
- **English:** `StyleSheet.create` validates style property names at runtime and sends the style object through the React Native bridge once, assigning integer IDs to optimize memory and rendering performance.
- **Hinglish:** Inline styles `style={{ color: 'red' }}` har render par naya object banate hain jo memory waste karta hai. `StyleSheet.create` styles ko optimize karke ek unique ID bana deta hai, jisse rendering bohot fast ho jati hai aur compile time par invalid CSS properties pakdi jati hain.

### E. How does component reuse save time?
- **English:** Instead of recreating layouts, buttons, and text fields on every screen, developers write the code once, test it once, and reuse it everywhere. Bug fixes made to the reusable component automatically apply across the entire application.
- **Hinglish:** Agar hum Login, Register aur Forgot Password teeno screens ke liye alag-alag button aur input code likhenge, toh code 3x ho jayega. Reusable component banane se ek baar code likho aur har jagah use karo. Agar input field me error aayi, toh bas `Input.js` theek karo, teeno screens automatically theek ho jayengi.

### F. Reusable Components Explanation (Hinglish breakdown):
1. **`Button` Component:** Yeh `TouchableOpacity` use karta hai. Isme `variant='primary'` me black background aur white text hota hai, `variant='secondary'` me white background aur black border hota hai. `loading={true}` dene par text ki jagah `ActivityIndicator` (loading spinner) dikhta hai.
2. **`Input` Component:** Isme `TextInput` ke sath label aur error message display hote hain. Password ke liye `showTogglePassword={true}` prop diya hai jisse user 'Show' ya 'Hide' button dabakar password dekh sakta hai. Jab input active hota hai, `onFocus` event se border black ho jata hai.
3. **`Card` Component:** Yeh content ko ek neat white box me pack karta hai jisme rounded border aur halka shadow hota hai, jisse content screen background se alag dikhta hai.
4. **`ScreenContainer` Component:** Yeh har screen ko wrap karta hai. Isme `SafeAreaView` mobile ke notch ya camera cut-out se bachata hai, aur `KeyboardAvoidingView` + `ScrollView` form bharte waqt keyboard se input fields ko chupne nahi dete.

---

# PHASE 3: AUTHENTICATION UI & NAVIGATION

## 1. What We Built
- **Screen 1: `LoginScreen.js`**
  - Minimal fintech branding with currency symbol (`₹`) and SpendWise title.
  - "Welcome back" heading and supporting description.
  - Email input field with auto-capitalization disabled and email keyboard layout.
  - Password input field with show/hide toggle.
  - "Forgot password?" navigation link.
  - Primary "Sign In" button with validation trigger.
  - "Don't have an account? Create account" link to switch to Register.
  - Direct shortcut link to view the Phase 2 Design System Preview.
- **Screen 2: `RegisterScreen.js`**
  - "Create account" heading and introductory subtitle.
  - Full Name input field.
  - Email input field with email validation.
  - Password input (min 6 characters) with show/hide toggle.
  - Confirm Password input with match checking.
  - Custom branded Terms & Conditions acceptance checkbox.
  - Primary "Create Account" button with comprehensive validation.
  - "Already have an account? Sign in" link back to Login.
- **Screen 3: `ForgotPasswordScreen.js`**
  - "Reset password" heading and informative instructions.
  - Email input field with validation.
  - "Send Reset Link" button.
  - "Back to Sign In" navigation link.
- **Validation Utilities (`src/utils/validation.js`):**
  - Beginner-friendly pure JS functions: `validateEmail`, `validatePassword`, `validateConfirmPassword`, `validateFullName`, `validateTerms`.
- **Navigation Architecture (`src/navigation/AuthNavigator.js`):**
  - React Navigation Native Stack Navigator configuring transitions between Login, Register, Forgot Password, and Design System Preview.

---

## 2. Core Concepts Explained (Hinglish Explanation)

### A. What is React Navigation?
- **English:** React Navigation is the standard routing and navigation library for React Native applications. It manages the app's history, screen stack, headers, gestures, and transitions.
- **Hinglish:** Mobile apps me browser ki tarah URL bar nahi hota. React Navigation wo library hai jo screen transition handle karti hai—jaise Login screen se button dabakar Register screen par jana ya back button dabakar pichli screen par aana.

### B. What is a Stack Navigator?
- **English:** A Stack Navigator provides a way for an app to transition between screens where each new screen is placed on top of a stack (like a deck of cards). Navigating forward pushes a screen; going back pops it.
- **Hinglish:** Stack Navigator Data Structures ke **Stack (LIFO - Last In First Out)** concept par kaam karta hai. Jab hum nayi screen kholte hain, toh wo puraani screen ke upar 'push' ho jati hai. Jab hum 'Back' dabate hain, toh top wali screen 'pop' hokar hat jaati hai.

### C. What is `useState`?
- **English:** `useState` is a core React Hook that allows functional components to store, track, and update dynamic state values. Calling the updater function triggers a re-render.
- **Hinglish:** `useState` ek React Hook hai jisse hum component ke andar dynamic data store karte hain. Jaise jab user input me type karta hai, toh `useState` us text ko state variable me save kar leta hai aur screen par updated value render karta hai.
  ```javascript
  const [email, setEmail] = useState('');
  ```

### D. How does `TextInput` work?
- **English:** `TextInput` is a foundational React Native component that allows users to enter text via the device's virtual keyboard.
- **Hinglish:** `TextInput` HTML ke `<input type="text">` jaisa hota hai. Iske through user text, email ya password type karta hai.

### E. What is `onChangeText`?
- **English:** An event callback prop on `TextInput` that fires every time the input's text changes, passing the new string directly as an argument.
- **Hinglish:** Web development me `onChange(e)` event me `e.target.value` nikalna padta hai. Par React Native ke `onChangeText` me seedha updated text string milti hai:
  ```javascript
  onChangeText={(text) => setEmail(text)}
  ```

### F. What is `secureTextEntry`?
- **English:** A boolean prop on `TextInput` that masks entered characters into dots or asterisks, protecting sensitive inputs like passwords.
- **Hinglish:** `secureTextEntry={true}` karne se password ke characters dots (••••) ban jaate hain taaki koi bagal se password na padh sake. Toggle button dabane par hum is boolean ko `true`/`false` switch karke show/hide karte hain.

### G. How does frontend validation work?
- **English:** Client-side validation checks whether user input meets required criteria (non-empty, email format, minimum password length) locally on the device before sending data or executing actions.
- **Hinglish:** User jab submit button dabata hai, hum JavaScript ke simple `if-else` aur regular expressions (regex) se check karte hain ki email khali toh nahi hai, format valid hai ya nahi, aur password 6 characters se bada hai ya nahi. Agar koi mistake hoti hai, toh screen par red error text dikha dete hain.

### H. How does navigation between screens work?
- **English:** React Navigation injects a `navigation` prop into each screen registered in the navigator. Calling `navigation.navigate('ScreenName')` pushes that route onto the stack.
- **Hinglish:** Har screen component ko automatically ek `navigation` prop milta hai. Jab user kisi link ya button par tap karta hai, hum `navigation.navigate(ROUTES.REGISTER)` call karte hain aur React Navigation user ko us screen par le jaata hai.

---

## 3. Hinglish Code Walkthrough

### Login Screen Walkthrough
```javascript
// Hum email aur password ke liye alag state banate hain
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});

const handleLogin = () => {
  // 1. Validation check
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password, 6);
  
  if (emailErr || passErr) {
    setErrors({ email: emailErr, password: passErr });
    return; // Agar error hai toh yahi ruk jao
  }
  
  // 2. Demo success alert
  Alert.alert('SpendWise Demo', 'Demo Login Successful!');
};
```

### Register Screen Walkthrough
```javascript
// Checkbox state maintain karna
const [termsAccepted, setTermsAccepted] = useState(false);

// Confirm password check karna
if (password !== confirmPassword) {
  newErrors.confirmPassword = 'Passwords do not match.';
}
```

---

# VIVA QUESTIONS & ANSWERS (TOP 12 FOR 2ND YEAR CSE)

### Q1. What is the difference between React and React Native?
**Answer:** React is a JavaScript library for building web user interfaces that render into the HTML DOM. React Native is a mobile framework that renders into real native mobile UI elements (Android `View`/`TextView`, iOS `UIView`/`UILabel`) without using webviews or HTML.

### Q2. What is JSX?
**Answer:** JSX stands for JavaScript XML. It allows developers to write UI markup that looks like XML/HTML directly within JavaScript code. Under the hood, Babel transforms JSX into `React.createElement()` calls.

### Q3. What is the role of `StyleSheet.create` in React Native?
**Answer:** `StyleSheet.create` validates styling rules, converts styles into internal integer identifiers, and caches them. This provides performance optimization over inline style objects which allocate new memory on every re-render.

### Q4. What is the difference between `props` and `state`?
**Answer:** `props` (properties) are immutable inputs passed from parent to child components. `state` is internal data managed within the component that can change over time using updater functions (e.g., `useState`).

### Q5. What is the difference between `ScrollView` and `FlatList`?
**Answer:** `ScrollView` renders all its child components into memory at once, which is fine for small forms. `FlatList` virtualizes data, rendering only the items currently visible on the screen, which is essential for performance when displaying long lists of expenses or transactions.

### Q6. How does React Navigation Stack work?
**Answer:** Stack Navigator operates on the Last-In-First-Out (LIFO) stack data structure. When a user navigates to a new screen, it is pushed onto the top of the stack. When the user taps back, the top screen is popped off to reveal the previous screen.

### Q7. Why do we use `KeyboardAvoidingView` in mobile forms?
**Answer:** On mobile devices, the virtual keyboard slides up and can obstruct form inputs and action buttons. `KeyboardAvoidingView` automatically adjusts screen height or position so inputs remain visible while typing.

### Q8. What is the purpose of `SafeAreaView` or `react-native-safe-area-context`?
**Answer:** Modern smartphones have physical notches, rounded screen corners, dynamic islands, and home indicator bars. `SafeAreaView` applies padding so that UI content does not overlap these physical hardware boundaries.

### Q9. Why is frontend validation important even if backend validation exists?
**Answer:** Frontend validation gives immediate visual feedback to the user without wasting mobile network bandwidth or making unnecessary API calls. It enhances user experience (UX) and reduces server load.

### Q10. What does `secureTextEntry` do in a `TextInput`?
**Answer:** `secureTextEntry` is a boolean prop on `TextInput` that masks entered characters into dots for sensitive data such as passwords. In SpendWise, we paired it with a toggle state so users can reveal or conceal their password.

### Q11. What is the purpose of `.gitignore` in a React Native Expo project?
**Answer:** It tells Git which files or directories to ignore and never push to GitHub. Important items ignored include `node_modules/` (heavy dependencies), `.expo/` (local cache), build folders, and `.env` files (confidential API keys and secrets).

### Q12. Why are we strictly adhering to frontend-only in Phase 1-3?
**Answer:** In professional software engineering and clean agile milestones, UI/UX architecture and responsive components are finalized first. Decoupling the frontend avoids backend dependency blockers and ensures that the design system and navigation flow are robust before connecting databases and REST APIs.

---


# PHASE 4: NAVIGATION & DASHBOARD UI

## 1. What We Built
- **Bottom Tab Navigation (`MainTabNavigator.js`):**
  - Integrated `@react-navigation/bottom-tabs` with clean Ionicons matching the monochrome theme.
  - 4 Main Tabs: **Home**, **Transactions**, **Budgets** (placeholder), and **Profile** (placeholder).
- **Dashboard Screen (`DashboardScreen.js`):**
  - **Header:** Personalized greeting, student demo name tag (`Hemang Singh`), current month label (`November 2026`), and profile avatar shortcut.
  - **BalanceCard:** Large prominent total balance card in dark monochrome style.
  - **SummaryCard:** Side-by-side cards displaying Total Inflow (`↑ Income`) and Outflow (`↓ Expenses`) with transaction counts.
  - **QuickActionButton:** Fast access buttons to Add Expense, Add Income, and View All Transactions.
  - **Monthly Overview Card:** Detailed breakdown of inflow, outflow, and net remaining savings.
  - **Recent Transactions Section:** Displays the 5 most recent transactions with subtle badges, dates, and amounts.
- **Separate Mock Data File (`src/data/mockTransactions.js`):**
  - Clearly marked temporary mock transaction data to allow immediate UI preview without mixing into backend services.

---

## 2. Core Concepts Explained (Hinglish Explanation)

### A. Bottom Tab Navigation vs Stack Navigation
- **English:** Bottom Tab Navigation keeps primary destinations permanently accessible at the bottom of the screen. Stack Navigation manages hierarchical deep-dive screens (e.g. going from list to details).
- **Hinglish:** Bottom Tab Navigation mobile app ke main sections (Home, Transactions, Budgets, Profile) ke beech switch karne ke kaam aati hai jo screen ke bottom me hamesha dikhti hai. Jabki Stack Navigation ek ke upar ek screen push karne ke liye hoti hai (jaise Transaction tap karne par Details screen khulna).

### B. FlatList vs ScrollView in Dashboard
- **English:** ScrollView is suitable for fixed-length layout containers with diverse sections (like our dashboard), whereas FlatList is optimized for potentially long dynamic data lists using item virtualization.
- **Hinglish:** Dashboard me humne `ScrollView` use kiya kyunki wahan limited widgets hain (Header, BalanceCard, QuickActions, Overview). Par jab hum lambi list render karte hain (jaise Transactions tab me), tab hum `FlatList` use karte hain taaki memory save ho aur app smooth chale.

### C. Dashboard Data Flow
- **English:** Dashboard consumes the centralized `TransactionContext`. Derived values (total balance, total income, total expenses) are computed automatically using `useMemo`, ensuring fast performance and instant synchronization when transactions are added or edited.
- **Hinglish:** Dashboard koi hardcoded data display nahi karta. Yeh `useTransactions()` hook se data leta hai. Jab user koi naya expense add karta hai, toh Context ka state change hota hai aur Dashboard ka balance automatically recalculate ho kar real-time update ho jaata hai.

---

# PHASE 5: TRANSACTION MANAGEMENT UI (CRUD)

## 1. What We Built
- **Transactions Screen (`TransactionsScreen.js`):**
  - Search bar to search by description or category in real-time.
  - Type filter tabs: All, ↑ Income, ↓ Expense.
  - Category filter pills horizontally scrollable: Food, Transport, Shopping, Education, Entertainment, Health, Bills, Salary, Freelance, Other.
  - Empty state with illustration and quick "Add New Transaction" button.
  - Loading and Error state containers.
- **Add Transaction Screen (`AddTransactionScreen.js`):**
  - Dynamic type selector (Income vs Expense).
  - Validated numeric amount input.
  - Category selection pills tailored to chosen type.
  - Description and date inputs.
  - Payment method picker (UPI, Cash, Debit Card, Credit Card, Net Banking).
- **Edit Transaction Screen (`EditTransactionScreen.js`):**
  - Loads existing transaction values into controlled inputs via `useEffect`.
  - Allows editing type, amount, category, description, and date with full validation.
- **Transaction Details Screen (`TransactionDetailsScreen.js`):**
  - Full record breakdown with formatted currency, record ID, and timestamps.
  - Edit shortcut button.
  - Delete button with confirmation alert before removal.
- **State Management (`src/context/TransactionContext.js`):**
  - Pure React Context API providing global transaction state, `addTransaction`, `editTransaction`, `deleteTransaction`, and `getTransactionById`.

---

## 2. Core Concepts Explained (Hinglish Explanation)

### A. Controlled Inputs in React Native
- **English:** A controlled input is a `TextInput` whose value is tied to React state and updated via `onChangeText`. React serves as the single source of truth for the input field.
- **Hinglish:** Controlled input me input box ki value directly component ke state se bandhi hoti hai (`value={amount}`). Jab user type karta hai, `onChangeText` state ko update karta hai. Isse hum validation aur formatting real-time control kar sakte hain.

### B. Context API for State Management
- **English:** React Context provides a way to share data across the entire component tree without having to pass props down manually at every level (avoiding "prop drilling").
- **Hinglish:** Context API ek global storage box ki tarah hai. Agar humein Dashboard aur Transactions tab dono me transactions ka data chahiye, toh humein props se pass karne ki zaroorat nahi hai. Hum `TransactionProvider` bana kar usme saara data aur functions rakh dete hain, aur koi bhi screen `useTransactions()` likh kar use access kar sakti hai.

### C. Client-Side CRUD Operations
- **English:** CRUD stands for Create, Read, Update, Delete. In Phase 5, these are performed in memory inside React state before server sync in later phases.
- **Hinglish:**
  - **Create:** User form bharta hai aur `addTransaction()` nayi transaction ko array ke shuru me daal deta hai (`[newTx, ...prev]`).
  - **Read:** `FlatList` array ko iterate karke screen par display karti hai.
  - **Update:** `editTransaction()` array me target ID dhundh kar `map()` ke through uske fields update kar deta hai.
  - **Delete:** `deleteTransaction()` `filter()` method use karke us transaction ko array se remove kar deta hai.

---

# PHASE 6: BACKEND INFRASTRUCTURE & MONGODB APIS

## 1. What We Built
- **Backend Directory (`backend/`):**
  - Separated from the mobile client to establish clean frontend-backend boundary.
  - `package.json` with `express`, `mongoose`, `cors`, and `dotenv`.
  - `.env.example` defining `PORT`, `MONGODB_URI`, and `CLIENT_ORIGIN`.
- **Database Connection (`backend/src/config/db.js`):**
  - Mongoose connection pool with graceful timeout and connection event logging.
- **Mongoose Data Models (`backend/src/models/`):**
  - `User.js`: Schema for users (name, email, password, currency, timestamps).
  - `Transaction.js`: Schema for transactions (userId ref, type, amount > 0, category, description, date, paymentMethod, compound index).
  - `Budget.js`: Schema for budgets (userId ref, category, limit, month, year, unique compound index on userId + category + month + year).
- **Transaction REST APIs (`backend/src/controllers/transactionController.js`):**
  - `POST /api/v1/transactions`: Creates and validates transactions.
  - `GET /api/v1/transactions`: Fetches transactions with query filtering (`type`, `category`) and pagination (`page`, `limit`).
  - `GET /api/v1/transactions/:id`: Retrieves single transaction; validates ObjectId format.
  - `PUT /api/v1/transactions/:id`: Updates fields with validation.
  - `DELETE /api/v1/transactions/:id`: Deletes record.
- **Centralized Error Middleware (`backend/src/middleware/errorMiddleware.js`):**
  - Unified JSON error responses for CastError, ValidationError, duplicate key, and 404s.
- **Automated Test Suite (`backend/test/api.test.js`):**
  - Complete test script executing 11/11 tests against live MongoDB and reporting results.

---

## 2. Core Concepts Explained (Hinglish Explanation)

### A. What is Node.js and Express.js?
- **English:** Node.js is a JavaScript runtime environment that lets developers run JavaScript on the server outside a web browser. Express.js is a minimalist web framework for Node.js that provides routing, middleware, and HTTP request handling.
- **Hinglish:** Node.js humein JavaScript ko server side par run karne ki power deta hai (jaise C++ ya Java backend me kaam aati hai). Express.js Node ka ek framework hai jisse hum REST APIs (endpoints jaise GET, POST) bohot aasaani se bana sakte hain.

### B. What is MongoDB and Mongoose?
- **English:** MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js that manages data relationships, schemas, and validations.
- **Hinglish:** MongoDB ek NoSQL database hai jisme tables aur rows ki jagah JSON jaise documents me data store hota hai. Mongoose ek library hai jo data ka schema (rules) define karti hai—jaise amount number hona chahiye, category required honi chahiye, etc.

### C. What is a REST API and HTTP Methods?
- **English:** REST (Representational State Transfer) is an architectural style for network applications using standard HTTP request methods:
  - `GET`: Retrieve data from server.
  - `POST`: Create new data on server.
  - `PUT`: Update existing data completely or partially.
  - `DELETE`: Remove data from server.
- **Hinglish:** REST API ek rulebook hai jisse frontend (React Native) aur backend (Express) aapas me baat karte hain. Frontend HTTP request bhejta hai aur backend JSON data return karta hai:
  - Jab user naya transaction submit kare -> `POST`
  - Jab user transactions list mangwaye -> `GET`
  - Jab user edit kare -> `PUT`
  - Jab user delete kare -> `DELETE`

### D. What is Middleware?
- **English:** Middleware functions in Express are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle.
- **Hinglish:** Middleware ek security guard ya checkpoint ki tarah hota hai jo request aane par aur response jaane se pehle beech me execute hota hai. Jaise `express.json()` incoming request body ko parse karta hai, aur `errorMiddleware` errors ko pakad kar clean format me bhejta hai.

### E. What is CORS?
- **English:** CORS (Cross-Origin Resource Sharing) is an HTTP-header based security mechanism that allows a server to indicate any origins other than its own from which a browser or mobile app is permitted to load resources.
- **Hinglish:** Security ke liye browsers aur servers anjaan origins ki requests ko block kar dete hain. `cors()` middleware use karke hum Express server ko batate hain ki hamari React Native app se aane wali requests safe hain aur unhe accept karo.

### F. What is MVC Architecture?
- **English:** Model-View-Controller separates an application into three main components: Model (Database schema & queries), View (Frontend React Native UI), and Controller (Express business logic).
- **Hinglish:** MVC code ko 3 hisson me baant ta hai:
  - **Model (`src/models/`):** Database ka blueprint aur structure (User, Transaction).
  - **View (`src/screens/`):** Jo user ko mobile screen par dikhta hai.
  - **Controller (`src/controllers/`):** Jo data ko process karta hai aur model aur view ke beech communication karwata hai.

---

# PHASE 7: BACKEND AUTHENTICATION & SECURITY (JWT & BCRYPT)

## 1. What We Built & Configured
- **Dependencies Installed:** `bcryptjs` (password hashing) and `jsonwebtoken` (JWT token creation and verification) in `backend/package.json`.
- **Environment Variables:** Configured `JWT_SECRET` and `JWT_EXPIRES_IN=7d` in `backend/.env` and `backend/.env.example`.
- **User Model Security (`backend/src/models/User.js`):**
  - Added Mongoose pre-save hook to hash plain-text passwords using `bcrypt.genSalt(10)` and `bcrypt.hash()`.
  - Added instance method `matchPassword(enteredPassword)` using `bcrypt.compare()`.
  - Added `toSafeObject()` helper to exclude password hash from JSON responses.
- **JWT Token Generator (`backend/src/utils/generateToken.js`):**
  - Signs payload `{ id: userId }` using HMAC SHA-256 with expiration.
- **Auth Middleware (`backend/src/middleware/authMiddleware.js`):**
  - Extracts HTTP Authorization header formatted as `Bearer <token>`.
  - Verifies token integrity with `jwt.verify(token, process.env.JWT_SECRET)`.
  - Fetches user from MongoDB (`User.findById(decoded.id).select('-password')`) and binds it to `req.user`.
  - Returns structured `401 Unauthorized` for missing, expired, or tampered tokens.
- **Auth Controller & Routes (`backend/src/controllers/authController.js`, `backend/src/routes/authRoutes.js`):**
  - `POST /api/v1/auth/register`: Validates name, email, password; creates user; returns JWT token.
  - `POST /api/v1/auth/login`: Verifies email and password; returns JWT token + user profile.
  - `GET /api/v1/auth/me`: Protected route returning currently authenticated user profile.
  - `PUT /api/v1/auth/profile`: Protected route updating name and preferred currency.
  - `POST /api/v1/auth/change-password`: Protected route verifying current password before hashing new password.
- **Strict Data Isolation in Transactions (`backend/src/controllers/transactionController.js`):**
  - Replaced temporary fallback userId with verified `req.user._id`.
  - All database queries (`find`, `findById`, `findByIdAndUpdate`, `findOneAndDelete`) enforce `{ userId: req.user._id }`.
  - A user cannot view, edit, or delete another user's transactions (returns `404 Not Found`).
- **Automated Test Suite (`backend/test/auth.test.js`):**
  - 14 automated tests verifying user registration, duplicate email rejection, invalid password rejection, unauthorized route access, token verification, cross-user isolation, and bcrypt hash format.

---

## 2. Core Concepts Explained (Hinglish Explanation)

### A. Authentication vs Authorization
- **English:** Authentication verifies *who you are* (e.g. logging in with email and password). Authorization verifies *what you are allowed to do* (e.g. accessing only your own transactions and not another student's).
- **Hinglish:**
  - **Authentication (Pehchan):** User kon hai? Yeh check karna. Jaise College gate par ID card dikhana ya app me email/password daal kar login karna.
  - **Authorization (Ijazat / Permissions):** User kya kar sakta hai? Login hone ke baad kya Hemang kisi doosre student Rahul ka expense dekh sakta hai? Bilkul nahi! Har user sirf apna data access kar sakta hai.

### B. What is a JSON Web Token (JWT)?
- **English:** A JWT is a compact, URL-safe token format consisting of three parts separated by dots: Header (algorithm), Payload (claims like `userId`), and Signature (cryptographic hash preventing tampering).
- **Hinglish:** JWT ek digitally signed digital pass (token) hota hai. Isme 3 hisse hote hain:
  1. **Header:** Batata hai ki token kis algorithm se sign hua hai (jaise HS256).
  2. **Payload:** Isme user ki ID aur expiry time rehta hai.
  3. **Signature:** Yeh backend ke secret key (`JWT_SECRET`) se banta hai.
  Jab user login karta hai, server use JWT deta hai. Agli baar mobile app har request ke header me yeh token bhejti hai. Server bina database me session save kiye token verify kar leta hai (Stateless Authentication).

### C. Why do we hash passwords with bcrypt?
- **English:** Storing plain-text passwords is a severe security vulnerability. Bcrypt is an adaptive one-way cryptographic hashing function incorporating random salts and high computational work factors, protecting against rainbow table and brute-force attacks.
- **Hinglish:** Agar database hack ho jaye ya koi inspect kare, toh kisi ka password plain text (jaise `password123`) me nahi dikhna chahiye. `bcrypt` password ko ek irreversible string me convert kar deta hai (jaise `$2b$10$e7...`). Salt add karne se do users ka same password hone par bhi database me alag hash banta hai. Hum kabhi password decrypt nahi karte; login ke waqt naye input ko hash karke purane hash se compare karte hain (`bcrypt.compare`).

### D. How does `authMiddleware` work?
- **English:** An Express middleware function that intercepts incoming requests, reads the `Authorization: Bearer <token>` header, verifies the signature, and attaches `req.user`. If invalid, it short-circuits the pipeline with a 401 response.
- **Hinglish:** `authMiddleware` ek security guard ki tarah kaam karta hai. Protected routes se pehle yeh check karta hai ki request me valid token hai ya nahi. Agar token valid hai, toh token se user ki ID nikal kar `req.user` me attach kar deta hai aur `next()` call karta hai. Agar token galat ya gayab ho, toh request controller tak pahunchne se pehle hi 401 error ke sath reject ho jaati hai.

### E. Why must the server NEVER trust a client-supplied `userId`?
- **English:** Accepting `userId` from request parameters or bodies allows malicious clients to change the ID (Insecure Direct Object Reference - IDOR) and access or delete records belonging to other users.
- **Hinglish:** Agar server mobile client ke bheje hue `userId` par bharosa karega, toh koi bhi hacker Postman se kisi aur ki user ID bhej kar uska bank balance ya transactions delete kar dega! Isliye server humesha verified JWT token se hi `req.user._id` nikalta hai.

---

# PHASE 8: MOBILE API & CONTEXT INTEGRATION

## 1. What We Built & Configured
- **Frontend Dependencies Installed:** `axios` (HTTP client) and `@react-native-async-storage/async-storage` (persistent key-value storage).
- **Centralized API Constants (`src/constants/api.js`):**
  - Defines `API_BASE_URL` with auto-detection for Android Emulator (`http://10.0.2.2:5000/api/v1`), iOS Simulator (`http://localhost:5000/api/v1`), and physical devices via local IP.
  - Defines consistent storage keys (`@spendwise_token`, `@spendwise_user`).
- **Axios Networking Service (`src/services/api.js`):**
  - Configured with `timeout: 10000` (10 seconds) and `Content-Type: application/json`.
  - **Request Interceptor:** Automatically attaches `Authorization: Bearer <token>` from in-memory cache or AsyncStorage on every outgoing request.
  - **Response Error Interceptor:** Formats server error messages and catches 401 expired sessions.
- **Auth Service (`src/services/authService.js`):**
  - Functions for `register`, `login`, `getMe`, `updateProfile`, `changePassword`, `saveToken`, `clearToken`.
- **Transaction Service (`src/services/transactionService.js`):**
  - Functions for `getTransactions`, `getTransactionById`, `createTransaction`, `updateTransaction`, `deleteTransaction`.
- **Auth Context (`src/context/AuthContext.js`):**
  - Restores session on app startup by reading saved JWT from AsyncStorage and validating with `GET /api/v1/auth/me`.
  - Provides `login`, `register`, `logout`, `updateProfile`, and `changePassword` methods across the app.
- **Transaction Context Live MongoDB Integration (`src/context/TransactionContext.js`):**
  - Syncs directly with Express backend REST APIs when `isAuthenticated` is true.
  - Normalizes MongoDB `_id` to standard `id` for seamless UI compatibility.
  - Calculates live `totalBalance`, `totalIncome`, and `totalExpenses` via `useMemo`.
  - Exposes `refreshTransactions` for pull-to-refresh.
- **Connected Screens:**
  - `LoginScreen.js`: Uses real backend login, displays server errors, navigates to dashboard on success.
  - `RegisterScreen.js`: Creates real user in MongoDB, saves JWT token, initializes session.
  - `DashboardScreen.js`: Displays authenticated user name, real calculated balance, pull-to-refresh `RefreshControl`.
  - `TransactionsScreen.js`: Live transaction list from MongoDB with pull-to-refresh on `FlatList`.
  - `AddTransactionScreen.js`: Sends `POST /api/v1/transactions` to MongoDB with loading spinner.
  - `EditTransactionScreen.js`: Sends `PUT /api/v1/transactions/:id` to MongoDB with loading spinner.
  - `TransactionDetailsScreen.js`: Sends `DELETE /api/v1/transactions/:id` to MongoDB with confirmation prompt.
  - `ProfilePlaceholderScreen.js`: Real user profile details, currency display, change password, and functional `logout()`.
  - `AuthNavigator.js`: Protected navigation flow showing loading splash during session restore, rendering Auth stack when unauthenticated and MainApp stack when authenticated.

---

## 2. Core Concepts Explained (Hinglish Explanation)

### A. Why Axios instead of native `fetch()`?
- **English:** Axios automatically transforms JSON request and response payloads, handles HTTP error codes predictably (rejecting promises on 4xx/5xx), supports request/response interceptors, and allows default headers (like Bearer tokens) to be configured globally.
- **Hinglish:** Native `fetch()` me response aane ke baad manually `await response.json()` karna padta hai aur `400` ya `500` status par bhi error throw nahi hota (`response.ok` check karna padta hai). `Axios` automatic JSON parsing deta hai, errors ko cleanly catch block me bhejta hai, aur **Interceptors** provide karta hai jisse hum har request ke sath JWT token automatically attach kar sakein.

### B. What is an Axios Interceptor?
- **English:** Middleware for HTTP requests and responses. A request interceptor runs before a request leaves the device (ideal for injecting the Bearer token), and a response interceptor runs before the response reaches calling code (ideal for global error formatting).
- **Hinglish:** Interceptor ek automated toll plaza ya checkpost ki tarah hota hai. Jab bhi app server ko koi request bhejti hai, request interceptor beech me aakar Authorization header me `Bearer <token>` chipka deta hai. Humein har API call me token manually pass karne ki zaroorat nahi padti!

### C. What is AsyncStorage and how does it compare to `localStorage`?
- **English:** AsyncStorage is an asynchronous, unencrypted, persistent, key-value storage system for React Native (similar to browser `localStorage`, but operations are asynchronous and return Promises).
- **Hinglish:** Web development me hum `localStorage.setItem()` use karte hain. Mobile apps me hum `@react-native-async-storage/async-storage` use karte hain. Jab user app band kar deta hai ya phone restart hota hai, tab bhi AsyncStorage me saved token aur user details safe rehte hain. Kyunki mobile me disk read/write slow ho sakta hai, iske saare methods `async/await` return karte hain taaki UI freeze na ho.

### D. How does Session Restoration work on App Startup?
- **English:** When the app launches, `AuthContext` runs a `useEffect` that reads the stored token from `AsyncStorage`. If present, it sets the in-memory Authorization header, calls `GET /api/v1/auth/me` to verify token validity, and updates `isAuthenticated: true`.
- **Hinglish:**
  1. User jab app open karta hai, toh `AuthNavigator` pehle loading splash screen dikhata hai.
  2. `AuthContext` check karta hai: "Kya phone me pehle se token saved hai?"
  3. Agar token milta hai, toh server ke `GET /api/v1/auth/me` endpoint par verify karta hai.
  4. Agar valid hai, toh user ko bina password pooche seedhe **Dashboard** par bhej deta hai.
  5. Agar token nahi hai ya expire ho chuka hai, toh **Login Screen** dikhata hai.

### E. Why do we separate the Service Layer from UI Components?
- **English:** The Service Layer (`src/services/`) encapsulates all HTTP communication details (endpoints, query params, headers). UI screens only call clean methods like `transactionService.createTransaction(data)`.
- **Hinglish:** Agar har screen ke andar hum `axios.post('http://...')` likhenge, toh code messy ho jayega aur agar backend ka URL ya endpoint change hua toh 10 screens me jaakar edit karna padega. Service layer saari networking logic ko ek jagah rakhti hai, jisse screens sirf UI aur user experience par focus karti hain.

### F. What is Pull-to-Refresh in React Native?
- **English:** A common mobile UX pattern where pulling down on a scrollable list triggers a data re-fetch. In React Native, it is implemented using the `refreshControl` prop on `FlatList` or `ScrollView` with the `RefreshControl` component.
- **Hinglish:** Jab user screen ko upar se neeche pull karta hai, toh ek circular spinner ghoomta hai aur server se taaza (fresh) data download ho jata hai. Isse user ko app restart kiye bina latest balance aur transactions dikh jate hain.

---

# VIVA QUESTIONS & ANSWERS (TOP 35 FOR CSE 2ND YEAR VIVA)

### Q1. What is the difference between Stack Navigation and Bottom Tab Navigation in React Navigation?
**Answer:** Bottom Tab Navigation keeps the primary, top-level application screens (Home, Transactions, Budgets, Profile) accessible at the bottom of the screen at all times. Stack Navigation operates on a Last-In-First-Out (LIFO) stack of screens, pushing new sub-screens (like Add Transaction, Transaction Details) on top and popping them when the user navigates back.

### Q2. Why is `FlatList` preferred over `ScrollView` when rendering long transaction lists?
**Answer:** `ScrollView` renders all child elements into memory at once, which causes severe memory bottlenecks and UI lag when dealing with dozens or hundreds of items. `FlatList` uses virtualization: it renders only the items currently visible in the viewport and recycles off-screen views, ensuring smooth 60 FPS scrolling.

### Q3. What is the role of `useMemo` in our `TransactionContext`?
**Answer:** `useMemo` caches (memoizes) the calculation of derived financial metrics (total income, total expenses, net balance). It recomputes these values only when the `transactions` array changes, avoiding expensive re-calculations on every general component re-render.

### Q4. What is a "Controlled Component" in React Native forms?
**Answer:** A controlled component is an input element (like `TextInput`) whose current value is driven by React component state (`value={amount}`) and updated through an event callback (`onChangeText={setAmount}`). This allows the developer to inspect, format, and validate input on every keystroke.

### Q5. What is the React Context API and why did we choose it over Redux for SpendWise?
**Answer:** React Context provides a lightweight built-in mechanism for passing state across the component tree without prop drilling. For a second-year college project, Context API is clean, beginner-friendly, and has zero external dependencies, whereas Redux adds significant boilerplate (actions, reducers, dispatchers) that is unnecessary at this scale.

### Q6. What is Node.js and how is it different from JavaScript in the browser?
**Answer:** Node.js is an open-source, cross-platform JavaScript runtime built on Chrome's V8 engine that executes JavaScript code outside a browser. Browser JavaScript interacts with the DOM and window objects, while Node.js interacts with the operating system, file system, network sockets, and databases.

### Q7. What is Express.js and what role does it play in the SpendWise architecture?
**Answer:** Express.js is a minimalist web framework for Node.js. In SpendWise, it handles incoming HTTP REST API requests from the mobile client, routes them to controller functions, runs validation, interfaces with MongoDB via Mongoose, and returns structured JSON responses.

### Q8. What is MongoDB and how does it differ from relational databases like MySQL?
**Answer:** MongoDB is a NoSQL document database that stores records as flexible BSON (binary JSON) documents rather than rigid tables with rows and columns. It allows dynamic schemas, nested objects (embedded arrays), and horizontal scaling without requiring strict SQL schema migrations.

### Q9. What is Mongoose and why do we use it with MongoDB?
**Answer:** Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. Although MongoDB is schema-less, Mongoose provides schema validation, type casting, default values, pre/post middleware hooks, and model indexing to ensure data integrity.

### Q10. What are the standard HTTP methods used in REST APIs and how are they used in SpendWise?
**Answer:**
- `GET /api/v1/transactions`: Retrieves transaction records and summary metrics.
- `POST /api/v1/transactions`: Creates a new income or expense document in MongoDB.
- `PUT /api/v1/transactions/:id`: Updates an existing transaction record.
- `DELETE /api/v1/transactions/:id`: Deletes a specific transaction by its ID.

### Q11. What is the purpose of HTTP status codes like 200, 201, 400, 401, 404, and 500?
**Answer:**
- `200 OK`: Successful read, update, or delete operation.
- `201 Created`: Successfully created a new document (user or transaction).
- `400 Bad Request`: Client error (e.g. negative amount, missing category, invalid ObjectId).
- `401 Unauthorized`: Request missing valid authentication credentials or token has expired.
- `404 Not Found`: Target resource or endpoint does not exist.
- `500 Internal Server Error`: Unexpected server or database exception.

### Q12. How does centralized error-handling middleware work in Express?
**Answer:** In Express, an error-handling middleware is defined with four parameters: `(err, req, res, next)`. When an error is passed to `next(err)` anywhere in a controller, Express bypasses normal routes and delegates execution to this middleware, which formats a consistent JSON error response and sets the correct HTTP status code.

### Q13. What is a compound index in MongoDB and why did we add one to the Budget model?
**Answer:** A compound index indexes multiple fields together. In the Budget model, we created a unique compound index on `{ userId: 1, category: 1, month: 1, year: 1 }`. This enforces a business rule at the database level: a user cannot accidentally create duplicate budgets for the same category in the same month and year.

### Q14. Why did we separate the mock data file from backend services in Phase 4 and 5?
**Answer:** To maintain separation of concerns. In software architecture, mock data is strictly for frontend UI simulation during early development. Keeping it isolated ensures that when we integrate the real Axios service in Phase 8, no mock data leaks into backend production workflows.

### Q15. Why is `.env` added to `.gitignore` and what is `.env.example`?
**Answer:** `.env` contains sensitive secrets, database connection strings, and JWT keys that must never be exposed publicly on GitHub. `.env.example` serves as a safe template containing placeholder keys so other developers or evaluators know which environment variables are required to run the project.

### Q16. What is JSON Web Token (JWT) and what are its three parts?
**Answer:** JWT is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. Its three parts are:
1. **Header:** Contains token type (`JWT`) and the signing algorithm (e.g. `HS256`).
2. **Payload:** Contains claims such as user ID (`id`) and expiration timestamp (`exp`).
3. **Signature:** Generated by hashing the base64-encoded header and payload with a secret key (`JWT_SECRET`).

### Q17. Why is JWT authentication considered "stateless"?
**Answer:** Traditional session-based authentication requires the server to store active session IDs in server memory or a database (like Redis). In contrast, with JWT, all required user state is contained inside the signed token itself. The server simply verifies the digital signature without performing a database lookup on every single request, enabling horizontal scalability.

### Q18. How does `bcrypt` prevent rainbow table and dictionary attacks?
**Answer:** Bcrypt generates a random cryptographic salt for each password before hashing and incorporates a configurable "cost factor" (work factor). The salt ensures that identical passwords produce completely different hash strings, defeating precomputed rainbow tables. The work factor deliberately slows down hash computation, making brute-force dictionary attacks computationally prohibitive.

### Q19. What is the difference between encryption and hashing?
**Answer:** Hashing is a one-way mathematical function: once data (like a password) is hashed, it cannot be decrypted back into plain text. Encryption is a two-way function where ciphertext can be decrypted back into plain text using a secret key. Passwords must always be hashed, never encrypted.

### Q20. How does the `authMiddleware` verify user authorization on private endpoints?
**Answer:** The middleware checks the HTTP `Authorization` request header for a format of `Bearer <token>`. It verifies the token using `jwt.verify(token, process.env.JWT_SECRET)`. If valid, it queries MongoDB for the user document (`User.findById(decoded.id).select('-password')`), attaches the authenticated user object to `req.user`, and calls `next()`. If invalid or expired, it returns `401 Unauthorized`.

### Q21. What is an IDOR (Insecure Direct Object Reference) vulnerability and how did we prevent it?
**Answer:** IDOR occurs when an application exposes a reference to an internal database object (like a transaction ID or user ID) and trusts client input to access that object without validating ownership. We prevented IDOR by never trusting a `userId` supplied in the request body or parameters. Instead, all database operations strictly filter by the authenticated `req.user._id` extracted from the cryptographically verified JWT token.

### Q22. What happens if a user tries to edit or delete another user's transaction in SpendWise?
**Answer:** In `transactionController.js`, queries use `{ _id: id, userId: req.user._id }`. If User B attempts to access or delete User A's transaction, MongoDB finds no matching document for User B's ID. The controller responds with `404 Not Found` ("Transaction not found with id: ..."), preventing unauthorized access and confirming complete data isolation.

### Q23. What is AsyncStorage and why is it used in React Native?
**Answer:** `AsyncStorage` is an unencrypted, asynchronous, persistent key-value storage system for React Native. We use it to persist the user's JWT authentication token (`@spendwise_token`) and user profile (`@spendwise_user`) on the mobile device so the user remains logged in across app restarts.

### Q24. How does SpendWise handle session restoration when the app launches?
**Answer:** On startup, `AuthContext` executes a `useEffect` hook that checks `AsyncStorage` for a stored token. While checking, `isLoading` is true, displaying a SpendWise splash screen. If a token is found, it calls `GET /api/v1/auth/me` to verify that the token is still active on the server. If valid, the user state is restored and `isAuthenticated` becomes `true`, causing `AuthNavigator` to switch from the Auth Stack to the Main App Stack.

### Q25. Why did we wrap `<AuthProvider>` outside `<TransactionProvider>` in `App.js`?
**Answer:** In React, a Context Provider can only consume values from providers that sit above it in the component tree. Since `TransactionContext` depends on `useAuth()` to check `isAuthenticated` and to trigger transaction loading only when a user logs in, `AuthProvider` must wrap `TransactionProvider`.

### Q26. What is an Axios Request Interceptor and how is it used in SpendWise?
**Answer:** An Axios request interceptor intercepts outgoing HTTP requests before they are sent over the network. In SpendWise, the request interceptor checks if an authentication token exists (in memory or AsyncStorage) and automatically injects the `Authorization: Bearer <token>` header into every outgoing request.

### Q27. Why do we normalize MongoDB `_id` to `id` in the frontend?
**Answer:** MongoDB uniquely identifies documents using an internal `_id` field (an ObjectId). However, standard React components (such as `FlatList` `keyExtractor`) and frontend code expect a standard `id` property. Normalizing `item._id` to `item.id` upon receiving API responses prevents key collisions and keeps UI code clean.

### Q28. What is the difference between optimistic UI updates and pessimistic confirmation?
**Answer:**
- **Optimistic UI:** The app updates local state immediately before the network request finishes, assuming success. If the request fails, the app must roll back the change.
- **Pessimistic Confirmation:** The app displays a loading indicator, waits for the backend server to confirm the database write with a `200` or `201` status code, and then updates the UI state. SpendWise uses pessimistic confirmation to ensure absolute financial data integrity.

### Q29. How does `RefreshControl` implement pull-to-refresh in React Native?
**Answer:** `RefreshControl` is passed as the `refreshControl` prop to a `FlatList` or `ScrollView`. It accepts `refreshing` (a boolean indicating whether data is currently being fetched) and `onRefresh` (an async callback that re-fetches data from the backend). When the user drags down on the list, `onRefresh` triggers `refreshTransactions()`.

### Q30. Why do we use `10.0.2.2` instead of `localhost` when testing on an Android Emulator?
**Answer:** In the Android Emulator architecture, `localhost` refers to the emulator's own internal virtual device loopback, not the host computer running the development server. The Android networking stack routes `10.0.2.2` specifically to the host development machine's loopback interface (`127.0.0.1`), allowing the emulator to communicate with the Node.js server.

### Q31. What is the Mongoose `select('-password')` modifier and why is it essential?
**Answer:** When querying user documents from MongoDB, appending `.select('-password')` explicitly excludes the hashed password field from the returned document. This prevents password hashes from accidentally leaking into API responses or client-side storage.

### Q32. What is the purpose of the Mongoose `pre('save')` hook?
**Answer:** A `pre('save')` middleware hook executes automatically before a Mongoose document is saved to the database. In our `User` model, it checks if the password field was modified (`this.isModified('password')`); if so, it hashes the plain-text password using `bcrypt` before writing to MongoDB.

### Q33. How does SpendWise prevent duplicate user registrations?
**Answer:**
1. At the database level: the `email` field in the `User` schema has `unique: true` and `lowercase: true`.
2. At the controller level: `authController.register` queries `User.findOne({ email })`. If a user already exists, it immediately returns a `400 Bad Request` with an informative error message ("A user with this email address already exists").

### Q34. How are financial totals (balance, income, expenses) kept in sync with MongoDB?
**Answer:** `TransactionContext` stores the active transaction list in React state. Whenever a user adds, edits, or deletes a transaction, the operation updates the backend database and updates the local state array. A `useMemo` hook immediately re-calculates `totalIncome`, `totalExpenses`, and `totalBalance = totalIncome - totalExpenses`, propagating the updated figures instantly to the `DashboardScreen`.

### Q35. What is the purpose of the `serverSelectionTimeoutMS: 5000` option in Mongoose?
**Answer:** By default, Mongoose may hang for up to 30 seconds trying to reach an unreachable MongoDB server. Setting `serverSelectionTimeoutMS: 5000` forces Mongoose to fail fast after 5 seconds, providing an immediate and actionable error message in the console rather than causing the application to hang indefinitely.

---
