import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DesignSystemPreviewScreen from '../screens/DesignSystemPreviewScreen';
import MainTabNavigator from './MainTabNavigator';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import EditTransactionScreen from '../screens/EditTransactionScreen';
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import { ROUTES } from '../constants/routes';
import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();

/**
 * SpendWise Root Application Stack Navigator
 * Coordinates transitions between Authentication screens (Phase 3),
 * Main Tab Navigation (Phase 4), Transaction CRUD screens (Phase 5),
 * and the Design System Showcase (Phase 2).
 */
export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.LOGIN}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      {/* 1. Authentication Screens (Phase 3) */}
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={LoginScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen
        name={ROUTES.REGISTER}
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />

      {/* 2. Main Tab Application (Phase 4) */}
      <Stack.Screen
        name={ROUTES.MAIN_APP}
        component={MainTabNavigator}
        options={{ title: 'SpendWise' }}
      />

      {/* 3. Transaction Management Screens (Phase 5) */}
      <Stack.Screen
        name={ROUTES.ADD_TRANSACTION}
        component={AddTransactionScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name={ROUTES.EDIT_TRANSACTION}
        component={EditTransactionScreen}
        options={{ title: 'Edit Transaction' }}
      />
      <Stack.Screen
        name={ROUTES.TRANSACTION_DETAILS}
        component={TransactionDetailsScreen}
        options={{ title: 'Transaction Details' }}
      />

      {/* 4. Design System Preview (Phase 2) */}
      <Stack.Screen
        name={ROUTES.DESIGN_SYSTEM_PREVIEW}
        component={DesignSystemPreviewScreen}
        options={{
          headerShown: true,
          title: 'Design System Preview',
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.black,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
