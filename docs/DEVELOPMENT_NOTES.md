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
