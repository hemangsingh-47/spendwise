# SpendWise – Project Architecture

This document describes the architectural layout, directory responsibilities, component hierarchy, navigation design, and design philosophies of **SpendWise – Personal Expense Tracker**.

---

## 1. Directory Structure

```text
SpendWise/
│
├── assets/                  # Static assets: images, app icons, and fonts
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── src/                     # Application source code
│   ├── components/          # Reusable UI components (Button, Input, Card, etc.)
│   ├── screens/             # Screen components (Login, Register, ForgotPassword)
│   ├── navigation/          # React Navigation navigators (AuthNavigator, AppNavigator)
│   ├── services/            # API services and networking (Future phases)
│   ├── context/             # Global React Context providers (Auth, Expense) (Future phases)
│   ├── hooks/               # Custom React hooks (Future phases)
│   ├── constants/           # App-wide constants (routes, strings)
│   ├── utils/               # Helper and validation utilities
│   └── styles/              # Theme, colors, typography, and global styles
│
├── docs/                    # Architectural, phase tracking, and viva notes
│   ├── DEVELOPMENT_NOTES.md
│   ├── PROJECT_ARCHITECTURE.md
│   └── PHASE_TRACKER.md
│
├── App.js                   # Root entry point initializing navigation and providers
├── app.json                 # Expo configuration (app metadata, icons, orientation)
├── package.json             # NPM project manifest & dependencies
└── .gitignore               # Git ignored directories (node_modules, .expo, etc.)
```

---

## 2. Directory Responsibilities

| Directory | Purpose & Responsibility |
|---|---|
| `assets/` | Holds static images, splash screens, vector icons, and custom fonts. |
| `src/components/` | Reusable presentational components (dumb/pure components) that receive props and trigger callbacks without direct coupling to business logic. |
| `src/screens/` | Full-screen components representing pages in the application stack (e.g., `LoginScreen`, `RegisterScreen`, `ForgotPasswordScreen`). Responsible for screen-level state and form handling. |
| `src/navigation/` | Configures React Navigation stack, tab, and drawer navigators, defining route names and transition behavior. |
| `src/styles/` | Houses the centralized design system (`theme.js`), ensuring consistent color palettes, typography scales, spacing units, and border radiuses. |
| `src/utils/` | Reusable pure JavaScript utility functions such as input validators, currency formatters, and date parsers. |
| `src/constants/` | Constant definitions like navigation route names (`ROUTES`) to avoid typos in string literals. |
| `docs/` | Comprehensive technical notes, viva preparation guides, and milestone progress trackers. |

---

## 3. Component Architecture & Principles

1. **Separation of Concerns:**
   - Presentational components (`Button`, `Input`, `Card`, `ScreenContainer`) handle only visual styling and interaction feedback.
   - Screen components manage user input, validation logic, and navigation calls.
2. **Centralized Theming:**
   - All components pull styling rules (colors, padding, font sizes) from `src/styles/theme.js`.
   - No hardcoded hex values or arbitrary margin/padding values are scattered across screens.
3. **Pure JavaScript & Beginner-Friendly Code:**
   - Standard React functional components and standard hooks (`useState`, `useCallback`).
   - Clean, readable variable names and explicit comments in simple Hinglish for viva presentation.

---

## 4. Screen Organization & Navigation Structure

In Phases 1–3, the navigation architecture centers around the **Authentication Stack**:

```text
NavigationContainer
└── AuthNavigator (Native Stack)
    ├── LoginScreen ("Login")
    ├── RegisterScreen ("Register")
    └── ForgotPasswordScreen ("ForgotPassword")
```

- **Transitions:**
  - `LoginScreen` ➔ `RegisterScreen` (`navigation.navigate('Register')`)
  - `LoginScreen` ➔ `ForgotPasswordScreen` (`navigation.navigate('ForgotPassword')`)
  - `RegisterScreen` ➔ `LoginScreen` (`navigation.navigate('Login')` or `navigation.goBack()`)
  - `ForgotPasswordScreen` ➔ `LoginScreen` (`navigation.navigate('Login')` or `navigation.goBack()`)

---

## 5. Frontend & Backend Separation (Strict Scope Boundary)

- **Current State (Phases 1–3):**
  - Completely **Frontend-only**.
  - All form validation occurs locally using client-side JavaScript regex and length checks.
  - No network requests, mock endpoints, or localStorage / AsyncStorage are executed.
- **Future Scope (Phases 7–10):**
  - Dedicated Node.js & Express REST API server.
  - MongoDB database integration.
  - JWT tokens stored in AsyncStorage.
