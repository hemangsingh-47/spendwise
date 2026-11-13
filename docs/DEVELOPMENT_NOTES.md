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
