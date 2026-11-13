import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DesignSystemPreviewScreen from '../screens/DesignSystemPreviewScreen';
import { ROUTES } from '../constants/routes';
import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();

/**
 * Authentication Stack Navigator
 * Manages screen transitions between Login, Register, Forgot Password,
 * and the Phase 2 Design System Preview.
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
