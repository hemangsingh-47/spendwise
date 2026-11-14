import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
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
import { colors, fontWeights } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

/**
 * SpendWise Protected Application Navigator
 * Seamlessly manages authentication state:
 * - Shows loading splash while verifying persisted AsyncStorage tokens
 * - Renders Login & Register when unauthenticated
 * - Renders Dashboard, Tabs & Transaction CRUD when authenticated
 */
export default function AuthNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Session Restoration Loading Splash
  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>₹</Text>
        </View>
        <Text style={styles.appName}>SpendWise</Text>
        <ActivityIndicator size="small" color={colors.black} style={styles.spinner} />
        <Text style={styles.loadingText}>Restoring session...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        // 2. Unauthenticated Flow (Login / Register / Forgot Password)
        <Stack.Group>
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
        </Stack.Group>
      ) : (
        // 3. Authenticated Flow (Main App Tabs & Transaction CRUD)
        <Stack.Group>
          <Stack.Screen
            name={ROUTES.MAIN_APP}
            component={MainTabNavigator}
            options={{ title: 'SpendWise' }}
          />
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
        </Stack.Group>
      )}

      {/* 4. Common Design System Showcase (Accessible for viva and inspection) */}
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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: fontWeights.bold,
  },
  appName: {
    fontSize: 24,
    fontWeight: fontWeights.bold,
    color: colors.black,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: fontWeights.medium,
  },
});
